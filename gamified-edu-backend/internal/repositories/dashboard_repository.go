package repositories

import (
	"context"
	"gamified-edu-backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type DashboardRepository interface {
	GetTotalChapterCount() (int64, error)
	GetRecentActivityTimestamps(userID primitive.ObjectID) ([]time.Time, error)
}

type dashboardRepository struct {
	courseCollection   *mongo.Collection
	activityCollection *mongo.Collection
}

func NewDashboardRepository(db *mongo.Database) DashboardRepository {
	return &dashboardRepository{
		courseCollection:   db.Collection("courses"),
		activityCollection: db.Collection("activities"),
	}
}

// Uses an aggregation pipeline to count all chapters across all courses
func (r *dashboardRepository) GetTotalChapterCount() (int64, error) {
	pipeline := mongo.Pipeline{
		{{"$project", bson.D{{"chapterCount", bson.D{{"$size", "$chapters"}}}}}},
		{{"$group", bson.D{{"_id", nil}, {"totalChapters", bson.D{{"$sum", "$chapterCount"}}}}}},
	}

	cursor, err := r.courseCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return 0, err
	}
	defer cursor.Close(context.Background())

	if cursor.Next(context.Background()) {
		var result struct {
			TotalChapters int64 `bson:"totalChapters"`
		}
		if err := cursor.Decode(&result); err != nil {
			return 0, err
		}
		return result.TotalChapters, nil
	}
	return 0, nil // No courses found
}

// Fetches the last 30 days of activity timestamps for streak calculation
func (r *dashboardRepository) GetRecentActivityTimestamps(userID primitive.ObjectID) ([]time.Time, error) {
	thirtyDaysAgo := time.Now().AddDate(0, 0, -30)
	filter := bson.M{
		"user_id":   userID,
		"timestamp": bson.M{"$gte": thirtyDaysAgo},
	}
	opts := options.Find().SetSort(bson.D{{"timestamp", -1}}) // Sort by most recent

	cursor, err := r.activityCollection.Find(context.Background(), filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var timestamps []time.Time
	for cursor.Next(context.Background()) {
		var activity models.UserActivity
		if err := cursor.Decode(&activity); err == nil {
			timestamps = append(timestamps, activity.Timestamp)
		}
	}
	return timestamps, nil
}