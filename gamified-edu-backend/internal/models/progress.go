package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// This model is now much more detailed to track each component
type UserChapterStatus struct {
    ID                 primitive.ObjectID `bson:"_id,omitempty"`
    UserID             primitive.ObjectID `bson:"user_id"`
    ChapterID          primitive.ObjectID `bson:"chapter_id"`
    CourseID           primitive.ObjectID `bson:"course_id"`
    HasViewedVideo     bool               `bson:"has_viewed_video"`
    HasCompletedQuiz   bool               `bson:"has_completed_quiz"`
    HasDownloadedPPT   bool               `bson:"has_downloaded_ppt"`
    IsChapterCompleted bool               `bson:"is_chapter_completed"` // True when all 3 are done
}