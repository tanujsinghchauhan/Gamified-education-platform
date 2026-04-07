# Gamified Education Platform

A full-stack web application that makes learning engaging through gamification. Users can explore courses, track progress, earn XP points, and compete on leaderboards.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Project Architecture](#project-architecture)

## ✨ Features

### User Management
- **Authentication**: Secure user registration and login with JWT tokens
- **User Profiles**: Track user information and credentials
- **Progress Tracking**: Monitor learning progress across courses

### Gamification
- **XP System**: Earn experience points by completing activities and courses
- **Leaderboards**: Compete with other users based on XP earned
- **Achievement Tracking**: Track completed courses and milestones
- **Dashboard**: Visual progress overview with statistics

### Learning Content
- **Courses**: Browse and explore available courses
- **Course Details**: View course content, activities, and progress
- **Activities**: Complete activities to earn XP and progress
- **FAQ Section**: Common questions and answers

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 4 + Styled Components
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **ESLint**: Code quality and formatting

### Backend
- **Runtime**: Go 1.25.0
- **Web Framework**: Gin
- **Database**: MongoDB
- **Authentication**: JWT (golang-jwt/jwt)
- **Security**: bcrypt for password hashing
- **CORS**: Gin CORS middleware

### Deployment
- **Frontend**: Vercel
- **Backend**: Render

## 📁 Project Structure

```
gamified-education-platform/
├── gamified-edu-frontend/          # React frontend application
│   ├── src/
│   │   ├── pages/                 # Page components (Login, Register, Courses, Dashboard)
│   │   ├── components/            # Reusable UI components
│   │   ├── api/                   # API client and service calls
│   │   ├── context/               # React Context (XP, Auth)
│   │   ├── App.jsx                # Main app router
│   │   └── index.css              # Global styles with Tailwind
│   ├── package.json               # Frontend dependencies
│   └── vite.config.js             # Vite configuration
│
├── gamified-edu-backend/           # Go backend application
│   ├── cmd/
│   │   ├── main.go                # Application entry point
│   │   └── seed/main.go           # Database seeding utility
│   ├── internal/
│   │   ├── config/                # Database and environment configuration
│   │   ├── controllers/           # Request handlers (auth, course, dashboard, progress)
│   │   ├── middleware/            # Auth and CORS middleware
│   │   ├── models/                # Data models (User, Course, Activity, Progress)
│   │   ├── repositories/          # Database operations
│   │   └── routes/                # API route definitions
│   ├── pkg/                       # Shared utilities
│   ├── go.mod                     # Go module definition
│   └── go.sum                     # Go dependencies
│
├── render.yaml                    # Render deployment configuration
└── README.md                      # Project documentation
```

## 🚀 Quick Start

### Prerequisites

Make sure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Go** (v1.25 or higher) - [Download](https://golang.org/dl/)
- **MongoDB** (local or cloud instance) - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gamified-education-platform.git
   cd gamified-education-platform
   ```

2. **Setup Backend**
   ```bash
   cd gamified-edu-backend
   go mod download
   ```

3. **Setup Frontend**
   ```bash
   cd ../gamified-edu-frontend
   npm install
   ```

### Running Locally

#### Start MongoDB
```bash
# Using MongoDB locally
mongod

# Or use MongoDB Atlas (cloud version) - update connection string in .env
```

#### Start Backend Server
```bash
cd gamified-edu-backend

# Create .env file (see Environment Configuration section)
echo "MONGODB_URI=mongodb://localhost:27017/gamified_edu
PORT=8085
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000" > .env

# Run the server
go run cmd/main.go

# Server starts at http://localhost:8085
```

#### Start Frontend Development Server
```bash
cd gamified-edu-frontend

# Create .env file if needed
echo "VITE_API_URL=http://localhost:8085" > .env

# Run the dev server
npm run dev

# Frontend available at http://localhost:3000
```

## 🔧 Environment Configuration

### Backend (.env)

Create a `.env` file in `gamified-edu-backend/`:

```env
# Database Connection
MONGODB_URI=mongodb://localhost:27017/gamified_edu

# Server Configuration
PORT=8085

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

Create a `.env` file in `gamified-edu-frontend/`:

```env
VITE_API_URL=http://localhost:8085
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Courses Endpoints

#### Get All Courses
```
GET /api/courses
Authorization: Bearer <token>
```

#### Get Course Details
```
GET /api/courses/:courseId
Authorization: Bearer <token>
```

#### Update Progress
```
POST /api/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course_id",
  "activityId": "activity_id",
  "completed": true
}
```

### Dashboard Endpoints

#### Get User Dashboard
```
GET /api/dashboard
Authorization: Bearer <token>
```

## 🔨 Development

### Building

#### Frontend Production Build
```bash
cd gamified-edu-frontend
npm run build

# Output in dist/ directory
```

#### Backend Build
```bash
cd gamified-edu-backend
go build -o main ./cmd/main.go
```

### Linting

```bash
cd gamified-edu-frontend
npm run lint
```

### Seeding Database

```bash
cd gamified-edu-backend
go run cmd/seed/main.go
```

## 📦 Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Environment variable: `VITE_API_URL=https://your-backend-url`

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Configuration:
   - Runtime: Go
   - Build Command: `go build -o main ./cmd/main.go`
   - Start Command: `./main`
   - Environment Variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `FRONTEND_URL`: Your frontend URL
     - `PORT`: 8085

See `render.yaml` for complete deployment configuration.

## 🏗️ Project Architecture

### Frontend Architecture

```
React App
├── Router (React Router v7)
├── Components
│   ├── Header (Navigation)
│   ├── ProtectedRoute (Auth wrapper)
│   └── Pages (Lazy loaded)
└── Context (Global state)
    └── XPContext (XP and user state)
```

### Backend Architecture

```
Gin Server
├── Middleware
│   ├── CORS
│   └── JWT Authentication
├── Routes
│   ├── Auth Routes
│   ├── Course Routes
│   ├── Progress Routes
│   └── Dashboard Routes
├── Controllers (Business logic)
├── Repositories (Data access)
└── Models (Data structures)
```

### Database Schema (MongoDB)

**Users Collection**
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  xp: Number,
  createdAt: Date
}
```

**Courses Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  activities: [ObjectId],
  createdAt: Date
}
```

**Progress Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: ObjectId,
  completedActivities: [ObjectId],
  xpGained: Number,
  lastUpdated: Date
}
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Using bcrypt for password security
- **CORS Protection**: Configured for both local and production environments
- **Protected Routes**: Frontend route protection for authenticated users
- **Input Validation**: Server-side validation of all inputs

## 📝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🤝 Support

For issues and questions, please create an issue on GitHub or contact the development team.

## 🔗 Links

- **Frontend**: [https://gamified-education-platform.vercel.app](https://gamified-education-platform.vercel.app)
- **API Documentation**: Available at `/api/docs` (if implemented)
- **GitHub**: [Repository Link](https://github.com/yourusername/gamified-education-platform)
