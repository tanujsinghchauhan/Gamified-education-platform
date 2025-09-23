// React Context for managing application data state
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Course, Chapter, DashboardStats, Achievement } from '../types';
import { api } from '../services/api';

// State interface
interface DataState {
  user: User | null;
  courses: Course[];
  currentCourse: Course | null;
  currentChapters: Chapter[];
  dashboardStats: DashboardStats | null;
  achievements: Achievement[];
  loading: {
    auth: boolean;
    courses: boolean;
    chapters: boolean;
    dashboard: boolean;
  };
  error: string | null;
}

// Action types
type DataAction = 
  | { type: 'SET_LOADING'; payload: { key: keyof DataState['loading']; loading: boolean } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'SET_CURRENT_COURSE'; payload: Course | null }
  | { type: 'SET_CHAPTERS'; payload: Chapter[] }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UPDATE_COURSE_PROGRESS'; payload: { courseId: string; progress: number } }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: DataState = {
  user: null,
  courses: [],
  currentCourse: null,
  currentChapters: [],
  dashboardStats: null,
  achievements: [],
  loading: {
    auth: false,
    courses: false,
    chapters: false,
    dashboard: false
  },
  error: null
};

// Reducer
function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.loading
        }
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };

    case 'SET_COURSES':
      return {
        ...state,
        courses: action.payload
      };

    case 'SET_CURRENT_COURSE':
      return {
        ...state,
        currentCourse: action.payload
      };

    case 'SET_CHAPTERS':
      return {
        ...state,
        currentChapters: action.payload
      };

    case 'SET_DASHBOARD_STATS':
      return {
        ...state,
        dashboardStats: action.payload
      };

    case 'SET_ACHIEVEMENTS':
      return {
        ...state,
        achievements: action.payload
      };

    case 'UPDATE_COURSE_PROGRESS':
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.payload.courseId
            ? { ...course, progress: action.payload.progress }
            : course
        )
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Context interface
interface DataContextType {
  state: DataState;
  actions: {
    // Auth actions
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, confirmPassword: string) => Promise<void>;
    logout: () => Promise<void>;
    loadCurrentUser: () => Promise<void>;

    // Course actions
    loadCourses: () => Promise<void>;
    loadCourse: (courseId: string) => Promise<void>;
    loadChapters: (courseId: string) => Promise<void>;
    loadChapter: (courseId: string, chapterId: string) => Promise<Chapter>;

    // Progress actions
    updateProgress: (courseId: string, chapterId: string, progress: number) => Promise<void>;

    // Dashboard actions
    loadDashboardStats: () => Promise<void>;
    loadAchievements: () => Promise<void>;

    // Utility actions
    clearError: () => void;
  };
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Helper function for error handling
  const handleError = (error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    dispatch({ type: 'SET_ERROR', payload: error.message || `An error occurred in ${context}` });
  };

  // Auth actions
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'auth', loading: true } });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const authResponse = await api.auth.login({ email, password });
      dispatch({ type: 'SET_USER', payload: authResponse.user });
    } catch (error) {
      handleError(error, 'login');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'auth', loading: false } });
    }
  };

  const signup = async (email: string, password: string, name: string, confirmPassword: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'auth', loading: true } });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      const authResponse = await api.auth.signup({ email, password, name, confirmPassword });
      dispatch({ type: 'SET_USER', payload: authResponse.user });
    } catch (error) {
      handleError(error, 'signup');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'auth', loading: false } });
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      dispatch({ type: 'RESET_STATE' });
    } catch (error) {
      handleError(error, 'logout');
    }
  };

  const loadCurrentUser = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'auth', loading: true } });
      const user = await api.auth.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      handleError(error, 'loadCurrentUser');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'auth', loading: false } });
    }
  };

  // Course actions
  const loadCourses = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'courses', loading: true } });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const courses = await api.courses.getCourses();
      dispatch({ type: 'SET_COURSES', payload: courses });
    } catch (error) {
      handleError(error, 'loadCourses');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'courses', loading: false } });
    }
  };

  const loadCourse = async (courseId: string) => {
    try {
      const course = await api.courses.getCourse(courseId);
      dispatch({ type: 'SET_CURRENT_COURSE', payload: course });
    } catch (error) {
      handleError(error, 'loadCourse');
    }
  };

  const loadChapters = async (courseId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'chapters', loading: true } });
      
      const chapters = await api.courses.getCourseChapters(courseId);
      dispatch({ type: 'SET_CHAPTERS', payload: chapters });
    } catch (error) {
      handleError(error, 'loadChapters');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'chapters', loading: false } });
    }
  };

  const loadChapter = async (courseId: string, chapterId: string): Promise<Chapter> => {
    try {
      const chapter = await api.courses.getChapter(courseId, chapterId);
      return chapter;
    } catch (error) {
      handleError(error, 'loadChapter');
      throw error;
    }
  };

  // Progress actions
  const updateProgress = async (courseId: string, chapterId: string, progress: number) => {
    try {
      await api.progress.updateProgress(courseId, chapterId, progress);
      dispatch({ type: 'UPDATE_COURSE_PROGRESS', payload: { courseId, progress } });
    } catch (error) {
      handleError(error, 'updateProgress');
    }
  };

  // Dashboard actions
  const loadDashboardStats = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'dashboard', loading: true } });
      
      const stats = await api.dashboard.getDashboardStats();
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats });
    } catch (error) {
      handleError(error, 'loadDashboardStats');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'dashboard', loading: false } });
    }
  };

  const loadAchievements = async () => {
    try {
      const achievements = await api.dashboard.getAchievements();
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
    } catch (error) {
      handleError(error, 'loadAchievements');
    }
  };

  // Utility actions
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // Auto-load user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      loadCurrentUser();
    }
  }, []);

  const contextValue: DataContextType = {
    state,
    actions: {
      login,
      signup,
      logout,
      loadCurrentUser,
      loadCourses,
      loadCourse,
      loadChapters,
      loadChapter,
      updateProgress,
      loadDashboardStats,
      loadAchievements,
      clearError
    }
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

// Custom hook for using the context
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}