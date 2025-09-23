package pkg

import "github.com/gin-gonic/gin"

func SendResponse(c *gin.Context, statusCode int, data interface{}) {
    c.JSON(statusCode, gin.H{"status": "success", "data": data})
}

func SendError(c *gin.Context, statusCode int, message string) {
    c.AbortWithStatusJSON(statusCode, gin.H{"status": "error", "message": message})
}