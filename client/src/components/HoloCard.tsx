import React from 'react';
import { cn } from './ui/utils';

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function HoloCard({ children, className, glowColor = 'blue' }: HoloCardProps) {
  const glowColors = {
    blue: 'shadow-blue-500/15 border-blue-500/20 hover:shadow-blue-500/25',
    violet: 'shadow-violet-500/15 border-violet-500/20 hover:shadow-violet-500/25',
    cyan: 'shadow-cyan-500/15 border-cyan-500/20 hover:shadow-cyan-500/25',
    emerald: 'shadow-emerald-500/15 border-emerald-500/20 hover:shadow-emerald-500/25'
  };

  return (
    <div
      className={cn(
        'relative bg-slate-900/85 backdrop-blur-md border rounded-xl p-6',
        'transition-all duration-300 hover:scale-[1.02]',
        'shadow-[0_0_15px] hover:shadow-[0_0_20px]',
        glowColors[glowColor as keyof typeof glowColors] || glowColors.blue,
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}