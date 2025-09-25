package controllers

import (
	"gamified-edu-backend/internal/services"
	"gamified-edu-backend/pkg"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"log"
	"net/http"
)

type DashboardController struct {
	dashboardService services.DashboardService
}

func NewDashboardController(service services.DashboardService) *DashboardController {
	return &DashboardController{dashboardService: service}
}

func (ctrl *DashboardController) GetDashboard(c *gin.Context) {
	log.Println("Dashboard endpoint called")
	
	userID, exists := c.Get("userID")
	if !exists {
		log.Println("User not authenticated in dashboard")
		pkg.SendError(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	log.Printf("Getting dashboard data for user: %v", userID)
	dashboardData, err := ctrl.dashboardService.GetDashboardData(userID.(primitive.ObjectID))
	if err != nil {
		log.Printf("Error getting dashboard data: %v", err)
		pkg.SendError(c, http.StatusInternalServerError, "Could not generate dashboard data")
		return
	}

	log.Printf("Dashboard data retrieved: %+v", dashboardData)
	pkg.SendResponse(c, http.StatusOK, dashboardData)
}