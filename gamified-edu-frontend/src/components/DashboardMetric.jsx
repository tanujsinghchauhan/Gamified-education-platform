import React from 'react';
import styled from 'styled-components';

const MetricCard = styled.div`
  background: rgba(139, 92, 246, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(109, 40, 217, 0.08);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: var(--bg-gradient-primary);
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(139, 92, 246, 0.12) 100%);
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.3);
    
    &::before {
      left: 0;
      height: 3px;
      box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
    }
  }
`;

const MetricValue = styled.p`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.8rem 0;
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #6d28d9; /* Fallback color */
  position: relative;
  z-index: 1;
  animation: pulse 3s infinite ease-in-out;
  
  @keyframes pulse {
    0%, 100% {
      filter: drop-shadow(0 0 2px rgba(109, 40, 217, 0.2));
      transform: scale(1);
    }
    50% {
      filter: drop-shadow(0 0 5px rgba(109, 40, 217, 0.5));
      transform: scale(1.03);
    }
  }
`;

const MetricLabel = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
`;

const DashboardMetric = ({ value, label }) => {
  return (
    <MetricCard>
      <MetricValue>{value}</MetricValue>
      <MetricLabel>{label}</MetricLabel>
    </MetricCard>
  );
};

export default DashboardMetric;