package main

import (
    "gamified-edu-backend/internal/config"
    "gamified-edu-backend/internal/routes"

    "github.com/gin-gonic/gin"
)

func main() {
    config.LoadEnv()
    db := config.ConnectDB()

    r := gin.Default()
    routes.RegisterRoutes(r, db)

    r.Run(":8085")
}
