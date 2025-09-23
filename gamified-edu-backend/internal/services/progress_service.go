package services // <-- THIS LINE WAS MISSING

import (
	"errors"
	"gamified-edu-backend/internal/repositories"
	"log" // You need to import the log package
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const XP_PER_CHAPTER = 100
const XP_PER_LEVEL = 1000

type ProgressService interface {
	MarkComponentAsComplete(userID, chapterID, courseID primitive.ObjectID, component string) error
}

type progressService struct {
	progressRepo repositories.ProgressRepository
	userRepo     repositories.UserRepository
	activityRepo repositories.ActivityRepository
}

func NewProgressService(progressRepo repositories.ProgressRepository, userRepo repositories.UserRepository, activityRepo repositories.ActivityRepository) ProgressService {
	return &progressService{progressRepo, userRepo, activityRepo}
}

func (s *progressService) MarkComponentAsComplete(userID, chapterID, courseID primitive.ObjectID, component string) error {
	status, err := s.progressRepo.FindOrCreateStatus(userID, chapterID, courseID)
	if err != nil {
		return err
	}

	if status.IsChapterCompleted {
		return errors.New("chapter already completed")
	}

	switch component {
	case "video":
		status.HasViewedVideo = true
	case "quiz":
		status.HasCompletedQuiz = true
	case "ppt":
		status.HasDownloadedPPT = true
	default:
		return errors.New("invalid component type")
	}

	wasJustCompleted := false
	if status.HasViewedVideo && status.HasCompletedQuiz && status.HasDownloadedPPT {
		status.IsChapterCompleted = true
		wasJustCompleted = true
	}

	if err := s.progressRepo.UpdateStatus(status); err != nil {
		return err
	}

	if wasJustCompleted {
		user, err := s.userRepo.FindByID(userID)
		if err != nil {
			return err
		}

		user.XP += XP_PER_CHAPTER
		user.Level = user.XP / XP_PER_LEVEL

		if err := s.userRepo.UpdateXPAndLevel(user); err != nil {
			return err
		}

		// Log this completion as an activity for the streak
		if err := s.activityRepo.LogActivity(userID); err != nil {
			// Log the error but don't block the main flow
			log.Printf("Could not log activity for user %s: %v", userID.Hex(), err)
		}
	}

	return nil
}