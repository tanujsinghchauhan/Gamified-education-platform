package config

import (
    "context"
    "fmt"
    "log"
    "os"
    "time"

    "github.com/joho/godotenv"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func LoadEnv() {
    if err := godotenv.Load(); err != nil {
        log.Fatal("Error loading .env file")
    }
}

func ConnectDB() *mongo.Database {
    mongoURI := os.Getenv("MONGO_URI")
    dbName := os.Getenv("DB_NAME")

    client, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))
    if err != nil {
        log.Fatal(err)
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    err = client.Connect(ctx)
    if err != nil {
        log.Fatal(err)
    }

    // Ping the database
    err = client.Ping(ctx, nil)
    if err != nil {
        log.Fatal("Could not connect to MongoDB:", err)
    }

    fmt.Println("Connected to MongoDB")
    DB = client.Database(dbName)
    return DB
}
