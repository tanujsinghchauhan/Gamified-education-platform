import React from 'react';
import { cn } from './ui/utils';

interface HoloInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function HoloInput({ label, error, className, ...props }: HoloInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-blue-400 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            'w-full px-4 py-3 bg-slate-900/60 border border-slate-600',
            'text-white placeholder-slate-400 rounded-lg',
            'focus:border-blue-400 focus:outline-none focus:shadow-[0_0_8px_rgba(59,130,246,0.3)]',
            'transition-all duration-300 backdrop-blur-sm',
            error && 'border-red-400 focus:border-red-400',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}