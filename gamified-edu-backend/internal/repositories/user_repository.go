package repositories

import (
    "context"
    "gamified-edu-backend/internal/models"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
)

type UserRepository interface {
    Create(user *models.User) error
    FindByEmail(email string) (*models.User, error)
    FindByID(id primitive.ObjectID) (*models.User, error)
    UpdateXPAndLevel(user *models.User) error
}

type userRepository struct {
    collection *mongo.Collection
}

func NewUserRepository(db *mongo.Database) UserRepository {
    return &userRepository{collection: db.Collection("users")}
}

func (r *userRepository) Create(user *models.User) error {
    _, err := r.collection.InsertOne(context.Background(), user)
    return err
}

func (r *userRepository) FindByEmail(email string) (*models.User, error) {
    var user models.User
    err := r.collection.FindOne(context.Background(), bson.M{"email": email}).Decode(&user)
    return &user, err
}

func (r *userRepository) FindByID(id primitive.ObjectID) (*models.User, error) {
    var user models.User
    err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&user)
    return &user, err
}

// Updates both XP and Level in a single database call
func (r *userRepository) UpdateXPAndLevel(user *models.User) error {
    filter := bson.M{"_id": user.ID}
    update := bson.M{"$set": bson.M{"xp": user.XP, "level": user.Level}}
    _, err := r.collection.UpdateOne(context.Background(), filter, update)
    return err
}