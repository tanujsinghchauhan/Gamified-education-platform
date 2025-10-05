import axios from "axios";

// Use VITE_API_URL when provided by the build environment (Vercel). Fall back to
// the deployed backend on Render for production/testing when the env var is not set.
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://gamified-education-platform-1.onrender.com";

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- The rest of the file remains the same ---

// Authentication endpoints
export const registerUser = (userData) =>
  apiClient.post("/auth/register", userData);
export const loginUser = (credentials) =>
  apiClient.post("/auth/login", credentials);

// Course endpoints
export const getCourses = () => apiClient.get("/courses");
export const getCourseDetails = (courseId) =>
  apiClient.get(`/courses/${courseId}`);

// Dashboard endpoints
export const getDashboardData = () => apiClient.get("/dashboard");
export const refreshDashboardData = () => apiClient.get("/dashboard"); // Alias for consistency

// User endpoints
export const getUserProfile = () => apiClient.get("/auth/profile");

// Progress endpoints
export const updateProgress = (progressData) =>
  apiClient.post("/progress", progressData);
export const getChapterProgress = (chapterId) =>
  apiClient.get(`/progress/${chapterId}`);
export const getCourseProgress = (courseId) =>
  apiClient.get(`/progress/course/${courseId}`);
export const markComponentComplete = (courseId, chapterId, component) =>
  apiClient.post(
    `/progress/course/${courseId}/chapter/${chapterId}/${component}`
  );

export default apiClient;
