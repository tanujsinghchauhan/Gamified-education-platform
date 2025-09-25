import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../api/api';
import { useXP } from '../context/XPContext';
import DashboardMetric from '../components/DashboardMetric';
import XPCard_Enhanced from '../components/XPCard_Enhanced';
import styled from 'styled-components';

// Helper function to get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-gradient-radial);
    z-index: -2;
  }
`;

const DashboardHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: var(--bg-gradient-primary);
    border-radius: 24px;
    z-index: -1;
    opacity: 0.7;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 1px;
    background: var(--bg-dark);
    border-radius: 23px;
    z-index: -1;
  }
`;

const DashboardTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
`;

const DashboardSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
  margin: 0;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const DashboardPage = () => {
  const { refreshTrigger } = useXP();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...', refreshTrigger);
      const response = await getDashboardData();
      console.log('Full API response:', JSON.stringify(response, null, 2));
      
      // Handle different response structures
      let data = response.data?.data || response.data;
      
      // If data is still null or undefined, use default values
      if (!data) {
        console.log('No data received, using defaults');
        data = {
          xp: 150, // Match what's shown in the header
          level: 2, // Match what's shown in the header
          learning_streak: 0,
          completed_chapters: 0,
          total_chapters: 2,
          completion_rate: 0
        };
      }
      
      // Manually check localStorage for chapter completion as a backup
      // This helps ensure dashboard stays in sync with course progress
      try {
        // Look for any course progress in localStorage
        const keys = Object.keys(localStorage);
        const progressKeys = keys.filter(key => key.startsWith('course-') && key.endsWith('-progress'));
        
        let totalCompletedChapters = 0;
        let totalChapters = 0;
        
        progressKeys.forEach(key => {
          try {
            const progressData = JSON.parse(localStorage.getItem(key));
            if (progressData && progressData.chapters) {
              const completedInThisCourse = progressData.chapters.filter(c => c.submitted).length;
              totalCompletedChapters += completedInThisCourse;
              totalChapters += progressData.chapters.length;
              
              console.log(`Found ${completedInThisCourse} completed chapters in ${key}`);
            }
          } catch (e) {
            console.error('Error parsing localStorage item:', e);
          }
        });
        
        // If we found completed chapters in localStorage, update the dashboard data
        if (totalCompletedChapters > 0 && totalCompletedChapters > data.completed_chapters) {
          console.log(`Using localStorage data: ${totalCompletedChapters} completed chapters instead of ${data.completed_chapters}`);
          data.completed_chapters = totalCompletedChapters;
          
          // Update total chapters only if it's larger than what's in data
          if (totalChapters > data.total_chapters) {
            data.total_chapters = totalChapters;
          }
          
          // Recalculate completion rate
          data.completion_rate = (data.completed_chapters / data.total_chapters) * 100;
        }
      } catch (err) {
        console.error('Error checking localStorage for progress:', err);
      }
      
      setDashboardData(data);
      console.log('Final dashboard data set:', JSON.stringify(data, null, 2));
      console.log('Learning streak value:', data.learning_streak);
      console.log('Completed chapters value:', data.completed_chapters);
      
      // Get user name from localStorage or auth context
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const name = userData.username || userData.name || userData.email?.split('@')[0] || 'there';
      setUserName(name);
      console.log('Set user name:', name);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Set default data even on error - use more realistic values
      const defaultData = {
        xp: 150, // Match what's shown in the header
        level: 2, // Match what's shown in the header
        learning_streak: 0,
        completed_chapters: 0,
        total_chapters: 2,
        completion_rate: 0
      };
      setDashboardData(defaultData);
      console.log('Set default data due to error:', defaultData);
      
      setError('Using default data due to connection issue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]); // Add refreshTrigger as dependency

  // Add window event listener for manual refresh
  useEffect(() => {
    const handleXPUpdate = () => {
      console.log('Manual dashboard refresh triggered');
      // Add a small delay to make sure backend has processed changes
      setTimeout(() => {
        fetchDashboardData();
        console.log('Dashboard data refreshed via xpUpdated event');
      }, 300);
    };
    
    // Listen for both events
    window.addEventListener('xpUpdated', handleXPUpdate);
    window.addEventListener('courseProgressUpdated', handleXPUpdate);
    
    return () => {
      window.removeEventListener('xpUpdated', handleXPUpdate);
      window.removeEventListener('courseProgressUpdated', handleXPUpdate);
    };
  }, []);

  if (loading) return (
    <DashboardContainer>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1rem'
      }}>
        <div className="spinner"></div>
        <p style={{color: 'var(--text-secondary)', fontSize: '1.2rem'}}>Loading your dashboard...</p>
      </div>
    </DashboardContainer>
  );
  
  if (error) return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>{getGreeting()}, {userName}!</DashboardTitle>
        <DashboardSubtitle>Your gamified learning journey at a glance</DashboardSubtitle>
      </DashboardHeader>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        gap: '1rem'
      }}>
        <div style={{fontSize: '4rem'}}>⚠️</div>
        <p style={{color: '#ef4444', fontSize: '1.2rem', textAlign: 'center'}}>{error}</p>
      </div>
    </DashboardContainer>
  );
  
  if (!dashboardData) return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>{getGreeting()}, {userName}!</DashboardTitle>
        <DashboardSubtitle>Your gamified learning journey at a glance</DashboardSubtitle>
      </DashboardHeader>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        gap: '1rem'
      }}>
        <div style={{fontSize: '4rem'}}>📊</div>
        <p style={{color: 'var(--text-secondary)', fontSize: '1.2rem'}}>No dashboard data available.</p>
      </div>
    </DashboardContainer>
  );

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>{getGreeting()}, {userName}!</DashboardTitle>
        <DashboardSubtitle>Your gamified learning journey at a glance</DashboardSubtitle>
        <button 
          onClick={() => {
            console.log('Manual refresh button clicked');
            fetchDashboardData();
          }}
          style={{
            background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '0.6rem 1.2rem',
            fontSize: '0.95rem',
            marginTop: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.3)';
          }}
        >
          <span style={{ display: 'inline-block', animation: 'spin 1.5s infinite linear' }}>🔄</span> 
          Refresh Dashboard
        </button>
      </DashboardHeader>
      
      <DashboardGrid>
        <XPCard_Enhanced 
          xp={dashboardData && dashboardData.xp !== undefined ? dashboardData.xp : 150} 
          level={dashboardData && dashboardData.level !== undefined ? dashboardData.level : 2} 
        />
        <DashboardMetric value={dashboardData?.learning_streak ?? 0} label="Learning Streak" />
        <DashboardMetric value={dashboardData?.completed_chapters ?? 0} label="Chapters Completed" />
        <DashboardMetric value={dashboardData?.total_chapters ?? 2} label="Total Chapters" />
        <DashboardMetric value={dashboardData?.completion_rate ? `${Math.round(dashboardData.completion_rate)}%` : '0%'} label="Overall Progress" />
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default DashboardPage;