// API service layer that can switch between mock data and real backend calls
import { 
  User, 
  Course, 
  Chapter, 
  DashboardStats, 
  Achievement, 
  LoginCredentials, 
  SignupData, 
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  UserProgress
} from '../types';

import { 
  mockUser, 
  mockCourses, 
  mockChapters, 
  mockDashboardStats, 
  mockAchievements 
} from './mockData';

// Environment variable helper that works in browser
const getEnvVar = (name: string, defaultValue: string = '') => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name] || defaultValue;
  }
  return defaultValue;
};

// Configuration
const API_CONFIG = {
  baseURL: getEnvVar('REACT_APP_API_URL', 'http://localhost:8080/api'),
  useMockData: getEnvVar('REACT_APP_USE_MOCK_DATA', 'true') !== 'false', // Default to mock data
  timeout: 10000
};

// Utility function to simulate API delay
const simulateDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Auth token management
let authToken: string | null = localStorage.getItem('auth_token');

const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

// Request headers with auth
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authToken && { Authorization: `Bearer ${authToken}` })
});

// Generic API request function for real backend calls
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers
      },
      signal: AbortSignal.timeout(API_CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Authentication Services
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (API_CONFIG.useMockData) {
      await simulateDelay();
      
      // Mock authentication logic
      if (credentials.email && credentials.password) {
        const authResponse: AuthResponse = {
          user: mockUser,
          token: 'mock_jwt_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now()
        };
        setAuthToken(authResponse.token);
        return authResponse;
      } else {
        throw new Error('Invalid credentials');
      }
    }

    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    setAuthToken(response.data.token);
    return response.data;
  },

  async signup(userData: SignupData): Promise<AuthResponse> {
    if (API_CONFIG.useMockData) {
      await simulateDelay();
      
      const newUser: User = {
        ...mockUser,
        id: 'user_' + Date.now(),
        email: userData.email,
        name: userData.name,
        totalXP: 0,
        level: 1,
        joinedAt: new Date().toISOString()
      };

      const authResponse: AuthResponse = {
        user: newUser,
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now()
      };
      
      setAuthToken(authResponse.token);
      return authResponse;
    }

    const response = await apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    setAuthToken(response.data.token);
    return response.data;
  },

  async logout(): Promise<void> {
    if (API_CONFIG.useMockData) {
      await simulateDelay(200);
      setAuthToken(null);
      return;
    }

    await apiRequest('/auth/logout', {
      method: 'POST'
    });
    
    setAuthToken(null);
  },

  async getCurrentUser(): Promise<User> {
    if (API_CONFIG.useMockData) {
      await simulateDelay(300);
      return mockUser;
    }

    const response = await apiRequest<User>('/auth/me');
    return response.data;
  }
};

// Course Services
export const courseService = {
  async getCourses(): Promise<Course[]> {
    if (API_CONFIG.useMockData) {
      await simulateDelay();
      return mockCourses;
    }

    const response = await apiRequest<Course[]>('/courses');
    return response.data;
  },

  async getCourse(courseId: string): Promise<Course> {
    if (API_CONFIG.useMockData) {
      await simulateDelay();
      const course = mockCourses.find(c => c.id === courseId);
      if (!course) throw new Error('Course not found');
      return course;
    }

    const response = await apiRequest<Course>(`/courses/${courseId}`);
    return response.data;
  },

  async getCourseChapters(courseId: string): Promise<Chapter[]> {
    if (API_CONFIG.useMockData) {
      await simulateDelay();
      return mockChapters[courseId] || [];
    }

    const response = await apiRequest<Chapter[]>(`/courses/${courseId}/chapters`);
    return response.data;
  },

  async getChapter(courseId: string, chapterId: string): Promise<Chapter> {
    if (API_CONFIG.useMockData) {
      await simulateDelay();
      const chapters = mockChapters[courseId] || [];
      const chapter = chapters.find(c => c.id === chapterId);
      if (!chapter) throw new Error('Chapter not found');
      return chapter;
    }

    const response = await apiRequest<Chapter>(`/courses/${courseId}/chapters/${chapterId}`);
    return response.data;
  },

  async enrollInCourse(courseId: string): Promise<void> {
    if (API_CONFIG.useMockData) {
      await simulateDelay();
      // In mock mode, just simulate enrollment
      return;
    }

    await apiRequest(`/courses/${courseId}/enroll`, {
      method: 'POST'
    });
  }
};

// Progress Services
export const progressService = {
  async updateProgress(courseId: string, chapterId: string, progress: number): Promise<UserProgress> {
    if (API_CONFIG.useMockData) {
      await simulateDelay();
      
      const userProgress: UserProgress = {
        userId: mockUser.id,
        courseId,
        chapterId,
        progress,
        lastAccessedAt: new Date().toISOString(),
        timeSpent: Math.floor(Math.random() * 60) + 10 // Random time 10-70 minutes
      };
      
      return userProgress;
    }

    const response = await apiRequest<UserProgress>('/progress', {
      method: 'POST',
      body: JSON.stringify({ courseId, chapterId, progress })
    });

    return response.data;
  },

  async getUserProgress(courseId?: string): Promise<UserProgress[]> {
    if (API_CONFIG.useMockData) {
      await simulateDelay();
      
      // Generate mock progress data
      const progressData: UserProgress[] = [
        {
          userId: mockUser.id,
          courseId: 'quantum-computing',
          progress: 75,
          lastAccessedAt: '2024-09-20T10:30:00Z',
          timeSpent: 180
        },
        {
          userId: mockUser.id,
          courseId: 'neural-networks',
          progress: 45,
          lastAccessedAt: '2024-09-19T14:15:00Z',
          timeSpent: 120
        }
      ];
      
      return courseId ? progressData.filter(p => p.courseId === courseId) : progressData;
    }

    const endpoint = courseId ? `/progress?courseId=${courseId}` : '/progress';
    const response = await apiRequest<UserProgress[]>(endpoint);
    return response.data;
  }
};

// Dashboard Services
export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    if (API_CONFIG.useMockData) {
      await simulateDelay();
      return mockDashboardStats;
    }

    const response = await apiRequest<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  async getAchievements(): Promise<Achievement[]> {
    if (API_CONFIG.useMockData) {
      await simulateDelay();
      return mockAchievements;
    }

    const response = await apiRequest<Achievement[]>('/achievements');
    return response.data;
  }
};

// Quiz Services
export const quizService = {
  async submitQuizAnswers(
    courseId: string, 
    chapterId: string, 
    answers: Record<string, string>
  ): Promise<{ score: number; passed: boolean; feedback: any[] }> {
    if (API_CONFIG.useMockData) {
      await simulateDelay(1000);
      
      // Mock quiz scoring
      const score = Math.floor(Math.random() * 40) + 60; // Random score 60-100
      return {
        score,
        passed: score >= 70,
        feedback: [
          { questionId: 'q1', correct: true, explanation: 'Great work!' }
        ]
      };
    }

    const response = await apiRequest<any>('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({ courseId, chapterId, answers })
    });

    return response.data;
  }
};

// Export configuration for easy switching
export const apiConfig = {
  ...API_CONFIG,
  setUseMockData: (useMock: boolean) => {
    API_CONFIG.useMockData = useMock;
  },
  setBaseURL: (url: string) => {
    API_CONFIG.baseURL = url;
  }
};

// Main API object
export const api = {
  auth: authService,
  courses: courseService,
  progress: progressService,
  dashboard: dashboardService,
  quiz: quizService,
  config: apiConfig
};