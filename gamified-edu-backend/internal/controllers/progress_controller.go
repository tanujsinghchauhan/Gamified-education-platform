package controllers

import (
    "gamified-edu-backend/internal/services"
    "gamified-edu-backend/pkg"
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "net/http"
)

type ProgressController struct {
    progressService services.ProgressService
}

func NewProgressController(service services.ProgressService) *ProgressController {
    return &ProgressController{progressService: service}
}

// Handles requests like POST /api/v1/progress/chapter/:chapterId/video
func (ctrl *ProgressController) MarkComponentComplete(c *gin.Context) {
    userID, _ := c.Get("userID")
    chapterIDHex := c.Param("chapterId")
    courseIDHex := c.Param("courseId")
    component := c.Param("component") // "video", "quiz", or "ppt"

    chapterID, err := primitive.ObjectIDFromHex(chapterIDHex)
    if err != nil {
        pkg.SendError(c, http.StatusBadRequest, "Invalid chapter ID format")
        return
    }
    courseID, err := primitive.ObjectIDFromHex(courseIDHex)
    if err != nil {
        pkg.SendError(c, http.StatusBadRequest, "Invalid course ID format")
        return
    }

    err = ctrl.progressService.MarkComponentAsComplete(userID.(primitive.ObjectID), chapterID, courseID, component)
    if err != nil {
        pkg.SendError(c, http.StatusInternalServerError, err.Error())
        return
    }

    pkg.SendResponse(c, http.StatusOK, gin.H{"message": "Progress updated successfully"})
}