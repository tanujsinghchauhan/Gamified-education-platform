package pkg

import (
    "errors"
    "os"
    "time"
    "github.com/golang-jwt/jwt/v5"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

var jwtSecretKey = []byte(os.Getenv("JWT_SECRET_KEY"))

func GenerateToken(userID primitive.ObjectID) (string, error) {
    claims := jwt.MapClaims{
        "user_id": userID.Hex(), // Convert ObjectID to string
        "exp":     time.Now().Add(time.Hour * 72).Unix(),
        "iat":     time.Now().Unix(),
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtSecretKey)
}

func ValidateToken(tokenString string) (primitive.ObjectID, error) {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return jwtSecretKey, nil
    })
    if err != nil {
        return primitive.NilObjectID, err
    }
    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        userIDHex := claims["user_id"].(string)
        userID, err := primitive.ObjectIDFromHex(userIDHex)
        if err != nil {
            return primitive.NilObjectID, errors.New("invalid user ID in token")
        }
        return userID, nil
    }
    return primitive.NilObjectID, errors.New("invalid token")
}