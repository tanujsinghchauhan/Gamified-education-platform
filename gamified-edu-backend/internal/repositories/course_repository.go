package repositories

import (
    "context"
    "gamified-edu-backend/internal/models"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
)

type CourseRepository interface {
    FindAll() ([]models.Course, error)
    FindByID(id primitive.ObjectID) (*models.Course, error)
}

type courseRepository struct {
    collection *mongo.Collection
}

func NewCourseRepository(db *mongo.Database) CourseRepository {
    return &courseRepository{collection: db.Collection("courses")}
}

func (r *courseRepository) FindAll() ([]models.Course, error) {
    var courses []models.Course
    cursor, err := r.collection.Find(context.Background(), bson.M{})
    if err != nil {
        return nil, err
    }
    if err = cursor.All(context.Background(), &courses); err != nil {
        return nil, err
    }
    return courses, nil
}

func (r *courseRepository) FindByID(id primitive.ObjectID) (*models.Course, error) {
    var course models.Course
    err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&course)
    if err != nil {
        return nil, err
    }
    return &course, nil
}