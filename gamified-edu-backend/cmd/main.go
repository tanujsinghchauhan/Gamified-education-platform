package main

import (
    "gamified-edu-backend/internal/config"
    "gamified-edu-backend/internal/routes"
    "log"

    "github.com/gin-gonic/gin"
)

func main() {
    log.Println("Starting server...")
    config.LoadEnv()
    db := config.ConnectDB()

    r := gin.Default()
    log.Println("Setting up routes...")
    routes.RegisterRoutes(r, db)

    log.Println("Starting server on port 8085...")
    r.Run(":8085")
}
