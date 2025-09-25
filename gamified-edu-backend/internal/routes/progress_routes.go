package routes

import (
    "gamified-edu-backend/internal/controllers"
    "gamified-edu-backend/internal/middleware"
    "github.com/gin-gonic/gin"
)

func ProgressRoutes(router *gin.RouterGroup, ctrl *controllers.ProgressController) {
    progress := router.Group("/progress")
    progress.Use(middleware.AuthMiddleware())
    {
        // A single, powerful route to handle all component updates
        progress.POST("/course/:courseId/chapter/:chapterId/:component", ctrl.MarkComponentComplete)
        // Get user progress for a course
        progress.GET("/course/:courseId", ctrl.GetCourseProgress)
    }
}