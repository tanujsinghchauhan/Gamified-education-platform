import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../context/XPContext';
import { BookOpen, User, LogOut, HelpCircle } from 'lucide-react';
import UserXPLevel from './UserXPLevel';
import styled from 'styled-components';

const Nav = styled.nav`
  background: rgba(92, 71, 156, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(118, 75, 162, 0.3);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  animation: fadeIn 0.8s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const StyledLink = styled(Link)`
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.15);
    transition: var(--transition-normal);
    z-index: -1;
  }

  &:hover {
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    &::before {
      left: 0;
    }
  }

  h2 {
    color: white;
    font-size: 1.8rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
`;

const LogoutButton = styled.button`
  background: rgba(245, 87, 108, 0.2);
  border: 1px solid rgba(245, 87, 108, 0.3);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(245, 87, 108, 0.3);
    transition: var(--transition-normal);
    z-index: -1;
  }

  &:hover {
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 87, 108, 0.25);
    border-color: rgba(245, 87, 108, 0.5);
    
    &::before {
      left: 0;
    }
  }
`;

const NavItem = styled.div`
  animation: fadeInStaggered 0.5s ease-out backwards;
  
  @keyframes fadeInStaggered {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
`;

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const { refreshTrigger } = useXP();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Nav>
      <StyledLink to="/"><h2>GEEP</h2></StyledLink>
      {isAuthenticated && (
        <NavLinks>
          <NavItem>
            <StyledLink to="/"><BookOpen size={20} /> Courses</StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink to="/dashboard"><User size={20} /> Dashboard</StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink to="/faq"><HelpCircle size={20} /> FAQ</StyledLink>
          </NavItem>
          <NavItem>
            <UserXPLevel refreshTrigger={refreshTrigger} />
          </NavItem>
          <NavItem>
            <LogoutButton onClick={handleLogout}><LogOut size={20} /> Logout</LogoutButton>
          </NavItem>
        </NavLinks>
      )}
    </Nav>
  );
};

export default Header;