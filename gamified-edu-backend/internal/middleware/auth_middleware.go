package middleware

import (
    "gamified-edu-backend/pkg"
    "net/http"
    "strings"
    "github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            pkg.SendError(c, http.StatusUnauthorized, "Authorization header is required")
            return
        }

        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            pkg.SendError(c, http.StatusUnauthorized, "Authorization header format must be Bearer {token}")
            return
        }

        userID, err := pkg.ValidateToken(parts[1])
        if err != nil {
            pkg.SendError(c, http.StatusUnauthorized, "Invalid token")
            return
        }

        // Set userID in context for subsequent handlers to use
        c.Set("userID", userID)
        c.Next()
    }
}