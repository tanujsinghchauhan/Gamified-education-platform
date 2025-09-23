package routes

import (
	"gamified-edu-backend/internal/controllers"
	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.RouterGroup, ctrl *controllers.AuthController) {
	auth := router.Group("/auth")
	{
		auth.POST("/register", ctrl.Register)
		auth.POST("/login", ctrl.Login)
	}
}