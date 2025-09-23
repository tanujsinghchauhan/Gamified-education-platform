package routes

import (
	"gamified-edu-backend/internal/controllers"
	"gamified-edu-backend/internal/repositories"
	"gamified-edu-backend/internal/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

// RegisterRoutes sets up all the application routes and dependencies.
func RegisterRoutes(router *gin.Engine, db *mongo.Database) {
	// --- REPOSITORIES ---
	userRepo := repositories.NewUserRepository(db)
	courseRepo := repositories.NewCourseRepository(db)
	progressRepo := repositories.NewProgressRepository(db)
	dashboardRepo := repositories.NewDashboardRepository(db)
	activityRepo := repositories.NewActivityRepository(db)

	// --- SERVICES ---
	authService := services.NewAuthService(userRepo)
	courseService := services.NewCourseService(courseRepo, progressRepo)
	progressService := services.NewProgressService(progressRepo, userRepo, activityRepo)
	dashboardService := services.NewDashboardService(dashboardRepo, progressRepo)

	// --- CONTROLLERS ---
	authController := controllers.NewAuthController(authService)
	courseController := controllers.NewCourseController(courseService)
	progressController := controllers.NewProgressController(progressService)
	dashboardController := controllers.NewDashboardController(dashboardService)

	// --- CORS MIDDLEWARE ---
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// --- API V1 GROUP ---
	apiV1 := router.Group("/api/v1")

	// --- ROUTES REGISTRATION ---
	// This is the part that was missing.
	// It calls the functions from your other route files.
	AuthRoutes(apiV1, authController)
	CourseRoutes(apiV1, courseController)
	ProgressRoutes(apiV1, progressController)
	DashboardRoutes(apiV1, dashboardController)
}