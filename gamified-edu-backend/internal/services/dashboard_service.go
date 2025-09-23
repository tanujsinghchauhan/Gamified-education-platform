package services

import (
	"gamified-edu-backend/internal/repositories"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type DashboardService interface {
	GetDashboardData(userID primitive.ObjectID) (*DashboardResponse, error)
}

type dashboardService struct {
	dashboardRepo repositories.DashboardRepository
	progressRepo  repositories.ProgressRepository
}

func NewDashboardService(dashboardRepo repositories.DashboardRepository, progressRepo repositories.ProgressRepository) DashboardService {
	return &dashboardService{dashboardRepo, progressRepo}
}

type DashboardResponse struct {
	LearningStreak   int     `json:"learning_streak"`
	TotalChapters    int64   `json:"total_chapters"`
	CompletedChapters int64   `json:"completed_chapters"`
	CompletionRate   float64 `json:"completion_rate"`
}

func (s *dashboardService) GetDashboardData(userID primitive.ObjectID) (*DashboardResponse, error) {
	// --- Get Metrics ---
	totalChapters, err := s.dashboardRepo.GetTotalChapterCount()
	if err != nil { return nil, err }

	completedChapters, err := s.progressRepo.CountCompletedChapters(userID, primitive.NilObjectID) // Pass NilObjectID to count all
	if err != nil { return nil, err }

	var completionRate float64
	if totalChapters > 0 {
		completionRate = (float64(completedChapters) / float64(totalChapters)) * 100
	}

	// --- Calculate Streak ---
	timestamps, err := s.dashboardRepo.GetRecentActivityTimestamps(userID)
	if err != nil { return nil, err }
	streak := calculateStreak(timestamps)

	// --- Assemble Response ---
	response := &DashboardResponse{
		LearningStreak:    streak,
		TotalChapters:     totalChapters,
		CompletedChapters: completedChapters,
		CompletionRate:    completionRate,
	}
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