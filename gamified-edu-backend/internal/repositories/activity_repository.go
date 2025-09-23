package repositories

import (
	"context"
	"gamified-edu-backend/internal/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

// ActivityRepository is the interface for activity data operations.
type ActivityRepository interface {
	LogActivity(userID primitive.ObjectID) error
}

type activityRepository struct {
	collection *mongo.Collection
}

// NewActivityRepository creates a new repository for activities.
func NewActivityRepository(db *mongo.Database) ActivityRepository {
	return &activityRepository{collection: db.Collection("activities")}
}

// LogActivity inserts a new document with the user's ID and the current time.
func (r *activityRepository) LogActivity(userID primitive.ObjectID) error {
	activity := models.UserActivity{
		UserID:    userID,
		Timestamp: time.Now(),
	}

	_, err := r.collection.InsertOne(context.Background(), activity)
	return err
}