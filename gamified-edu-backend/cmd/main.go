package main

import (
	"gamified-edu-backend/internal/config"
	"gamified-edu-backend/internal/routes"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
    log.Println("Starting server...")
    config.LoadEnv()
    db := config.ConnectDB()

    r := gin.Default()
    log.Println("Setting up routes...")
    routes.RegisterRoutes(r, db)

    port := ":8085"
    if p := os.Getenv("PORT"); p != "" {
        port = ":" + p
    }
    log.Printf("Starting server on port %s...", port)
    r.Run(port)
}
