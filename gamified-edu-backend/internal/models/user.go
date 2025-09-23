package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// User now includes XP and Level for gamification
type User struct {
    ID           primitive.ObjectID `bson:"_id,omitempty"`
    FirstName    string             `bson:"first_name"`
    LastName     string             `bson:"last_name"`
    Email        string             `bson:"email"`
    PasswordHash string             `bson:"password_hash"`
    XP           int                `bson:"xp"`    // New field for experience points
    Level        int                `bson:"level"` // New field for user level
}