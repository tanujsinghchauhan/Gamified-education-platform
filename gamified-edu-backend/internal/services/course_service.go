package services

import (
    "gamified-edu-backend/internal/repositories"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type CourseService interface {
    GetAllCoursesWithProgress(userID primitive.ObjectID) ([]CourseResponse, error)
    GetCourseDetails(courseID, userID primitive.ObjectID) (*CourseDetailResponse, error)
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

type CourseDetailResponse struct {
    ID          primitive.ObjectID     `json:"id"`
    Title       string                 `json:"title"`
    Description string                 `json:"description"`
    Chapters    []ChapterWithProgress  `json:"chapters"`
    Progress    int                    `json:"progress"`
}

type ChapterWithProgress struct {
    ID               primitive.ObjectID `json:"id"`
    Title            string             `json:"title"`
    ChapterNumber    int                `json:"chapter_number"`
    VideoURL         string             `json:"video_url"`
    QuizID           string             `json:"quiz_id"`
    PPTLink          string             `json:"ppt_link"`
    DurationMins     int                `json:"duration_mins"`
    HasViewedVideo   bool               `json:"has_viewed_video"`
    HasCompletedQuiz bool               `json:"has_completed_quiz"`
    HasDownloadedPPT bool               `json:"has_downloaded_ppt"`
    IsCompleted      bool               `json:"is_completed"`
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

func (s *courseService) GetCourseDetails(courseID, userID primitive.ObjectID) (*CourseDetailResponse, error) {
    course, err := s.courseRepo.FindByID(courseID)
    if err != nil { return nil, err }

    var chaptersWithProgress []ChapterWithProgress
    completedChapters := 0

    for _, chapter := range course.Chapters {
        // Get progress for this specific chapter
        progress, err := s.progressRepo.FindByUserAndChapter(userID, chapter.ID)
        
        hasViewedVideo := false
        hasCompletedQuiz := false
        hasDownloadedPPT := false
        isCompleted := false

        if err == nil && progress != nil {
            hasViewedVideo = progress.HasViewedVideo
            hasCompletedQuiz = progress.HasCompletedQuiz
            hasDownloadedPPT = progress.HasDownloadedPPT
            isCompleted = progress.IsChapterCompleted
            
            if isCompleted {
                completedChapters++
            }
        }

        chaptersWithProgress = append(chaptersWithProgress, ChapterWithProgress{
            ID:               chapter.ID,
            Title:            chapter.Title,
            ChapterNumber:    chapter.ChapterNumber,
            VideoURL:         chapter.VideoURL,
            QuizID:           chapter.QuizID,
            PPTLink:          chapter.PPTLink,
            DurationMins:     chapter.DurationMins,
            HasViewedVideo:   hasViewedVideo,
            HasCompletedQuiz: hasCompletedQuiz,
            HasDownloadedPPT: hasDownloadedPPT,
            IsCompleted:      isCompleted,
        })
    }

    totalChapters := len(course.Chapters)
    progress := 0
    if totalChapters > 0 {
        progress = int((float64(completedChapters) / float64(totalChapters)) * 100)
    }

    response := &CourseDetailResponse{
        ID:          course.ID,
        Title:       course.Title,
        Description: course.Description,
        Chapters:    chaptersWithProgress,
        Progress:    progress,
    }

    return response, nil
}