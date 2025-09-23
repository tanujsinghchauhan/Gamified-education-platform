import React, { useState } from "react";
import { HoloButton } from "./HoloButton";
import { HoloInput } from "./HoloInput";
import { HoloCard } from "./HoloCard";
import { useData } from "../contexts/DataContext";

interface LoginPageProps {
  onLogin: () => void;
  onSwitchToSignup: () => void;
}

export function LoginPage({ onLogin, onSwitchToSignup }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, actions } = useData();
  const { loading, error } = state;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await actions.login(email, password);
      onLogin(); // Navigate to courses page
    } catch (error) {
      // Error is handled by the context and displayed below
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black tech-grid ambient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <HoloCard className="text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-blue-400 mb-2 animate-soft-glow">
              GEEP
            </h1>
            <p className="text-slate-400 tracking-wider text-sm">
              Gamified Environmental Education Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <HoloInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@company.com"
              required
            />

            <HoloInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="pt-4">
              <HoloButton
                type="submit"
                className="w-full"
                disabled={loading.auth}
              >
                {loading.auth ? "Signing In..." : "Sign In"}
              </HoloButton>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm mb-4">
              Don't have an account?
            </p>
            <HoloButton
              variant="secondary"
              onClick={onSwitchToSignup}
              className="w-full"
            >
              Create Account
            </HoloButton>
          </div>
        </HoloCard>

        {/* Subtle ambient elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 1}s`,
                animationDuration: `${3 + i}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
