package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Course struct {
    ID          primitive.ObjectID `bson:"_id,omitempty"`
    Title       string             `bson:"title"`
    Description string             `bson:"description"`
    Chapters    []Chapter          `bson:"chapters"`
}

type Chapter struct {
    ID            primitive.ObjectID `bson:"_id,omitempty"`
    Title         string             `bson:"title"`
    ChapterNumber int                `bson:"chapter_number"`
    VideoURL      string             `bson:"video_url"`
    QuizID        string             `bson:"quiz_id"`
    PPTLink       string             `bson:"ppt_link"`
    DurationMins  int                `bson:"duration_mins"` // <-- ADD THIS LINE
}