package controllers

import (
    "gamified-edu-backend/internal/services"
    "gamified-edu-backend/pkg"
    "net/http"
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type CourseController struct {
    courseService services.CourseService
}

func NewCourseController(courseService services.CourseService) *CourseController {
    return &CourseController{courseService: courseService}
}

func (ctrl *CourseController) GetAllCourses(c *gin.Context) {
    val, exists := c.Get("userID")
    if !exists {
        pkg.SendError(c, http.StatusUnauthorized, "User not authenticated")
        return
    }
    userID := val.(primitive.ObjectID)
    courses, err := ctrl.courseService.GetAllCoursesWithProgress(userID)
    if err != nil {
        pkg.SendError(c, http.StatusInternalServerError, err.Error())
        return
    }
    pkg.SendResponse(c, http.StatusOK, courses)
}