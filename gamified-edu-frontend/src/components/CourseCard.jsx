import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { TreePine, Waves, Atom, ArrowRight } from 'lucide-react';

const Card = styled.div`
  background: rgba(124, 58, 237, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  cursor: pointer;
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(109, 40, 217, 0.08);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    transition: var(--transition-slow);
  }

  &:hover {
    border-color: var(--accent-purple);
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      var(--shadow-xl),
      0 0 40px rgba(109, 40, 217, 0.25);

    &::before {
      left: 100%;
    }
  }

  &:hover .arrow-icon {
    transform: translateX(8px) rotate(45deg);
  }

  &:hover .card-content {
    transform: translateY(-2px);
  }
`;

const CardContent = styled.div`
  transition: var(--transition-normal);
`;

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
`;

const Description = styled.p`
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const ProgressSection = styled.div`
  margin-top: 1rem;
`;

const ProgressText = styled.p`
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: var(--text-accent);
  font-size: 0.9rem;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  height: 8px;
  box-shadow: inset 0 2px 4px rgba(109, 40, 217, 0.1);
`;

const ProgressBar = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background: linear-gradient(90deg, #6d28d9, #8b5cf6);
  border-radius: 12px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const ArrowIcon = styled(ArrowRight)`
  color: var(--accent-purple);
  transition: var(--transition-normal);
  flex-shrink: 0;
  opacity: 0.7;
  filter: drop-shadow(0 0 8px rgba(109, 40, 217, 0.4));
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(109, 40, 217, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: var(--transition-normal);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress from backend data
    const calculateProgress = async () => {
      try {
        // Use the progress property from the course data if it exists (from the backend)
        if (course.progress !== undefined) {
          // Backend returns progress as 0-100 percentage
          setProgress(course.progress);
          console.log(`Course ${course.id} progress from backend: ${course.progress}%`);
          return;
        }
        
        // Fallback to local storage as backup
        const savedProgress = localStorage.getItem(`course-${course.id}-progress`);
        if (savedProgress) {
          try {
            const progressData = JSON.parse(savedProgress);
            const chapters = progressData.chapters || [];
            
            // Only count submitted chapters for progress
            const submittedChapters = chapters.filter(chapter => chapter.submitted).length;
            const totalChapters = chapters.length || 2; // Default to 2 chapters
            
            const calculatedProgress = totalChapters > 0 ? Math.round((submittedChapters / totalChapters) * 100) : 0;
            setProgress(calculatedProgress);
            console.log(`Course ${course.id} progress from localStorage: ${calculatedProgress}% (${submittedChapters}/${totalChapters} chapters completed)`);
          } catch (error) {
            console.error('Error parsing progress data from localStorage:', error);
            setProgress(0);
          }
        } else {
          console.log(`No progress data found for course ${course.id}, setting to 0%`);
          setProgress(0);
        }
      } catch (error) {
        console.error('Error calculating progress:', error);
        setProgress(0);
      }
    };

    calculateProgress();
    
    // Listen for progress updates
    const handleProgressUpdate = (event) => {
      if (event.detail && event.detail.courseId === course.id) {
        calculateProgress();
      }
    };
    
    window.addEventListener('courseProgressUpdated', handleProgressUpdate);
    window.addEventListener('storage', calculateProgress);
    
    return () => {
      window.removeEventListener('courseProgressUpdated', handleProgressUpdate);
      window.removeEventListener('storage', calculateProgress);
    };
  }, [course.id]);

  const handleCourseClick = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <Card onClick={handleCourseClick}>
      <CardHeader>
        <Title>{course.title}</Title>
        <ArrowIcon size={24} className="arrow-icon" />
      </CardHeader>
      
      <CardContent className="card-content">
        <Description>{course.description}</Description>
        
        <ProgressSection>
          <ProgressText>Progress: {progress}%</ProgressText>
          <ProgressBarContainer>
            <ProgressBar progress={progress} />
          </ProgressBarContainer>
          <StartButton onClick={(e) => { e.stopPropagation(); handleCourseClick(); }}>
            {progress > 0 ? '✨ Continue Learning' : '🚀 Start Course'}
          </StartButton>
        </ProgressSection>
      </CardContent>
    </Card>
  );
};

export default CourseCard;