package main

import (
	"context"
	"gamified-edu-backend/internal/config"
	"gamified-edu-backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"log"
)

func main() {
	log.Println("Starting database seeder...")
	config.LoadEnv()
	db := config.ConnectDB()

	// Check if courses already exist
	courseCollection := db.Collection("courses")
	count, err := courseCollection.CountDocuments(context.Background(), bson.M{})
	if err != nil {
		log.Fatal("Error checking course count:", err)
	}

	if count > 0 {
		log.Printf("Database already has %d courses. Skipping seeding.", count)
		return
	}

	log.Println("Seeding database with initial courses...")

	// Create the Forest Ecosystems course with proper chapters
	forestCourse := models.Course{
		ID:          primitive.NewObjectID(),
		Title:       "Forest Ecosystems",
		Description: "An introduction to woodland biodiversity and conservation.",
		Chapters: []models.Chapter{
			{
				ID:            primitive.NewObjectID(),
				Title:         "Introduction to Forest Ecosystems",
				ChapterNumber: 1,
				VideoURL:      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
				QuizID:        "quiz_1",
				PPTLink:       "https://example.com/forest_intro.pdf",
				DurationMins:  30,
			},
			{
				ID:            primitive.NewObjectID(),
				Title:         "Biodiversity and Conservation",
				ChapterNumber: 2,
				VideoURL:      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
				QuizID:        "quiz_2",
				PPTLink:       "https://example.com/biodiversity.pdf",
				DurationMins:  25,
			},
			{
				ID:            primitive.NewObjectID(),
				Title:         "Ecosystem Services and Management",
				ChapterNumber: 3,
				VideoURL:      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
				QuizID:        "quiz_3",
				PPTLink:       "https://example.com/ecosystem_services.pdf",
				DurationMins:  35,
			},
		},
	}

	// Create Ocean Ecosystems course
	oceanCourse := models.Course{
		ID:          primitive.NewObjectID(),
		Title:       "Ocean Ecosystems",
		Description: "Explore marine biodiversity and ocean conservation efforts.",
		Chapters: []models.Chapter{
			{
				ID:            primitive.NewObjectID(),
				Title:         "Marine Biodiversity Basics",
				ChapterNumber: 1,
				VideoURL:      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
				QuizID:        "quiz_ocean_1",
				PPTLink:       "https://example.com/marine_basics.pdf",
				DurationMins:  28,
			},
			{
				ID:            primitive.NewObjectID(),
				Title:         "Coral Reef Conservation",
				ChapterNumber: 2,
				VideoURL:      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
				QuizID:        "quiz_ocean_2",
				PPTLink:       "https://example.com/coral_reefs.pdf",
				DurationMins:  32,
			},
		},
	}

	// Insert courses
	courses := []interface{}{forestCourse, oceanCourse}
	result, err := courseCollection.InsertMany(context.Background(), courses)
	if err != nil {
		log.Fatal("Error inserting courses:", err)
	}

	log.Printf("Successfully seeded database with %d courses:", len(result.InsertedIDs))
	log.Printf("- %s (3 chapters)", forestCourse.Title)
	log.Printf("- %s (2 chapters)", oceanCourse.Title)
	log.Println("Database seeding completed!")
}