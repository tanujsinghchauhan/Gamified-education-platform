import React, { useState } from 'react';
import { DataProvider } from './contexts/DataContext';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { CourseListingPage } from './components/CourseListingPage';
import { ContentPage } from './components/ContentPage';
import { ChapterPage } from './components/ChapterPage';
import { ProfilePage } from './components/ProfilePage';

type Page = 'login' | 'signup' | 'courses' | 'content' | 'chapter' | 'profile';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');

  const navigateTo = (page: Page, courseId?: string, chapterId?: string) => {
    setCurrentPage(page);
    if (courseId) setSelectedCourse(courseId);
    if (chapterId) setSelectedChapter(chapterId);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onLogin={() => navigateTo('courses')}
            onSwitchToSignup={() => navigateTo('signup')}
          />
        );
        
      case 'signup':
        return (
          <SignupPage
            onSignup={() => navigateTo('courses')}
            onSwitchToLogin={() => navigateTo('login')}
          />
        );
        
      case 'courses':
        return (
          <CourseListingPage
            onSelectCourse={(courseId) => navigateTo('content', courseId)}
            onProfile={() => navigateTo('profile')}
          />
        );
        
      case 'content':
        return (
          <ContentPage
            courseId={selectedCourse}
            onBack={() => navigateTo('courses')}
            onSelectChapter={(chapterId) => navigateTo('chapter', selectedCourse, chapterId)}
          />
        );
        
      case 'chapter':
        return (
          <ChapterPage
            chapterId={selectedChapter}
            onBack={() => navigateTo('content', selectedCourse)}
            onNext={() => navigateTo('content', selectedCourse)}
          />
        );
        
      case 'profile':
        return (
          <ProfilePage
            onBack={() => navigateTo('courses')}
          />
        );
        
      default:
        return (
          <LoginPage
            onLogin={() => navigateTo('courses')}
            onSwitchToSignup={() => navigateTo('signup')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white dark">
      {renderCurrentPage()}
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}