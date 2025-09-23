// Environment variable helper that works in browser
const getEnvVar = (name: string, defaultValue: string = '') => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name] || defaultValue;
  }
  return defaultValue;
};

// Environment configuration for the learning platform
export const config = {
  // API Configuration
  api: {
    baseURL: getEnvVar('REACT_APP_API_URL', 'http://localhost:8080/api'),
    timeout: 10000,
    // Set to true to use mock data, false to use real backend
    useMockData: getEnvVar('REACT_APP_USE_MOCK_DATA', 'true') !== 'false', // Default to mock data
  },

  // Authentication
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },

  // Feature flags
  features: {
    enableProgressTracking: true,
    enableAchievements: true,
    enableNotifications: getEnvVar('REACT_APP_ENABLE_NOTIFICATIONS') === 'true',
    enableAnalytics: getEnvVar('REACT_APP_ENABLE_ANALYTICS') === 'true',
  },

  // Backend Integration Settings
  backend: {
    // Go/Gin framework endpoints
    endpoints: {
      auth: {
        login: '/auth/login',
        signup: '/auth/signup',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        profile: '/auth/profile',
      },
      courses: {
        list: '/courses',
        detail: '/courses/:id',
        chapters: '/courses/:id/chapters',
        enroll: '/courses/:id/enroll',
        unenroll: '/courses/:id/unenroll',
      },
      chapters: {
        detail: '/courses/:courseId/chapters/:chapterId',
        complete: '/courses/:courseId/chapters/:chapterId/complete',
      },
      progress: {
        get: '/progress',
        update: '/progress',
        course: '/progress/course/:courseId',
      },
      quiz: {
        submit: '/quiz/submit',
        results: '/quiz/:id/results',
      },
      dashboard: {
        stats: '/dashboard/stats',
        achievements: '/dashboard/achievements',
      },
      user: {
        profile: '/user/profile',
        preferences: '/user/preferences',
        achievements: '/user/achievements',
      }
    },

    // Request/Response format expectations
    requestFormat: {
      contentType: 'application/json',
      authHeader: 'Authorization',
      authPrefix: 'Bearer ',
    },

    responseFormat: {
      successField: 'success',
      dataField: 'data',
      messageField: 'message',
      errorField: 'error',
    }
  },

  // Development settings
  development: {
    enableDebugLogs: getEnvVar('NODE_ENV') === 'development',
    mockApiDelay: 500, // milliseconds
    showNetworkRequests: getEnvVar('REACT_APP_DEBUG_NETWORK') === 'true',
  }
};

// Helper functions for environment-specific logic
export const isDevelopment = () => getEnvVar('NODE_ENV') === 'development';
export const isProduction = () => getEnvVar('NODE_ENV') === 'production';

// Backend integration helpers
export const getApiUrl = (endpoint: string, params?: Record<string, string>) => {
  let url = `${config.api.baseURL}${endpoint}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    });
  }
  
  return url;
};

// Environment variable validation
export const validateEnvironment = () => {
  const requiredVars = [];
  const missingVars = [];

  // Only require API URL in production
  if (isProduction() && !config.api.useMockData) {
    requiredVars.push('REACT_APP_API_URL');
  }

  requiredVars.forEach(varName => {
    if (!getEnvVar(varName)) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    
    if (isProduction()) {
      throw new Error(`Required environment variables are missing: ${missingVars.join(', ')}`);
    }
  }

  return {
    isValid: missingVars.length === 0,
    missingVars
  };
};

// Initialize environment validation
if (typeof window !== 'undefined') {
  validateEnvironment();
}

export default config;