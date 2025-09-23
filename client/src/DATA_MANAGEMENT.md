# Data Management System

This document explains the new data management layer for the sci-fi learning platform, which supports both mock data and real backend integration with your Go/Gin framework.

## Overview

The data management system consists of:

1. **Type Definitions** (`/types/index.ts`) - TypeScript interfaces for all data structures
2. **Mock Data** (`/services/mockData.ts`) - Development and testing data
3. **API Service Layer** (`/services/api.ts`) - Handles both mock and real API calls
4. **React Context** (`/contexts/DataContext.tsx`) - Global state management
5. **Environment Configuration** (`/config/environment.ts`) - Environment settings

## Quick Start

### Using Mock Data (Default)
The platform currently uses mock data by default. No additional setup required.

### Connecting to Your Go/Gin Backend

1. **Set Environment Variables:**
   ```bash
   # In your .env file
   REACT_APP_API_URL=http://localhost:8080/api
   REACT_APP_USE_MOCK_DATA=false
   ```

2. **Update API Configuration:**
   ```javascript
   import { api } from './services/api';
   
   // Switch to real backend
   api.config.setUseMockData(false);
   api.config.setBaseURL('http://your-backend-url/api');
   ```

## Data Structures

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  totalXP: number;
  level: number;
  joinedAt: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}
```

### Course
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'locked' | 'available' | 'completed' | 'in-progress';
  image: string;
  missions: number;
  totalXP: number;
  estimatedHours: number;
  prerequisites: string[];
  skills: string[];
  instructor: {
    name: string;
    avatar?: string;
    bio: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Chapter
```typescript
interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed' | 'current' | 'in-progress';
  type: 'video' | 'reading' | 'quiz' | 'exercise' | 'project';
  duration: string;
  xp: number;
  order: number;
  content?: string;
  videoUrl?: string;
  resources: Resource[];
  quiz?: Quiz;
}
```

## API Endpoints Expected by Go/Gin Backend

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get current user profile

### Courses
- `GET /courses` - List all courses
- `GET /courses/:id` - Get specific course
- `GET /courses/:id/chapters` - Get course chapters
- `POST /courses/:id/enroll` - Enroll in course

### Progress
- `GET /progress` - Get user progress
- `POST /progress` - Update progress
- `GET /progress/course/:courseId` - Get course-specific progress

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/achievements` - Get user achievements

### Quiz
- `POST /quiz/submit` - Submit quiz answers

## Using the Data Context

### In Components
```typescript
import { useData } from '../contexts/DataContext';

function MyComponent() {
  const { state, actions } = useData();
  const { courses, loading, error } = state;

  useEffect(() => {
    actions.loadCourses();
  }, []);

  if (loading.courses) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

### Available Actions
```typescript
// Authentication
await actions.login(email, password);
await actions.signup(email, password, name, confirmPassword);
await actions.logout();

// Courses
await actions.loadCourses();
await actions.loadCourse(courseId);
await actions.loadChapters(courseId);

// Progress
await actions.updateProgress(courseId, chapterId, progress);

// Dashboard
await actions.loadDashboardStats();
await actions.loadAchievements();
```

## Backend Integration Steps

### 1. Go/Gin Backend Structure
Your Go backend should implement handlers for the endpoints listed above. Example structure:

```go
// main.go
func main() {
    r := gin.Default()
    
    // CORS middleware for frontend
    r.Use(cors.Default())
    
    api := r.Group("/api")
    {
        auth := api.Group("/auth")
        {
            auth.POST("/login", handlers.Login)
            auth.POST("/signup", handlers.Signup)
            auth.POST("/logout", handlers.Logout)
            auth.GET("/profile", middleware.Auth(), handlers.GetProfile)
        }
        
        courses := api.Group("/courses")
        {
            courses.GET("", handlers.GetCourses)
            courses.GET("/:id", handlers.GetCourse)
            courses.GET("/:id/chapters", handlers.GetChapters)
        }
        
        // Add more routes...
    }
    
    r.Run(":8080")
}
```

### 2. Response Format
Your Go backend should return responses in this format:

```go
type APIResponse struct {
    Success bool        `json:"success"`
    Data    interface{} `json:"data"`
    Message string      `json:"message"`
    Error   string      `json:"error,omitempty"`
}

// Success response
c.JSON(200, APIResponse{
    Success: true,
    Data:    courses,
    Message: "Courses retrieved successfully",
})

// Error response
c.JSON(400, APIResponse{
    Success: false,
    Error:   "Invalid request",
    Message: "Failed to retrieve courses",
})
```

### 3. Authentication
The frontend sends JWT tokens in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### 4. CORS Configuration
Ensure your Go backend allows requests from your frontend:

```go
import "github.com/gin-contrib/cors"

config := cors.DefaultConfig()
config.AllowOrigins = []string{"http://localhost:3000"} // Your frontend URL
config.AllowCredentials = true
r.Use(cors.New(config))
```

## Environment Configuration

Create a `.env` file in your project root:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_USE_MOCK_DATA=false

# Optional Features
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_DEBUG_NETWORK=true
```

## Development vs Production

### Development
- Mock data is enabled by default
- Debug logs are shown
- Network requests are logged
- API delays are simulated

### Production
- Environment variables are validated
- Mock data is disabled
- Real backend is required
- Error handling is robust

## Error Handling

The system includes comprehensive error handling:

- Network failures
- Invalid responses
- Authentication errors
- Validation errors
- Backend unavailability

Errors are automatically displayed in the UI and logged to the console.

## Future Enhancements

This system is designed to easily support:

- Real-time updates via WebSockets
- Offline functionality
- Data caching
- Background sync
- Push notifications
- Advanced analytics

## Switching Between Mock and Real Data

You can easily switch between mock and real data:

```typescript
import { api } from './services/api';

// Use mock data
api.config.setUseMockData(true);

// Use real backend
api.config.setUseMockData(false);
api.config.setBaseURL('http://your-backend-url/api');
```

This allows for seamless development and testing without requiring a backend to be running.