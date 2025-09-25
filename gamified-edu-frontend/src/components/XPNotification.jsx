import React, { useState, useEffect } from 'react';
import { Award, X } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease-out;
  max-width: 300px;
`;

const NotificationCard = styled.div`
  background: linear-gradient(135deg, var(--accent-green), var(--accent-blue));
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const XPIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const NotificationMessage = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const XPNotification = ({ xp, message, onClose, isVisible = true }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        onClose?.();
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!shouldRender) return null;

  return (
    <NotificationContainer isVisible={isVisible}>
      <NotificationCard>
        <XPIcon>
          <Award size={20} />
        </XPIcon>
        <NotificationContent>
          <NotificationTitle>+{xp} XP Earned!</NotificationTitle>
          <NotificationMessage>{message}</NotificationMessage>
        </NotificationContent>
        <CloseButton onClick={onClose}>
          <X size={16} />
        </CloseButton>
      </NotificationCard>
    </NotificationContainer>
  );
};

export default XPNotification;