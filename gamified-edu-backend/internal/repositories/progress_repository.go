package repositories

import (
	"context"
	"errors"
	"gamified-edu-backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options" // This line was removed
)

type ProgressRepository interface {
	FindOrCreateStatus(userID, chapterID, courseID primitive.ObjectID) (*models.UserChapterStatus, error)
	UpdateStatus(status *models.UserChapterStatus) error
	CountCompletedChapters(userID, courseID primitive.ObjectID) (int64, error)
}

type progressRepository struct {
	collection *mongo.Collection
}

func NewProgressRepository(db *mongo.Database) ProgressRepository {
	return &progressRepository{collection: db.Collection("progress")}
}

func (r *progressRepository) FindOrCreateStatus(userID, chapterID, courseID primitive.ObjectID) (*models.UserChapterStatus, error) {
	filter := bson.M{"user_id": userID, "chapter_id": chapterID}
	var status models.UserChapterStatus

	err := r.collection.FindOne(context.Background(), filter).Decode(&status)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			newStatus := models.UserChapterStatus{
				UserID:    userID,
				ChapterID: chapterID,
				CourseID:  courseID,
			}
			_, insertErr := r.collection.InsertOne(context.Background(), newStatus)
			if insertErr != nil {
				return nil, insertErr
			}
			return &newStatus, nil
		}
		return nil, err
	}
	return &status, nil
}

func (r *progressRepository) UpdateStatus(status *models.UserChapterStatus) error {
	filter := bson.M{"_id": status.ID}
	_, err := r.collection.UpdateOne(context.Background(), filter, bson.M{"$set": status})
	return err
}

func (r *progressRepository) CountCompletedChapters(userID, courseID primitive.ObjectID) (int64, error) {
	filter := bson.M{
		"user_id":                userID,
		"is_chapter_completed": true,
	}
    // If a specific course ID is provided, add it to the filter
    if !courseID.IsZero() {
        filter["course_id"] = courseID
    }

	return r.collection.CountDocuments(context.Background(), filter)
}