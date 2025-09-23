import React from 'react';
import { HoloCard } from './HoloCard';
import { HoloButton } from './HoloButton';
import { EnergyProgressBar } from './EnergyProgressBar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Star, Zap, Shield, Award, TrendingUp, Calendar } from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const userData = {
    username: 'Commander_Nova',
    email: 'nova@nexus.grid',
    level: 15,
    currentXP: 2847,
    nextLevelXP: 3000,
    rank: 'Quantum Specialist',
    joinDate: '2024.01.15',
    avatar: 'https://images.unsplash.com/photo-1633957897986-70e83293f3ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4NjExODY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  };

  const achievements = [
    {
      id: 'first-mission',
      title: 'First Neural Link',
      description: 'Completed your first training mission',
      icon: <Zap className="w-6 h-6" />,
      unlocked: true,
      rarity: 'common'
    },
    {
      id: 'quantum-master',
      title: 'Quantum Entangler',
      description: 'Mastered quantum entanglement protocols',
      icon: <Star className="w-6 h-6" />,
      unlocked: true,
      rarity: 'rare'
    },
    {
      id: 'security-expert',
      title: 'Grid Guardian',
      description: 'Completed all cybersecurity missions',
      icon: <Shield className="w-6 h-6" />,
      unlocked: true,
      rarity: 'epic'
    },
    {
      id: 'perfect-score',
      title: 'Neural Perfection',
      description: 'Achieved 100% on 5 assessments',
      icon: <Award className="w-6 h-6" />,
      unlocked: false,
      rarity: 'legendary'
    }
  ];

  const completedCourses = [
    {
      title: 'Grid Defense Systems',
      completedDate: '2024.09.20',
      score: 98,
      xpEarned: 1200
    },
    {
      title: 'Basic Neural Networks',
      completedDate: '2024.09.15',
      score: 92,
      xpEarned: 800
    },
    {
      title: 'Quantum Computing Fundamentals',
      completedDate: '2024.09.10',
      score: 95,
      xpEarned: 1000
    }
  ];

  const stats = [
    { label: 'Missions Completed', value: '27', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Perfect Scores', value: '8', icon: <Star className="w-5 h-5" /> },
    { label: 'Study Streak', value: '12 days', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Total XP Earned', value: '8,420', icon: <Zap className="w-5 h-5" /> }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-slate-400 border-slate-400';
      case 'rare': return 'text-cyan-400 border-cyan-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const xpProgress = (userData.currentXP / userData.nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-black grid-bg particle-bg">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-cyan-400/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <HoloButton onClick={onBack} variant="secondary" className="px-4">
              <ArrowLeft className="w-4 h-4" />
            </HoloButton>
            <div>
              <h1 className="text-2xl font-bold text-cyan-400 animate-glow">
                COMMANDER PROFILE
              </h1>
              <p className="text-slate-400 text-sm">Neural link status and achievements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Avatar & Basic Info */}
            <HoloCard glowColor="cyan" className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <ImageWithFallback
                  src={userData.avatar}
                  alt="Commander Avatar"
                  className="w-full h-full rounded-full object-cover border-4 border-cyan-400/50"
                />
                <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{userData.username}</h2>
              <p className="text-cyan-400 font-medium mb-2">{userData.rank}</p>
              <p className="text-slate-400 text-sm">{userData.email}</p>
            </HoloCard>

            {/* Level & XP */}
            <HoloCard glowColor="purple">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-purple-400 mb-2 animate-glow">
                  {userData.level}
                </div>
                <p className="text-slate-400 text-sm uppercase tracking-wide">Neural Level</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Experience Points</span>
                  <span className="text-purple-400">{userData.currentXP} / {userData.nextLevelXP}</span>
                </div>
                <EnergyProgressBar 
                  progress={xpProgress} 
                  color="purple" 
                  showText={false}
                />
                <p className="text-xs text-slate-500 text-center">
                  {userData.nextLevelXP - userData.currentXP} XP to next level
                </p>
              </div>
            </HoloCard>

            {/* Stats */}
            <HoloCard glowColor="emerald">
              <h3 className="text-lg font-bold text-emerald-400 mb-4">Mission Statistics</h3>
              <div className="space-y-3">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-emerald-400">{stat.icon}</div>
                      <span className="text-slate-300 text-sm">{stat.label}</span>
                    </div>
                    <span className="text-white font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </HoloCard>
          </div>

          {/* Right Column - Achievements & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            <HoloCard glowColor="cyan">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">Neural Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`
                      p-4 rounded-lg border transition-all duration-300
                      ${achievement.unlocked 
                        ? 'bg-slate-800/50 border-opacity-50 hover:border-opacity-100' 
                        : 'bg-slate-900/30 border-slate-600 opacity-50'
                      }
                      ${getRarityColor(achievement.rarity)}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        p-2 rounded-lg 
                        ${achievement.unlocked ? 'bg-current/20' : 'bg-slate-700/20'}
                      `}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-slate-400 text-xs">
                          {achievement.description}
                        </p>
                        <div className="mt-2">
                          <span className={`
                            text-xs uppercase tracking-wide font-medium
                            ${getRarityColor(achievement.rarity).split(' ')[0]}
                          `}>
                            {achievement.rarity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </HoloCard>

            {/* Completed Courses */}
            <HoloCard glowColor="pink">
              <h3 className="text-lg font-bold text-pink-400 mb-4">Mission History</h3>
              <div className="space-y-4">
                {completedCourses.map((course, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">{course.title}</h4>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-medium">{course.score}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Completed: {course.completedDate}</span>
                      <span>+{course.xpEarned} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </HoloCard>

            {/* Account Info */}
            <HoloCard glowColor="purple">
              <h3 className="text-lg font-bold text-purple-400 mb-4">Neural Link Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Link Established:</span>
                  <span className="text-white ml-2">{userData.joinDate}</span>
                </div>
                <div>
                  <span className="text-slate-400">Current Rank:</span>
                  <span className="text-white ml-2">{userData.rank}</span>
                </div>
                <div>
                  <span className="text-slate-400">Access Level:</span>
                  <span className="text-white ml-2">Level {userData.level}</span>
                </div>
                <div>
                  <span className="text-slate-400">Security Status:</span>
                  <span className="text-emerald-400 ml-2">AUTHENTICATED</span>
                </div>
              </div>
            </HoloCard>
          </div>
        </div>
      </div>
    </div>
  );
}