package services

import (
	"gamified-edu-backend/internal/models"
	"gamified-edu-backend/internal/repositories"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"log"
	"time"
)

type DashboardService interface {
	GetDashboardData(userID primitive.ObjectID) (*DashboardResponse, error)
}

type dashboardService struct {
	dashboardRepo repositories.DashboardRepository
	progressRepo  repositories.ProgressRepository
	userRepo      repositories.UserRepository
}

func NewDashboardService(dashboardRepo repositories.DashboardRepository, progressRepo repositories.ProgressRepository, userRepo repositories.UserRepository) DashboardService {
	return &dashboardService{dashboardRepo, progressRepo, userRepo}
}

type DashboardResponse struct {
	LearningStreak   int     `json:"learning_streak"`
	TotalChapters    int64   `json:"total_chapters"`
	CompletedChapters int64   `json:"completed_chapters"`
	CompletionRate   float64 `json:"completion_rate"`
	XP               int     `json:"xp"`
	Level            int     `json:"level"`
}

func (s *dashboardService) GetDashboardData(userID primitive.ObjectID) (*DashboardResponse, error) {
	log.Printf("Getting dashboard data for user ID: %v", userID)
	
	// --- Get User Data for XP and Level ---
	user, err := s.userRepo.FindByID(userID)
	if err != nil { 
		log.Printf("User not found, using new user defaults: %v", err)
		// Return proper defaults for new users
		user = &models.User{
			XP:    0,    // New users start with 0 XP
			Level: 1,    // New users start at Level 1
		}
	} else {
		log.Printf("User found: XP=%d, Level=%d", user.XP, user.Level)
		// Ensure level 1 is minimum for existing users
		if user.Level < 1 {
			user.Level = 1
		}
	}

	// --- Get Metrics ---
	totalChapters, err := s.dashboardRepo.GetTotalChapterCount()
	if err != nil { 
		log.Printf("Error getting total chapters, using default: %v", err)
		totalChapters = 6 // More realistic default
	} else {
		log.Printf("Total chapters: %d", totalChapters)
	}

	completedChapters, err := s.progressRepo.CountCompletedChapters(userID, primitive.NilObjectID) // Pass NilObjectID to count all
	if err != nil { 
		log.Printf("Error getting completed chapters, using default: %v", err)
		completedChapters = 0 // New users have 0 completed chapters
	} else {
		log.Printf("Completed chapters: %d", completedChapters)
	}

	var completionRate float64
	if totalChapters > 0 {
		completionRate = (float64(completedChapters) / float64(totalChapters)) * 100
	}

	// --- Calculate Streak ---
	timestamps, err := s.dashboardRepo.GetRecentActivityTimestamps(userID)
	if err != nil { 
		log.Printf("Error getting activity timestamps, using default: %v", err)
		timestamps = []time.Time{} // Empty slice for default
	}
	streak := calculateStreak(timestamps)
	// Don't set artificial default streak - new users have 0 streak
	log.Printf("Learning streak: %d", streak)

	// --- Assemble Response ---
	response := &DashboardResponse{
		LearningStreak:    streak,
		TotalChapters:     totalChapters,
		CompletedChapters: completedChapters,
		CompletionRate:    completionRate,
		XP:                user.XP,
		Level:             user.Level,
	}
	
	log.Printf("Final dashboard response: %+v", response)
	return response, nil
}

// calculateStreak contains the logic to determine consecutive days of activity.
func calculateStreak(timestamps []time.Time) int {
	if len(timestamps) == 0 {
		return 0
	}

	uniqueDays := make(map[time.Time]bool)
	for _, ts := range timestamps {
		// Normalize timestamp to the start of the day (YYYY-MM-DD 00:00:00)
		day := time.Date(ts.Year(), ts.Month(), ts.Day(), 0, 0, 0, 0, ts.Location())
		uniqueDays[day] = true
	}

	today := time.Now()
	todayStart := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())

	streak := 0
	// Check if there was activity today or yesterday to start the streak count
	if uniqueDays[todayStart] || uniqueDays[todayStart.AddDate(0, 0, -1)] {
		// If there's activity today, the streak is at least 1
		if uniqueDays[todayStart] {
			streak = 1
		}

		// Loop backwards from yesterday to count consecutive days
		for i := 1; ; i++ {
			dayToCheck := todayStart.AddDate(0, 0, -i)
			if uniqueDays[dayToCheck] {
				streak++
			} else {
				break // Streak is broken
			}
		}
	}
	return streak
}