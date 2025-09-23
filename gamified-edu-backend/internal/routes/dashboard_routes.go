package routes

import (
	"gamified-edu-backend/internal/controllers"
	"gamified-edu-backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func DashboardRoutes(router *gin.RouterGroup, ctrl *controllers.DashboardController) {
	dashboard := router.Group("/dashboard")
	dashboard.Use(middleware.AuthMiddleware())
	{
		dashboard.GET("/", ctrl.GetDashboard)
	}
}