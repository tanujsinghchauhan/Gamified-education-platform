import React from 'react';
import { HoloCard } from './HoloCard';
import { HoloButton } from './HoloButton';
import { EnergyProgressBar } from './EnergyProgressBar';
import { ArrowLeft, Play, Lock, CheckCircle2, BookOpen, Video, HelpCircle } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed' | 'current';
  type: 'video' | 'reading' | 'quiz';
  duration: string;
  xp: number;
}

interface ContentPageProps {
  courseId: string;
  onBack: () => void;
  onSelectChapter: (chapterId: string) => void;
}

export function ContentPage({ courseId, onBack, onSelectChapter }: ContentPageProps) {
  const courseData = {
    'quantum-computing': {
      title: 'Quantum Computing Fundamentals',
      description: 'Master the principles of quantum processing and computational theory',
      progress: 75,
      totalChapters: 12,
      completedChapters: 9,
      level: 'Advanced'
    },
    'neural-networks': {
      title: 'Machine Learning & AI',
      description: 'Build and deploy advanced neural network architectures',
      progress: 45,
      totalChapters: 15,
      completedChapters: 7,
      level: 'Intermediate'
    },
    'cybersecurity': {
      title: 'Cybersecurity Essentials',
      description: 'Secure systems and networks against digital threats',
      progress: 100,
      totalChapters: 8,
      completedChapters: 8,
      level: 'Intermediate'
    }
  };

  const course = courseData[courseId as keyof typeof courseData] || courseData['quantum-computing'];

  const chapters: Chapter[] = [
    {
      id: 'intro',
      title: 'Quantum Foundations',
      description: 'Introduction to quantum mechanics and computational theory',
      status: 'completed',
      type: 'video',
      duration: '15m',
      xp: 100
    },
    {
      id: 'superposition',
      title: 'Superposition Principles',
      description: 'Understanding quantum superposition and wave functions',
      status: 'completed',
      type: 'reading',
      duration: '20m',
      xp: 150
    },
    {
      id: 'entanglement',
      title: 'Quantum Entanglement',
      description: 'Exploring particle entanglement and quantum correlations',
      status: 'current',
      type: 'video',
      duration: '25m',
      xp: 200
    },
    {
      id: 'gates',
      title: 'Quantum Logic Gates',
      description: 'Building quantum circuits with logic gates',
      status: 'available',
      type: 'quiz',
      duration: '30m',
      xp: 250
    },
    {
      id: 'algorithms',
      title: 'Quantum Algorithms',
      description: 'Implementing Shor\'s and Grover\'s algorithms',
      status: 'locked',
      type: 'video',
      duration: '35m',
      xp: 300
    },
    {
      id: 'error-correction',
      title: 'Error Correction Protocols',
      description: 'Quantum error correction and fault tolerance',
      status: 'locked',
      type: 'reading',
      duration: '40m',
      xp: 350
    }
  ];

  const getStatusIcon = (status: string, type: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    if (status === 'locked') return <Lock className="w-5 h-5 text-slate-500" />;
    
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-cyan-400" />;
      case 'reading': return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'quiz': return <HelpCircle className="w-5 h-5 text-pink-400" />;
      default: return <Play className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'cyan';
      case 'reading': return 'purple';
      case 'quiz': return 'pink';
      default: return 'cyan';
    }
  };

  return (
    <div className="min-h-screen bg-black tech-grid ambient-bg">
      {/* Header */}
      <div className="bg-slate-900/85 backdrop-blur-md border-b border-blue-400/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <HoloButton onClick={onBack} variant="secondary" className="px-4">
              <ArrowLeft className="w-4 h-4" />
            </HoloButton>
            <div>
              <h1 className="text-2xl font-bold text-blue-400 animate-soft-glow">
                {course.title}
              </h1>
              <p className="text-slate-400 text-sm">{course.description}</p>
            </div>
          </div>

          {/* Course Progress */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Course Progress</span>
              <span className="text-sm text-blue-400">{course.completedChapters}/{course.totalChapters} lessons</span>
            </div>
            <EnergyProgressBar 
              progress={course.progress} 
              color="blue" 
              showText={false}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Course Curriculum</h2>
          <p className="text-slate-400">Complete each lesson to progress through the course</p>
        </div>

        {/* Chapters List */}
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <HoloCard 
              key={chapter.id}
              glowColor={chapter.status === 'current' ? 'blue' : 
                        chapter.status === 'completed' ? 'emerald' : 'violet'}
              className={`transition-all duration-300 ${
                chapter.status === 'current' ? 'ring-2 ring-blue-400/50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Module Number */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold
                  ${chapter.status === 'completed' ? 'bg-emerald-400/20 text-emerald-400' :
                    chapter.status === 'current' ? 'bg-cyan-400/20 text-cyan-400' :
                    chapter.status === 'locked' ? 'bg-slate-600/20 text-slate-500' :
                    'bg-purple-400/20 text-purple-400'}
                `}>
                  {chapter.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  )}
                </div>

                {/* Chapter Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(chapter.status, chapter.type)}
                    <h3 className="font-bold text-white">{chapter.title}</h3>
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium uppercase tracking-wide
                      ${getTypeColor(chapter.type) === 'cyan' ? 'bg-cyan-400/20 text-cyan-400' :
                        getTypeColor(chapter.type) === 'purple' ? 'bg-purple-400/20 text-purple-400' :
                        'bg-pink-400/20 text-pink-400'}
                    `}>
                      {chapter.type}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{chapter.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>{chapter.duration}</span>
                    <span>+{chapter.xp} XP</span>
                    <span className="capitalize">{chapter.status}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  <HoloButton
                    variant={chapter.status === 'current' ? 'primary' : 
                            chapter.status === 'completed' ? 'secondary' : 'primary'}
                    onClick={() => onSelectChapter(chapter.id)}
                    disabled={chapter.status === 'locked'}
                    className="px-6"
                  >
                    {chapter.status === 'locked' ? 'Locked' :
                     chapter.status === 'completed' ? 'Review' :
                     chapter.status === 'current' ? 'Continue' : 'Start'}
                  </HoloButton>
                </div>
              </div>
            </HoloCard>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <HoloButton onClick={onBack} variant="secondary">
            Back to Dashboard
          </HoloButton>
        </div>
      </div>
    </div>
  );
}