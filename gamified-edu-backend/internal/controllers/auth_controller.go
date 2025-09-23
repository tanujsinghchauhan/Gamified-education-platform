package controllers

import (
    "gamified-edu-backend/internal/services"
    "gamified-edu-backend/pkg"
    "net/http"
    "github.com/gin-gonic/gin"
)

type AuthController struct {
    authService services.AuthService
}

func NewAuthController(authService services.AuthService) *AuthController {
    return &AuthController{authService: authService}
}

func (ctrl *AuthController) Register(c *gin.Context) {
    var input services.RegisterInput
    if err := c.ShouldBindJSON(&input); err != nil {
        pkg.SendError(c, http.StatusBadRequest, err.Error())
        return
    }

    _, err := ctrl.authService.RegisterUser(input)
    if err != nil {
        pkg.SendError(c, http.StatusInternalServerError, "Failed to register user")
        return
    }

    pkg.SendResponse(c, http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func (ctrl *AuthController) Login(c *gin.Context) {
    var input services.LoginInput
    if err := c.ShouldBindJSON(&input); err != nil {
        pkg.SendError(c, http.StatusBadRequest, err.Error())
        return
    }

    token, err := ctrl.authService.LoginUser(input)
    if err != nil {
        pkg.SendError(c, http.StatusUnauthorized, err.Error())
        return
    }

    pkg.SendResponse(c, http.StatusOK, gin.H{"token": token})
}