package services

import (
    "errors"
    "gamified-edu-backend/internal/models"
    "gamified-edu-backend/internal/repositories"
    "gamified-edu-backend/pkg"
    "go.mongodb.org/mongo-driver/mongo"
    "golang.org/x/crypto/bcrypt"
)

type AuthService interface {
    RegisterUser(input RegisterInput) (*models.User, error)
    LoginUser(input LoginInput) (string, error)
}

type authService struct {
    userRepo repositories.UserRepository
}

func NewAuthService(userRepo repositories.UserRepository) AuthService {
    return &authService{userRepo: userRepo}
}

type RegisterInput struct {
    FirstName string `json:"first_name" binding:"required"`
    LastName  string `json:"last_name" binding:"required"`
    Email     string `json:"email" binding:"required"`
    Password  string `json:"password" binding:"required"`
}

type LoginInput struct {
    Email    string `json:"email" binding:"required"`
    Password string `json:"password" binding:"required"`
}

func (s *authService) RegisterUser(input RegisterInput) (*models.User, error) {
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
    if err != nil { return nil, err }
    user := models.User{
        FirstName: input.FirstName, LastName: input.LastName,
        Email: input.Email, PasswordHash: string(hashedPassword),
    }
    err = s.userRepo.Create(&user)
    return &user, err
}

func (s *authService) LoginUser(input LoginInput) (string, error) {
    user, err := s.userRepo.FindByEmail(input.Email)
    if err != nil {
        if err == mongo.ErrNoDocuments { return "", errors.New("invalid credentials") }
        return "", err
    }
    err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password))
    if err != nil { return "", errors.New("invalid credentials") }
    return pkg.GenerateToken(user.ID)
}