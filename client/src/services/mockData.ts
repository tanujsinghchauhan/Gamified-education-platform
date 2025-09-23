// Mock data that matches your current implementation
import { Course, Chapter, User, DashboardStats, Achievement } from '../types';

export const mockUser: User = {
  id: 'user-1',
  email: 'learner@quantumtech.edu',
  name: 'Alex Chen',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  totalXP: 2847,
  level: 7,
  joinedAt: '2024-01-15',
  preferences: {
    theme: 'dark',
    notifications: true
  }
};

export const mockCourses: Course[] = [
  {
    id: 'quantum-computing',
    title: 'Quantum Computing Fundamentals',
    description: 'Master the principles of quantum processing and computational theory',
    progress: 75,
    level: 'advanced',
    status: 'in-progress',
    image: 'https://images.unsplash.com/photo-1585051256362-eb56bf4d5ea3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neSUyMGNpcmN1aXR8ZW58MXx8fHwxNzU4NTM0MzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: 'Zap' as any,
    missions: 12,
    totalXP: 3000,
    estimatedHours: 40,
    prerequisites: ['linear-algebra', 'complex-numbers'],
    skills: ['Quantum Mechanics', 'Quantum Algorithms', 'Qiskit'],
    instructor: {
      name: 'Dr. Sarah Mitchell',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Quantum physicist with 15+ years in quantum computing research'
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-09-20'
  },
  {
    id: 'neural-networks',
    title: 'Machine Learning & AI',
    description: 'Build and deploy advanced neural network architectures',
    progress: 45,
    level: 'intermediate',
    status: 'in-progress',
    image: 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYnJhaW58ZW58MXx8fHwxNzU4NTE5NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: 'Brain' as any,
    missions: 15,
    totalXP: 4500,
    estimatedHours: 60,
    prerequisites: ['python-basics', 'statistics'],
    skills: ['Deep Learning', 'TensorFlow', 'PyTorch', 'Computer Vision'],
    instructor: {
      name: 'Prof. Marcus Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'AI researcher and former Google Brain team member'
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-09-18'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Essentials',
    description: 'Secure systems and networks against digital threats',
    progress: 100,
    level: 'intermediate',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1660836814985-8523a0d713b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwZGlnaXRhbCUyMG5ldHdvcmt8ZW58MXx8fHwxNzU4NTIwNTg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: 'Shield' as any,
    missions: 8,
    totalXP: 2400,
    estimatedHours: 32,
    prerequisites: ['networking-basics'],
    skills: ['Penetration Testing', 'Network Security', 'Cryptography'],
    instructor: {
      name: 'James Harrison',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      bio: 'Certified Ethical Hacker with 20+ years in cybersecurity'
    },
    createdAt: '2023-12-01',
    updatedAt: '2024-08-15'
  },
  {
    id: 'advanced-algorithms',
    title: 'Advanced Algorithms',
    description: 'Complex data structures and optimization techniques',
    progress: 0,
    level: 'advanced',
    status: 'locked',
    image: 'https://images.unsplash.com/photo-1585051256362-eb56bf4d5ea3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neSUyMGNpcmN1aXR8ZW58MXx8fHwxNzU4NTM0MzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: 'Lock' as any,
    missions: 10,
    totalXP: 3500,
    estimatedHours: 45,
    prerequisites: ['data-structures', 'discrete-math'],
    skills: ['Algorithm Design', 'Dynamic Programming', 'Graph Theory'],
    instructor: {
      name: 'Dr. Lisa Wang',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      bio: 'Computer Science professor and algorithms researcher'
    },
    createdAt: '2024-02-01',
    updatedAt: '2024-09-01'
  }
];

export const mockChapters: { [courseId: string]: Chapter[] } = {
  'quantum-computing': [
    {
      id: 'intro',
      courseId: 'quantum-computing',
      title: 'Quantum Foundations',
      description: 'Introduction to quantum mechanics and computational theory',
      status: 'completed',
      type: 'video',
      duration: '15m',
      xp: 100,
      order: 1,
      resources: [
        {
          id: 'res-1',
          title: 'Quantum Mechanics Primer',
          type: 'pdf',
          url: '/resources/quantum-primer.pdf',
          description: 'Essential mathematical foundations'
        }
      ]
    },
    {
      id: 'superposition',
      courseId: 'quantum-computing',
      title: 'Superposition Principles',
      description: 'Understanding quantum superposition and wave functions',
      status: 'completed',
      type: 'reading',
      duration: '20m',
      xp: 150,
      order: 2,
      resources: []
    },
    {
      id: 'entanglement',
      courseId: 'quantum-computing',
      title: 'Quantum Entanglement',
      description: 'Exploring particle entanglement and quantum correlations',
      status: 'current',
      type: 'video',
      duration: '25m',
      xp: 200,
      order: 3,
      resources: []
    },
    {
      id: 'gates',
      courseId: 'quantum-computing',
      title: 'Quantum Logic Gates',
      description: 'Building quantum circuits with logic gates',
      status: 'available',
      type: 'quiz',
      duration: '30m',
      xp: 250,
      order: 4,
      resources: [],
      quiz: {
        id: 'quiz-gates',
        questions: [
          {
            id: 'q1',
            question: 'What is the effect of a Pauli-X gate?',
            type: 'multiple-choice',
            options: ['Bit flip', 'Phase flip', 'Identity', 'Hadamard'],
            correctAnswer: 'Bit flip',
            explanation: 'The Pauli-X gate performs a bit flip operation (|0⟩ → |1⟩, |1⟩ → |0⟩)',
            points: 10
          }
        ],
        passingScore: 70,
        timeLimit: 30
      }
    },
    {
      id: 'algorithms',
      courseId: 'quantum-computing',
      title: 'Quantum Algorithms',
      description: 'Implementing Shor\'s and Grover\'s algorithms',
      status: 'locked',
      type: 'video',
      duration: '35m',
      xp: 300,
      order: 5,
      resources: []
    },
    {
      id: 'error-correction',
      courseId: 'quantum-computing',
      title: 'Error Correction Protocols',
      description: 'Quantum error correction and fault tolerance',
      status: 'locked',
      type: 'reading',
      duration: '40m',
      xp: 350,
      order: 6,
      resources: []
    }
  ],
  'neural-networks': [
    {
      id: 'ml-intro',
      courseId: 'neural-networks',
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to ML concepts and terminology',
      status: 'completed',
      type: 'video',
      duration: '18m',
      xp: 120,
      order: 1,
      resources: []
    },
    {
      id: 'neural-basics',
      courseId: 'neural-networks',
      title: 'Neural Network Basics',
      description: 'Understanding perceptrons and neural network architecture',
      status: 'completed',
      type: 'reading',
      duration: '25m',
      xp: 180,
      order: 2,
      resources: []
    },
    {
      id: 'backpropagation',
      courseId: 'neural-networks',
      title: 'Backpropagation Algorithm',
      description: 'Learning how neural networks update their weights',
      status: 'current',
      type: 'video',
      duration: '30m',
      xp: 220,
      order: 3,
      resources: []
    }
  ],
  'cybersecurity': [
    {
      id: 'security-basics',
      courseId: 'cybersecurity',
      title: 'Security Fundamentals',
      description: 'Core principles of information security',
      status: 'completed',
      type: 'video',
      duration: '20m',
      xp: 150,
      order: 1,
      resources: []
    }
  ]
};

export const mockDashboardStats: DashboardStats = {
  coursesInProgress: 2,
  coursesCompleted: 1,
  totalXP: 2847,
  currentStreak: 12,
  weeklyGoal: 5,
  weeklyProgress: 3,
  recentAchievements: [
    {
      id: 'ach-1',
      title: 'Quantum Pioneer',
      description: 'Complete first quantum computing lesson',
      icon: '⚛️',
      xp: 100,
      unlockedAt: '2024-09-20',
      category: 'course'
    },
    {
      id: 'ach-2',
      title: 'Week Warrior',
      description: 'Study for 7 consecutive days',
      icon: '🔥',
      xp: 200,
      unlockedAt: '2024-09-18',
      category: 'streak'
    }
  ]
};

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Quantum Pioneer',
    description: 'Complete first quantum computing lesson',
    icon: '⚛️',
    xp: 100,
    unlockedAt: '2024-09-20',
    category: 'course'
  },
  {
    id: 'ach-2',
    title: 'Week Warrior',
    description: 'Study for 7 consecutive days',
    icon: '🔥',
    xp: 200,
    unlockedAt: '2024-09-18',
    category: 'streak'
  },
  {
    id: 'ach-3',
    title: 'AI Enthusiast',
    description: 'Start machine learning course',
    icon: '🤖',
    xp: 50,
    unlockedAt: '2024-09-15',
    category: 'course'
  },
  {
    id: 'ach-4',
    title: 'Security Expert',
    description: 'Complete cybersecurity course',
    icon: '🛡️',
    xp: 500,
    unlockedAt: '2024-08-15',
    category: 'course'
  },
  {
    id: 'ach-5',
    title: 'Point Collector',
    description: 'Reach 2500 XP',
    icon: '💎',
    xp: 250,
    unlockedAt: '2024-09-10',
    category: 'skill'
  }
];