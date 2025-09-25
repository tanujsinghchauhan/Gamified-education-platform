package services // <-- THIS LINE WAS MISSING

import (
	"errors"
	"gamified-edu-backend/internal/models"
	"gamified-edu-backend/internal/repositories"
	"log" // You need to import the log package
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const XP_PER_COMPONENT = 25  // XP for each activity (video, quiz, ppt)
const XP_CHAPTER_BONUS = 25  // Bonus XP for completing entire chapter
const XP_PER_LEVEL = 100     // XP needed to reach NEXT level (Level 1 = 0-99, Level 2 = 100-199, etc.)

type ProgressService interface {
	MarkComponentAsComplete(userID, chapterID, courseID primitive.ObjectID, component string) error
	GetUserCourseProgress(userID, courseID primitive.ObjectID) ([]*models.UserChapterStatus, error)
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

	// Award XP for the specific component completion
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}

	// Check if this component was already completed to avoid double XP
	componentAlreadyCompleted := false
	switch component {
	case "video":
		componentAlreadyCompleted = status.HasViewedVideo
		status.HasViewedVideo = true
	case "quiz":
		componentAlreadyCompleted = status.HasCompletedQuiz
		status.HasCompletedQuiz = true
	case "ppt":
		componentAlreadyCompleted = status.HasDownloadedPPT
		status.HasDownloadedPPT = true
	default:
		return errors.New("invalid component type")
	}

	// Award XP only if component wasn't already completed
	if !componentAlreadyCompleted {
		user.XP += XP_PER_COMPONENT
	}

	wasJustCompleted := false
	if status.HasViewedVideo && status.HasCompletedQuiz && status.HasDownloadedPPT && !status.IsChapterCompleted {
		status.IsChapterCompleted = true
		wasJustCompleted = true
		// Award bonus XP for completing entire chapter
		user.XP += XP_CHAPTER_BONUS
	}

	// Update user level based on new XP (Level 1 = 0-99 XP, Level 2 = 100-199 XP, etc.)
	user.Level = (user.XP / XP_PER_LEVEL) + 1

	if err := s.userRepo.UpdateXPAndLevel(user); err != nil {
		return err
	}

	if err := s.progressRepo.UpdateStatus(status); err != nil {
		return err
	}

	if wasJustCompleted {
		// Log this completion as an activity for the streak
		if err := s.activityRepo.LogActivity(userID); err != nil {
			// Log the error but don't block the main flow
			log.Printf("Could not log activity for user %s: %v", userID.Hex(), err)
		}
	}

	return nil
}

func (s *progressService) GetUserCourseProgress(userID, courseID primitive.ObjectID) ([]*models.UserChapterStatus, error) {
	return s.progressRepo.GetUserCourseProgress(userID, courseID)
}