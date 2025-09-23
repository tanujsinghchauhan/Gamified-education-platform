package services

import (
    "gamified-edu-backend/internal/repositories"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type CourseService interface {
    GetAllCoursesWithProgress(userID primitive.ObjectID) ([]CourseResponse, error)
}

type courseService struct {
    courseRepo   repositories.CourseRepository
    progressRepo repositories.ProgressRepository
}

func NewCourseService(courseRepo repositories.CourseRepository, progressRepo repositories.ProgressRepository) CourseService {
    return &courseService{courseRepo, progressRepo}
}

type CourseResponse struct {
    ID          primitive.ObjectID `json:"id"`
    Title       string             `json:"title"`
    Description string             `json:"description"`
    Progress    int                `json:"progress"`
}

func (s *courseService) GetAllCoursesWithProgress(userID primitive.ObjectID) ([]CourseResponse, error) {
    courses, err := s.courseRepo.FindAll()
    if err != nil { return nil, err }
    var responses []CourseResponse
    for _, course := range courses {
        totalChapters := len(course.Chapters)
        if totalChapters == 0 {
            responses = append(responses, CourseResponse{ID: course.ID, Title: course.Title, Description: course.Description, Progress: 0})
            continue
        }
        completedChapters, err := s.progressRepo.CountCompletedChapters(userID, course.ID)
        if err != nil { return nil, err }
        progress := int((float64(completedChapters) / float64(totalChapters)) * 100)
        responses = append(responses, CourseResponse{ID: course.ID, Title: course.Title, Description: course.Description, Progress: progress})
    }
    return responses, nil
}