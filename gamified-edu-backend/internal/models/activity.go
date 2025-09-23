package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type UserActivity struct {
    ID        primitive.ObjectID `bson:"_id,omitempty"`
    UserID    primitive.ObjectID `bson:"user_id"`
    Timestamp time.Time          `bson:"timestamp"`
}