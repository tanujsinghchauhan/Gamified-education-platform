import React, { useState } from 'react';
import { HoloButton } from './HoloButton';
import { HoloInput } from './HoloInput';
import { HoloCard } from './HoloCard';
import { EnergyProgressBar } from './EnergyProgressBar';

interface SignupPageProps {
  onSignup: () => void;
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSignup, onSwitchToLogin }: SignupPageProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onSignup();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <HoloInput
              label="Username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Enter your username"
              required
            />
            <HoloInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="user@company.com"
              required
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <HoloInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a secure password"
              required
            />
            <HoloInput
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
        );
      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="text-blue-400">
              <h3 className="text-xl font-bold mb-2">Account Created</h3>
              <p className="text-slate-400">
                Registration complete. Welcome to TechLearn, {formData.username}.
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-sm text-slate-300 mb-2">Setup Status:</p>
              <EnergyProgressBar progress={100} color="emerald" showText={false} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black tech-grid ambient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <HoloCard className="text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-violet-400 mb-2 animate-soft-glow">
              CREATE ACCOUNT
            </h1>
            <p className="text-slate-400 tracking-wider text-sm">
              Step {step} of {totalSteps}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <EnergyProgressBar 
              progress={progress} 
              color="violet" 
              showText={false}
              className="mb-2" 
            />
            <p className="text-xs text-slate-400">Registration Progress</p>
          </div>

          {renderStep()}

          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <HoloButton 
                variant="secondary" 
                onClick={handleBack}
                className="flex-1"
              >
                Previous
              </HoloButton>
            )}
            <HoloButton 
              variant="primary" 
              onClick={handleNext}
              className="flex-1"
            >
              {step === totalSteps ? 'Get Started' : 'Next'}
            </HoloButton>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm mb-4">
              Already have an account?
            </p>
            <HoloButton 
              variant="accent" 
              onClick={onSwitchToLogin}
              className="w-full"
            >
              Sign In Instead
            </HoloButton>
          </div>
        </HoloCard>
      </div>
    </div>
  );
}