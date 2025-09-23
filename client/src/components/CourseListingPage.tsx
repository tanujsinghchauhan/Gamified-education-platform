import React, { useEffect } from 'react';
import { HoloCard } from './HoloCard';
import { HoloButton } from './HoloButton';
import { EnergyProgressBar } from './EnergyProgressBar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, Lock, Star, Zap, Shield, Brain } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface CourseListingPageProps {
  onSelectCourse: (courseId: string) => void;
  onProfile: () => void;
}

export function CourseListingPage({ onSelectCourse, onProfile }: CourseListingPageProps) {
  const { state, actions } = useData();
  const { courses, dashboardStats, loading, error } = state;

  // Load data on component mount
  useEffect(() => {
    actions.loadCourses();
    actions.loadDashboardStats();
  }, []);

  // Icon mapping for courses (since React nodes can't be stored in JSON)
  const getIconForCourse = (courseId: string) => {
    switch (courseId) {
      case 'quantum-computing': return <Zap className="w-6 h-6" />;
      case 'neural-networks': return <Brain className="w-6 h-6" />;
      case 'cybersecurity': return <Shield className="w-6 h-6" />;
      case 'advanced-algorithms': return <Lock className="w-6 h-6" />;
      default: return <Play className="w-6 h-6" />;
    }
  };

  // Show loading state
  if (loading.courses || loading.dashboard) {
    return (
      <div className="min-h-screen bg-black tech-grid ambient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black tech-grid ambient-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <HoloButton onClick={() => actions.clearError()}>
            Try Again
          </HoloButton>
        </div>
      </div>
    );
  }

  // Remove the static courses array since we're now using the data from context
  // const courses: Course[] = [


  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'emerald';
      case 'intermediate': return 'blue';
      case 'advanced': return 'violet';
      default: return 'blue';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Star className="w-5 h-5 text-emerald-400" />;
      case 'locked': return <Lock className="w-5 h-5 text-slate-500" />;
      default: return <Play className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black tech-grid ambient-bg">
      {/* Header */}
      <div className="bg-slate-900/85 backdrop-blur-md border-b border-blue-400/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-400 animate-soft-glow">
              LEARNING DASHBOARD
            </h1>
            <p className="text-slate-400 text-sm">Choose your learning path</p>
          </div>
          <HoloButton onClick={onProfile} variant="secondary">
            View Profile
          </HoloButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <HoloCard glowColor="blue" className="text-center">
            <h3 className="text-blue-400 text-lg font-bold mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-white">{dashboardStats?.coursesInProgress || 0}</p>
          </HoloCard>
          <HoloCard glowColor="emerald" className="text-center">
            <h3 className="text-emerald-400 text-lg font-bold mb-2">Completed</h3>
            <p className="text-3xl font-bold text-white">{dashboardStats?.coursesCompleted || 0}</p>
          </HoloCard>
          <HoloCard glowColor="violet" className="text-center">
            <h3 className="text-violet-400 text-lg font-bold mb-2">Total Points</h3>
            <p className="text-3xl font-bold text-white">{dashboardStats?.totalXP.toLocaleString() || 0}</p>
          </HoloCard>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <HoloCard 
              key={course.id} 
              glowColor={getLevelColor(course.level)}
              className="overflow-hidden"
            >
              {/* Course Image */}
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className={`text-${getLevelColor(course.level)}-400`}>
                    {getIconForCourse(course.id)}
                  </div>
                  <span className={`text-${getLevelColor(course.level)}-400 text-sm font-medium uppercase tracking-wide`}>
                    {course.level}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  {getStatusIcon(course.status)}
                </div>
              </div>

              {/* Course Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-slate-300 text-sm">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{course.missions} lessons</span>
                  <span className="capitalize">{course.status}</span>
                </div>

                {/* Progress Bar */}
                {course.status !== 'locked' && (
                  <div>
                    <EnergyProgressBar 
                      progress={course.progress} 
                      color={getLevelColor(course.level) as any}
                      size="sm"
                      showText={false}
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Progress: {course.progress}%
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  <HoloButton
                    variant={getLevelColor(course.level) === 'blue' ? 'primary' : 
                            getLevelColor(course.level) === 'violet' ? 'secondary' : 'primary'}
                    className="w-full"
                    onClick={() => onSelectCourse(course.id)}
                    disabled={course.status === 'locked'}
                  >
                    {course.status === 'locked' ? 'Prerequisites Required' :
                     course.status === 'completed' ? 'Review Course' :
                     course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                  </HoloButton>
                </div>
              </div>
            </HoloCard>
          ))}
        </div>
      </div>
    </div>
  );
}