import React from 'react';
import { cn } from './ui/utils';

interface EnergyProgressBarProps {
  progress: number; // 0-100
  className?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'emerald';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function EnergyProgressBar({ 
  progress, 
  className, 
  color = 'blue',
  showText = true,
  size = 'md'
}: EnergyProgressBarProps) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    violet: 'from-violet-500 to-violet-600',
    cyan: 'from-cyan-500 to-cyan-600',
    emerald: 'from-emerald-500 to-emerald-600'
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'w-full bg-slate-800 rounded-full overflow-hidden border border-slate-600',
        sizes[size]
      )}>
        <div 
          className={cn(
            'h-full bg-gradient-to-r transition-all duration-1000 relative',
            'shadow-[0_0_8px_rgba(59,130,246,0.3)]',
            colors[color]
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse" />
        </div>
      </div>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-white drop-shadow-lg">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}