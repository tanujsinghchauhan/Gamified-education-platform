package controllers

import (
	"gamified-edu-backend/internal/services"
	"gamified-edu-backend/pkg"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
)

type DashboardController struct {
	dashboardService services.DashboardService
}

func NewDashboardController(service services.DashboardService) *DashboardController {
	return &DashboardController{dashboardService: service}
}

func (ctrl *DashboardController) GetDashboard(c *gin.Context) {
	userID, _ := c.Get("userID")

	dashboardData, err := ctrl.dashboardService.GetDashboardData(userID.(primitive.ObjectID))
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, "Could not generate dashboard data")
		return
	}

	pkg.SendResponse(c, http.StatusOK, dashboardData)
}