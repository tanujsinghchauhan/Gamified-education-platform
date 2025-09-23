// Core data types for the learning platform
export interface User {
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

export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'locked' | 'available' | 'completed' | 'in-progress';
  image: string;
  icon: React.ReactNode | string; // Allow both React nodes and string identifiers
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

export interface Chapter {
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

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video' | 'code';
  url: string;
  description?: string;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'code' | 'text';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  chapterId?: string;
  progress: number;
  completedAt?: string;
  lastAccessedAt: string;
  timeSpent: number; // in minutes
  score?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  unlockedAt?: string;
  category: 'course' | 'skill' | 'streak' | 'community';
}

export interface DashboardStats {
  coursesInProgress: number;
  coursesCompleted: number;
  totalXP: number;
  currentStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  recentAchievements: Achievement[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}