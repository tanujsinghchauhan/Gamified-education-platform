import React from 'react';
import { Star, Zap, TrendingUp } from 'lucide-react';
import styled from 'styled-components';

const XPCard = styled.div`
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  grid-column: span 2;
  box-shadow: 0 8px 24px rgba(109, 40, 217, 0.1);
  animation: fadeIn 0.8s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const XPHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LevelInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LevelBadge = styled.div`
  background: linear-gradient(135deg, #6d28d9, #8b5cf6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(109, 40, 217, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(109, 40, 217, 0.4);
  }
`;

const XPAmount = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #6d28d9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 1px 2px rgba(109, 40, 217, 0.2);
  animation: pulse 3s infinite ease-in-out;
  
  @keyframes pulse {
    0%, 100% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(1.2);
    }
  }
`;

const XPProgressContainer = styled.div`
  margin-top: 1rem;
`;

const XPProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const XPProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background-color: rgba(139, 92, 246, 0.1);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: inset 0 2px 4px rgba(109, 40, 217, 0.1);
`;

const XPProgress = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background: linear-gradient(90deg, #6d28d9, #8b5cf6);
  transition: width 0.8s ease-out;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shine 2s infinite;
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const XPStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const XPCard_Enhanced = ({ xp = 0, level = 1 }) => {
  // Calculate XP progress towards next level
  const xpForCurrentLevel = (level - 1) * 100;
  const xpForNextLevel = level * 100;
  const xpProgress = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.min(100, Math.max(0, (xpProgress / xpNeeded) * 100));
  const xpToNextLevel = Math.max(0, xpForNextLevel - xp);

  return (
    <XPCard>
      <XPHeader>
        <LevelInfo>
          <LevelBadge>
            <Star size={18} />
            Level {level}
          </LevelBadge>
        </LevelInfo>
        <TrendingUp size={24} color="var(--accent-green)" />
      </XPHeader>
      
      <XPAmount>
        <Zap size={32} />
        {xp.toLocaleString()} XP
      </XPAmount>
      
      <XPProgressContainer>
        <XPProgressLabel>
          <span>Progress to Level {level + 1}</span>
          <span>{xpProgress}/{xpNeeded} XP</span>
        </XPProgressLabel>
        <XPProgressBar>
          <XPProgress progress={progressPercentage} />
        </XPProgressBar>
      </XPProgressContainer>
      
      <XPStats>
        <span>XP to next level: {xpToNextLevel}</span>
        <span>{Math.round(progressPercentage)}% complete</span>
      </XPStats>
    </XPCard>
  );
};

export default XPCard_Enhanced;