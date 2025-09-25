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
	FindByUserAndChapter(userID, chapterID primitive.ObjectID) (*models.UserChapterStatus, error)
	GetUserCourseProgress(userID, courseID primitive.ObjectID) ([]*models.UserChapterStatus, error)
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

func (r *progressRepository) FindByUserAndChapter(userID, chapterID primitive.ObjectID) (*models.UserChapterStatus, error) {
	filter := bson.M{"user_id": userID, "chapter_id": chapterID}
	var status models.UserChapterStatus
	err := r.collection.FindOne(context.Background(), filter).Decode(&status)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil // Return nil instead of error for no documents
		}
		return nil, err
	}
	return &status, nil
}

func (r *progressRepository) GetUserCourseProgress(userID, courseID primitive.ObjectID) ([]*models.UserChapterStatus, error) {
	filter := bson.M{"user_id": userID, "course_id": courseID}
	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var progressList []*models.UserChapterStatus
	for cursor.Next(context.Background()) {
		var progress models.UserChapterStatus
		if err := cursor.Decode(&progress); err != nil {
			return nil, err
		}
		progressList = append(progressList, &progress)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return progressList, nil
}