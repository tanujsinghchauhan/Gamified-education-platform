import React from 'react';
import { cn } from './ui/utils';

interface HoloButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
}

export function HoloButton({ 
  variant = 'primary', 
  className, 
  children, 
  ...props 
}: HoloButtonProps) {
  const variants = {
    primary: 'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white',
    secondary: 'text-violet-400 border-violet-400 hover:bg-violet-400 hover:text-white',
    accent: 'text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-white'
  };

  return (
    <button
      className={cn(
        'relative px-6 py-3 bg-transparent border transition-all duration-300',
        'hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-[1.02]',
        'before:absolute before:inset-0 before:bg-current before:opacity-0 before:transition-opacity',
        'hover:before:opacity-10 active:scale-[0.98]',
        'font-medium tracking-wide rounded-lg',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}