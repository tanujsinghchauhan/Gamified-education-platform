import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../api/api';
import { Star, Zap } from 'lucide-react';
import styled from 'styled-components';

const XPContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 0.8rem 1.5rem;
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  transition: var(--transition-normal);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const LevelBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-gradient-primary);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const XPDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-green);
  font-weight: 600;
  font-size: 1rem;
  position: relative;

  &::before {
    content: '⚡';
    margin-right: 0.2rem;
  }
`;

const XPProgressBar = styled.div`
  width: 80px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
`;

const XPProgress = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background: var(--bg-gradient-success);
  border-radius: 6px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: progress-shine 2s infinite;
  }

  @keyframes progress-shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const UserXPLevel = ({ refreshTrigger }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      console.log('Fetching user XP data...', refreshTrigger);
      const response = await getDashboardData();
      setUserData(response.data.data);
      console.log('Updated XP data:', response.data.data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [refreshTrigger]); // Add refreshTrigger as dependency

  // Add window event listener for manual refresh
  useEffect(() => {
    const handleXPUpdate = () => {
      console.log('Manual XP refresh triggered');
      fetchUserData();
    };
    
    window.addEventListener('xpUpdated', handleXPUpdate);
    return () => window.removeEventListener('xpUpdated', handleXPUpdate);
  }, []);

  if (loading || !userData) return null;

  // Calculate XP progress towards next level
  // Assuming each level requires level * 100 XP (e.g., Level 2 = 200 XP, Level 3 = 300 XP)
  const currentLevel = userData.level || 1;
  const currentXP = userData.xp || 0;
  const xpForCurrentLevel = (currentLevel - 1) * 100;
  const xpForNextLevel = currentLevel * 100;
  const xpProgress = currentXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.min(100, (xpProgress / xpNeeded) * 100);

  return (
    <XPContainer>
      <LevelBadge>
        <Star size={16} />
        Level {currentLevel}
      </LevelBadge>
      <XPDisplay>
        <Zap size={16} />
        {currentXP} XP
      </XPDisplay>
      <XPProgressBar>
        <XPProgress progress={progressPercentage} />
      </XPProgressBar>
    </XPContainer>
  );
};

export default UserXPLevel;