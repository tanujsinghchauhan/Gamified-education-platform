import React, { useState, useEffect } from 'react';
import { getCourses } from '../api/api';
import CourseCard from '../components/CourseCard';
import styled from 'styled-components';

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: var(--bg-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  letter-spacing: -2px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: var(--text-secondary);

  &::before {
    content: '';
    width: 32px;
    height: 32px;
    border: 3px solid var(--bg-light);
    border-top-color: var(--accent-blue);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  text-align: center;
  font-size: 1.1rem;
  padding: 2rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 12px;
  margin-top: 2rem;
`;

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data.data);
      } catch (err) {
        setError('Failed to fetch courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <LoadingSpinner>Loading your learning modules...</LoadingSpinner>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <div>
      <HeroSection>
        <HeroTitle>🌟 Learning Modules</HeroTitle>
        <HeroSubtitle>
          Embark on your educational journey with our expertly crafted learning modules. 
          Select a specialized knowledge domain to begin your transformation.
        </HeroSubtitle>
      </HeroSection>
      
      <CoursesGrid>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </CoursesGrid>
    </div>
  );
};

export default CoursesPage;