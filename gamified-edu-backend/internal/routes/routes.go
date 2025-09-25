package routes

import (
	"gamified-edu-backend/internal/controllers"
	"gamified-edu-backend/internal/repositories"
	"gamified-edu-backend/internal/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"time" // <-- IMPORT THE 'time' PACKAGE
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
	dashboardService := services.NewDashboardService(dashboardRepo, progressRepo, userRepo)

	// --- CONTROLLERS ---
	authController := controllers.NewAuthController(authService)
	courseController := controllers.NewCourseController(courseService)
	progressController := controllers.NewProgressController(progressService)
	dashboardController := controllers.NewDashboardController(dashboardService)

	// --- CORS MIDDLEWARE ---
	// REPLACE THE PREVIOUS CONFIGURATION WITH THIS MORE EXPLICIT ONE
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Allows all origins
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// --- API V1 GROUP ---
	apiV1 := router.Group("/api/v1")

	// --- ROUTES REGISTRATION ---
	AuthRoutes(apiV1, authController)
	CourseRoutes(apiV1, courseController)
	ProgressRoutes(apiV1, progressController)
	DashboardRoutes(apiV1, dashboardController)
}