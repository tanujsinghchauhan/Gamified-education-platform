package routes

import (
	"gamified-edu-backend/internal/controllers"
	"gamified-edu-backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func CourseRoutes(router *gin.RouterGroup, ctrl *controllers.CourseController) {
	courses := router.Group("/courses")
	courses.Use(middleware.AuthMiddleware())
	{
		courses.GET("/", ctrl.GetAllCourses)
		courses.GET("/:courseId", ctrl.GetCourseDetails)
	}
}