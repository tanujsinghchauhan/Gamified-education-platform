package routes

import (
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/mongo"
)

func RegisterRoutes(r *gin.Engine, db *mongo.Database) {
    api := r.Group("/api")
    {
        api.GET("/health", func(c *gin.Context) {
            c.JSON(200, gin.H{"message": "Backend with MongoDB is running!"})
        })
    }
}
