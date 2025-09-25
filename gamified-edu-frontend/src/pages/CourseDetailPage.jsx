import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourses, getCourseDetails, getCourseProgress, markComponentComplete } from '../api/api';
import { useXP } from '../context/XPContext';
import XPNotification from '../components/XPNotification';
import VideoPlayer from '../components/VideoPlayer';
import PDFViewer from '../components/PDFViewer';
import axios from 'axios';
import { Play, FileText, Brain, CheckCircle, XCircle, Award } from 'lucide-react';
import styled from 'styled-components';

const Container = styled.div`
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

const CourseHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, transparent, var(--accent-blue-20), transparent);
    animation: rotate 20s linear infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 1px;
    background: var(--bg-dark);
    border-radius: 23px;
    z-index: -1;
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CourseTitle = styled.h1`
  margin: 0 0 1rem 0;
  font-size: 3rem;
  font-weight: 700;
  background: var(--text-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
  text-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
`;

const CourseDescription = styled.p`
  font-size: 1.3rem;
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
`;

const ActivitiesGrid = styled.div`
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ActivityCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 2.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-md);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: var(--bg-gradient-primary);
    transition: left 0.4s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: var(--accent-blue);
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    
    &::before {
      left: 0;
    }
  }

  ${props => props.completed && `
    border-color: var(--accent-green);
    background: rgba(34, 197, 94, 0.05);
    
    &::after {
      content: '✓';
      position: absolute;
      top: 20px;
      right: 20px;
      background: var(--bg-gradient-success);
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
    }
  `}
`;

const ActivityHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ActivityIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.completed ? 'var(--bg-gradient-success)' : 'var(--bg-gradient-primary)'};
  color: white;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: icon-shine 3s infinite;
  }
  
  @keyframes icon-shine {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.h3`
  margin: 0 0 0.8rem 0;
  color: var(--text-primary);
  font-size: 1.4rem;
  font-weight: 600;
`;

const ActivityDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 1rem;
`;

const ActivityButton = styled.button`
  background: ${props => props.completed ? 'var(--bg-gradient-success)' : 'var(--bg-gradient-primary)'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 1.5rem;
  font-size: 1rem;
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
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    
    &::before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const XPReward = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: var(--bg-gradient-warning);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-sm);
  z-index: 2;
  
  &::before {
    content: '⚡';
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const QuizContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 2.5rem;
  margin-top: 2rem;
  box-shadow: var(--shadow-md);
  position: relative;
  
  &::before {
    content: '🧠';
    position: absolute;
    top: -15px;
    left: 30px;
    background: var(--bg-gradient-primary);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
`;

const Question = styled.div`
  margin-bottom: 2rem;
`;

const QuestionText = styled.h3`
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.5;
`;

const AnswerOption = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  padding: 1.2rem 1.5rem;
  margin-bottom: 0.8rem;
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    border-color: var(--accent-blue);
    background: rgba(99, 102, 241, 0.1);
    transform: translateX(4px);
    
    &::before {
      left: 100%;
    }
  }

  ${props => props.selected && `
    border-color: var(--accent-blue);
    background: rgba(99, 102, 241, 0.15);
    transform: translateX(4px);
  `}

  ${props => props.correct && `
    border-color: var(--accent-green);
    background: rgba(34, 197, 94, 0.15);
    transform: translateX(4px);
  `}

  ${props => props.incorrect && `
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.15);
    transform: translateX(4px);
  `}
`;

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { triggerXPRefresh } = useXP();
  const navigate = useNavigate();

  // Field name helper - gets value regardless of camelCase or snake_case
  const getFieldValue = (obj, camelCaseKey, snakeCaseKey) => {
    // Try camelCase first (new format from backend)
    if (obj[camelCaseKey] !== undefined) {
      return obj[camelCaseKey];
    }
    // Fall back to snake_case (old format)
    if (obj[snakeCaseKey] !== undefined) {
      return obj[snakeCaseKey];
    }
    // Default to false if neither exists
    return false;
  };

  // Save progress to localStorage
  const saveProgress = (chaptersData, currentChapterIndex, xpEarned) => {
    const progressData = {
      chapters: chaptersData,
      currentChapter: currentChapterIndex,
      earnedXP: xpEarned,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(`course-${courseId}-progress`, JSON.stringify(progressData));
    
    // Trigger custom event to update course cards
    window.dispatchEvent(new CustomEvent('courseProgressUpdated', { 
      detail: { courseId, progressData } 
    }));
    
    console.log('Progress saved:', progressData);
  };
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showXPNotification, setShowXPNotification] = useState(false);
  const [lastXPEarned, setLastXPEarned] = useState(0);
  const [lastActivity, setLastActivity] = useState('');

  // Debug currentChapter changes and refresh dashboard when chapter changes
  useEffect(() => {
    console.log('Current chapter changed to:', currentChapter);
    if (chapters && chapters[currentChapter]) {
      console.log('Current chapter data:', chapters[currentChapter]);
      
      // Refresh dashboard data when we navigate to a new chapter
      // This ensures the dashboard shows the correct completed chapters
      setTimeout(() => {
        window.dispatchEvent(new Event('xpUpdated'));
      }, 300);
    }
  }, [currentChapter, chapters]);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  // Dynamic quiz questions based on current chapter
  const getQuizQuestions = (chapterIndex) => {
    const allQuestions = [
      // Chapter 1 questions
      [
        {
          id: 1,
          question: "What is the primary function of forest ecosystems?",
          options: [
            "Entertainment and recreation",
            "Carbon storage and biodiversity conservation",
            "Urban development",
            "Mining resources"
          ],
          correct: 1
        },
        {
          id: 2,
          question: "Which factor is most important for forest ecosystem health?",
          options: [
            "Human intervention",
            "Biodiversity and natural balance",
            "Economic development",
            "Tourism activities"
          ],
          correct: 1
        },
        {
          id: 3,
          question: "How do forests contribute to climate regulation?",
          options: [
            "By providing shade only",
            "Through carbon sequestration and oxygen production",
            "By blocking wind patterns",
            "Through soil erosion prevention only"
          ],
          correct: 1
        }
      ],
      // Chapter 2 questions
      [
        {
          id: 1,
          question: "What does biodiversity refer to?",
          options: [
            "The number of trees in a forest",
            "The variety of life forms in an ecosystem",
            "The amount of rainfall in an area",
            "The temperature variations"
          ],
          correct: 1
        },
        {
          id: 2,
          question: "Which conservation strategy is most effective for protecting biodiversity?",
          options: [
            "Complete isolation of ecosystems",
            "Sustainable management practices",
            "Eliminating all human activities",
            "Focusing only on large mammals"
          ],
          correct: 1
        },
        {
          id: 3,
          question: "What is the main threat to forest biodiversity?",
          options: [
            "Natural disasters only",
            "Climate change",
            "Habitat destruction and fragmentation",
            "Overpopulation of wildlife"
          ],
          correct: 2
        }
      ],
      // Chapter 3 questions
      [
        {
          id: 1,
          question: "What are ecosystem services?",
          options: [
            "Services provided by technology companies",
            "Benefits that ecosystems provide to humans",
            "Management strategies for forests",
            "Scientific research methods"
          ],
          correct: 1
        },
        {
          id: 2,
          question: "Which is an example of a regulating ecosystem service?",
          options: [
            "Timber production",
            "Recreation opportunities",
            "Water purification",
            "Food provision"
          ],
          correct: 2
        },
        {
          id: 3,
          question: "Sustainable forest management aims to:",
          options: [
            "Maximize short-term profits",
            "Balance ecological, economic, and social needs",
            "Eliminate all human activities",
            "Focus only on timber production"
          ],
          correct: 1
        }
      ]
    ];
    
    return allQuestions[chapterIndex] || allQuestions[0];
  };

  const quizQuestions = getQuizQuestions(currentChapter);

  // Function to refresh course data
  const refreshCourseData = async () => {
    try {
      console.log('Refreshing course data...');
      const courseResponse = await getCourseDetails(courseId);
      const courseData = courseResponse.data.data;
      
      if (courseData) {
        setCourse(courseData);
        console.log('Refreshed course data:', courseData);
        
        // This will trigger the chapter processing below
        return courseData;
      }
    } catch (err) {
      console.error('Error refreshing course data:', err);
    }
    return null;
  };

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        console.log('Fetching course details for ID:', courseId);
        
        // Fetch detailed course data with chapters
        const courseResponse = await getCourseDetails(courseId);
        const courseData = courseResponse.data.data;
        
        if (!courseData) {
          console.error('Course not found with ID:', courseId);
          setLoading(false);
          return;
        }
        
        setCourse(courseData);
        console.log('Found course with chapters:', courseData);
        
        // Create chapter structure from real backend chapters
        const backendChapters = courseData.chapters || [];
        console.log('Raw backend chapters:', backendChapters);
        console.log('Full course response structure:', courseData);
        console.log('Backend fields for each chapter:', backendChapters.map(ch => ({
          id: ch.id,
          title: ch.title,
          isCompleted: ch.isCompleted,
          hasViewedVideo: ch.hasViewedVideo,
          hasDownloadedPPT: ch.hasDownloadedPPT,
          hasCompletedQuiz: ch.hasCompletedQuiz,
          allFields: Object.keys(ch)
        })));
        const defaultChapters = backendChapters.map((chapter, index) => {
          // Log the raw chapter object to see all available fields
          console.log(`Raw chapter ${index + 1} data:`, chapter);
          
          // Use our helper function to get values regardless of camelCase or snake_case
          const videoCompleted = getFieldValue(chapter, 'hasViewedVideo', 'has_viewed_video');
          const pdfCompleted = getFieldValue(chapter, 'hasDownloadedPPT', 'has_downloaded_ppt');
          const quizCompleted = getFieldValue(chapter, 'hasCompletedQuiz', 'has_completed_quiz');
          const chapterCompleted = getFieldValue(chapter, 'isCompleted', 'is_completed');
          
          // Create a consistent chapter object structure
          const chapterData = {
            id: index + 1,
            backendId: chapter.id, // Use the real MongoDB ObjectID
            title: chapter.title,
            videoUrl: getFieldValue(chapter, 'videoURL', 'video_url'),
            pptLink: getFieldValue(chapter, 'pptLink', 'ppt_link'),
            quizId: getFieldValue(chapter, 'quizID', 'quiz_id'),
            activities: { 
              video: videoCompleted, 
              pdf: pdfCompleted, 
              quiz: quizCompleted
            },
            submitted: chapterCompleted,
            canSubmit: (videoCompleted && pdfCompleted && quizCompleted) && !chapterCompleted,
            locked: index > 0 // Will be updated in the unlocking logic below
          };
          
          console.log(`Chapter ${index + 1} (${chapter.title}) processed:`, {
            activities: chapterData.activities,
            submitted: chapterData.submitted,
            canSubmit: chapterData.canSubmit
          });
          
          console.log(`Chapter ${index + 1} (${chapter.title}):`, {
            hasViewedVideo: chapter.has_viewed_video,
            hasDownloadedPpt: chapter.has_downloaded_ppt,
            hasCompletedQuiz: chapter.has_completed_quiz,
            isCompleted: chapter.is_completed,
            activities: chapterData.activities
          });
          
          return chapterData;
        });
        
        // Check for inconsistencies in activity completion vs chapter completion
        // Sometimes activities show complete but chapter isn't marked as complete
        defaultChapters.forEach((chapter, idx) => {
          if (
            chapter.activities.video && 
            chapter.activities.pdf && 
            chapter.activities.quiz && 
            !chapter.submitted
          ) {
            console.log(`Inconsistency found: Chapter ${idx + 1} has all activities complete but isn't marked as submitted`);
            defaultChapters[idx].submitted = true;
            
            // Attempt to fix by calling backend API
            setTimeout(async () => {
              try {
                const chapterBackendId = chapter.backendId;
                
                // Mark all components as complete
                await Promise.all([
                  markComponentComplete(courseId, chapterBackendId, 'video'),
                  markComponentComplete(courseId, chapterBackendId, 'ppt'), 
                  markComponentComplete(courseId, chapterBackendId, 'quiz')
                ]);
                console.log(`Fixed inconsistency for Chapter ${idx + 1}`);
                
                // Update localStorage to ensure dashboard stays in sync
                const savedProgress = localStorage.getItem(`course-${courseId}-progress`);
                if (savedProgress) {
                  try {
                    const progressData = JSON.parse(savedProgress);
                    if (progressData.chapters && progressData.chapters[idx]) {
                      progressData.chapters[idx].submitted = true;
                      progressData.chapters[idx].activities = {
                        video: true,
                        pdf: true,
                        quiz: true
                      };
                      localStorage.setItem(`course-${courseId}-progress`, JSON.stringify(progressData));
                      console.log(`Updated localStorage for Chapter ${idx + 1}`);
                    }
                  } catch (e) {
                    console.error('Error updating localStorage:', e);
                  }
                }
                
                // Trigger dashboard refresh with additional event data
                window.dispatchEvent(new Event('xpUpdated'));
                window.dispatchEvent(new CustomEvent('courseProgressUpdated', { 
                  detail: { 
                    courseId, 
                    progressData: { 
                      chapterIndex: idx,
                      completed: true
                    } 
                  }
                }));
              } catch (err) {
                console.error(`Failed to fix inconsistency for Chapter ${idx + 1}:`, err);
              }
            }, 500);
          }
        });
        
        // Unlock chapters based on completion status from backend
        const updatedChapters = defaultChapters.map((chapter, index) => {
          if (index === 0) {
            console.log(`Chapter ${index + 1}: Always unlocked (first chapter)`);
            return { ...chapter, locked: false }; // First chapter always unlocked
          }
          
          // Unlock if previous chapter is completed (submitted)
          const prevChapter = defaultChapters[index - 1];
          const prevChapterCompleted = prevChapter.submitted;
          
          console.log(`Chapter ${index + 1} unlock check:`, {
            prevChapterTitle: prevChapter.title,
            prevChapterActivities: prevChapter.activities,
            prevIsCompleted: prevChapter.submitted,
            willUnlock: prevChapterCompleted
          });
          
          return {
            ...chapter,
            locked: !prevChapterCompleted
          };
        });
        
        setChapters(updatedChapters);
        console.log('Final chapters with locking status:', updatedChapters.map(ch => ({
          title: ch.title,
          activities: ch.activities,
          locked: ch.locked
        })));
        
      } catch (err) {
        console.error('Failed to fetch course:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndProgress();
  }, [courseId]);

  const handleActivityComplete = async (activityType) => {
    // Safety check
    if (!chapters || chapters.length === 0 || currentChapter >= chapters.length) {
      console.error('Invalid chapters or currentChapter state');
      return;
    }
    
    const chapter = chapters[currentChapter];
    
    if (!chapter) {
      console.error('Chapter not found for index:', currentChapter);
      return;
    }
    
    // Don't allow activity if chapter is already submitted
    if (chapter.submitted) {
      alert("This chapter has already been submitted. You cannot earn more XP from it.");
      return;
    }
    
    // Don't allow if activity already completed
    if (chapter.activities[activityType]) {
      alert("You have already completed this activity!");
      return;
    }
    
    try {
      // Map frontend activity types to backend component names
      const componentMap = {
        'video': 'video',
        'pdf': 'ppt',
        'quiz': 'quiz'
      };
      
      const component = componentMap[activityType];
      
      // Use the chapter's backend ID for API call
      const chapterBackendId = chapter.backendId;
      
      console.log('Making API call:', {
        courseId,
        chapterBackendId,
        component,
        apiUrl: `/api/v1/progress/course/${courseId}/chapter/${chapterBackendId}/${component}`
      });
      
      // Call backend API to mark component complete
      const response = await markComponentComplete(courseId, chapterBackendId, component);
      console.log('Activity completion response:', response);
      
      // Update chapter state
      const updatedChapters = [...chapters];
      updatedChapters[currentChapter].activities[activityType] = true;
      
      // Check if all activities completed - enable submit button
      const allCompleted = updatedChapters[currentChapter].activities.video && 
                          updatedChapters[currentChapter].activities.pdf && 
                          updatedChapters[currentChapter].activities.quiz;
                          
      updatedChapters[currentChapter].canSubmit = allCompleted;
      
      // Only auto-submit if backend confirms all activities are now done
      // This is just an XP notification, the real submit still requires the user to click
      if (allCompleted) {
        console.log('All activities completed for this chapter!');
      }
      
      console.log('Updated chapters after activity completion:', updatedChapters);
      setChapters(updatedChapters);
      
      // Award XP for completing activity (backend handles this, but show notification)
      const xpReward = 25; // All activities give 25 XP
      setLastXPEarned(xpReward);
      setLastActivity(activityType);
      setShowXPNotification(true);
      
      // Trigger XP refresh in header and dashboard
      if (window.triggerXPRefresh) {
        window.triggerXPRefresh();
      }
      
      // Also trigger manual XP update event
      setTimeout(() => {
        window.dispatchEvent(new Event('xpUpdated'));
      }, 100);
      
      console.log(`${activityType} completed successfully! Earned ${xpReward} XP - Chapter ${chapter.title}`);
      
      // Re-fetch course details to ensure we have the latest progress
      // This will update unlocking of next chapters based on backend state
      setTimeout(async () => {
        try {
          const courseResponse = await getCourseDetails(courseId);
          if (courseResponse.data && courseResponse.data.data) {
            console.log('Refreshed course data after activity completion:', courseResponse.data.data);
            // We don't need to fully refresh - frontend state is already updated
          }
        } catch (err) {
          console.error('Failed to refresh course data:', err);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error completing activity:', error.response?.data || error.message);
      alert('Failed to complete activity. Please try again.');
    }
  };

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleQuizSubmit = () => {
    // Check if all questions are answered
    const unansweredQuestions = quizQuestions.filter(q => quizAnswers[q.id] === undefined);
    if (unansweredQuestions.length > 0) {
      alert(`Please answer all questions before submitting. ${unansweredQuestions.length} question(s) remaining.`);
      return;
    }

    setQuizSubmitted(true);
    
    // Calculate score and award XP
    let correctAnswers = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) {
        correctAnswers++;
      }
    });
    
    const scorePercentage = Math.round((correctAnswers / quizQuestions.length) * 100);
    
    // Only complete quiz activity if score is 80% or higher
    if (correctAnswers >= Math.ceil(quizQuestions.length * 0.8)) {
      setTimeout(() => {
        handleActivityComplete('quiz');
      }, 2000); // Delay to show results first
    } else {
      setTimeout(() => {
        alert(`You scored ${scorePercentage}%. You need at least 80% to pass. Please try again after reviewing the materials.`);
        // Reset quiz for retry
        setQuizSubmitted(false);
        setQuizAnswers({});
      }, 3000);
    }
  };

  const handleChapterSubmit = async () => {
    const chapter = chapters[currentChapter];
    
    try {
      console.log('Submitting chapter:', chapter);
      
      // Submit chapter and award bonus XP
      const updatedChapters = [...chapters];
      updatedChapters[currentChapter].submitted = true;
      updatedChapters[currentChapter].canSubmit = false;
      
      // Unlock next chapter
      if (currentChapter + 1 < chapters.length) {
        updatedChapters[currentChapter + 1].locked = false;
        console.log(`Unlocking chapter ${currentChapter + 2}`);
      }
      
      setChapters(updatedChapters);
      
      // Manually mark all components complete in backend to ensure chapter is fully completed
      try {
        // Use the chapter's backend ID for API call
        const chapterBackendId = chapter.backendId;
        
        // Ensure all components are marked complete
        await Promise.all([
          markComponentComplete(courseId, chapterBackendId, 'video'),
          markComponentComplete(courseId, chapterBackendId, 'ppt'),
          markComponentComplete(courseId, chapterBackendId, 'quiz')
        ]);
        
        console.log('All components marked complete in backend');
      } catch (err) {
        console.log('Error ensuring components complete:', err);
        // Continue - we'll still show the chapter as complete
      }
      
      // Award chapter completion bonus
      const bonusXP = 25;
      const newXP = earnedXP + bonusXP;
      setEarnedXP(newXP);
      setLastXPEarned(bonusXP);
      setLastActivity('chapter');
      setShowXPNotification(true);
      
      // Save progress with completed chapter
      saveProgress(updatedChapters, currentChapter, newXP);
      
      // Refresh dashboard data
      triggerXPRefresh();
      setTimeout(() => {
        window.dispatchEvent(new Event('xpUpdated'));
        window.dispatchEvent(new CustomEvent('courseProgressUpdated', { 
          detail: { courseId, progressData: { completed: true } } 
        }));
      }, 100);
      
      alert(`Chapter ${chapter.id}: "${chapter.title}" submitted successfully! +${bonusXP} bonus XP earned!`);
      
      // Refresh course details to get updated progress
      setTimeout(async () => {
        try {
          const courseResponse = await getCourseDetails(courseId);
          if (courseResponse.data && courseResponse.data.data) {
            console.log('Refreshed course data after chapter submission:', courseResponse.data.data);
            // No need to update state - we already did that above
          }
        } catch (err) {
          console.error('Failed to refresh course data:', err);
        }
      }, 500);
      
    } catch (error) {
      console.error('Error submitting chapter:', error);
      alert('Failed to submit chapter. Please try again.');
    }
  };

  const goToChapter = async (chapterIndex) => {
    console.log('goToChapter called with index:', chapterIndex);
    
    // Safety check for valid index
    if (!chapters || chapterIndex >= chapters.length) {
      console.error('Invalid chapter index:', chapterIndex);
      return;
    }
    
    console.log('Chapter data:', chapters[chapterIndex]);
    console.log('Is chapter locked?', chapters[chapterIndex]?.locked);
    
    // Verify chapter is unlocked
    if (chapters[chapterIndex].locked) {
      console.log('Chapter is locked. Cannot navigate.');
      alert("Complete previous chapters to unlock this one!");
      return;
    }
    
    // Refresh course data first to make sure we have the latest progress
    try {
      console.log('Refreshing course data before chapter navigation');
      await refreshCourseData();
      
      // Note: The useEffect will update the chapters array when course data changes
      // but it won't have happened by the time the next line runs
      // so we'll update the current chapter now and let the UI refresh when useEffect completes
    } catch (err) {
      console.error('Failed to refresh course data:', err);
      // Continue with navigation anyway
    }
    
    // Navigate to the chapter
    console.log('Setting current chapter to:', chapterIndex);
    setCurrentChapter(chapterIndex);
    setShowQuiz(false);
    setQuizSubmitted(false);
    setQuizAnswers({});
    
    // Reset modal states
    setShowVideoPlayer(false);
    setShowPDFViewer(false);
    
    // Trigger XP refresh
    setTimeout(() => {
      window.dispatchEvent(new Event('xpUpdated'));
    }, 200);
    
    console.log('Chapter navigation completed');
  };

  if (loading) return <Container><p>Loading course...</p></Container>;
  if (!course) return <Container><p>Course not found</p></Container>;
  if (!chapters || chapters.length === 0) return <Container><p>Loading course chapters...</p></Container>;

  const currentChapterData = chapters && chapters.length > 0 && currentChapter < chapters.length ? chapters[currentChapter] : null;
  
  console.log('Render - currentChapter:', currentChapter);
  console.log('Render - chapters.length:', chapters?.length);
  console.log('Render - currentChapterData:', currentChapterData);
  
  if (!currentChapterData) return <Container><p>Loading chapter data...</p></Container>;
  const completedActivities = Object.values(currentChapterData.activities).filter(Boolean).length;
  const totalActivities = 3; // video + pdf + quiz
  const progressPercentage = (completedActivities / totalActivities) * 100;

  const getActivityMessage = (activity) => {
    const messages = {
      'video': 'Great job watching the educational video!',
      'pdf': 'PDF materials downloaded successfully!',
      'quiz': 'Excellent work on the quiz!'
    };
    return messages[activity] || 'Activity completed!';
  };

  return (
    <Container>
      {showXPNotification && (
        <XPNotification
          xp={lastXPEarned}
          message={getActivityMessage(lastActivity)}
          onClose={() => setShowXPNotification(false)}
          isVisible={showXPNotification}
        />
      )}
      <CourseHeader>
        <CourseTitle>{course.title}</CourseTitle>
        <CourseDescription>{course.description}</CourseDescription>
        
        {/* Chapter Navigation */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => goToChapter(index)}
              style={{
                padding: '0.8rem 1.2rem',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: chapter.locked ? '#666' : 
                           chapter.submitted ? 'var(--accent-green)' : 
                           index === currentChapter ? 'var(--accent-blue)' : 'var(--border-color)',
                backgroundColor: chapter.submitted ? 'rgba(63, 185, 80, 0.2)' : 
                               index === currentChapter ? 'rgba(88, 166, 255, 0.2)' : 'var(--bg-dark)',
                color: chapter.locked ? '#666' : 'var(--text-primary)',
                cursor: chapter.locked ? 'not-allowed' : 'pointer',
                opacity: chapter.locked ? 0.5 : 1,
                fontWeight: index === currentChapter ? 'bold' : 'normal',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Chapter {chapter.id}</span> 
                {chapter.submitted && <span style={{ color: 'var(--accent-green)' }}>✓</span>}
                {chapter.locked && <span>🔒</span>}
                {!chapter.locked && !chapter.submitted && index !== currentChapter && <span>👉</span>}
              </div>
            </button>
          ))}
        </div>
        
        <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <div><span style={{ color: 'var(--accent-green)' }}>✓</span> Completed</div>
            <div><span>🔒</span> Locked</div>
            <div><span>👉</span> Available</div>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
          Current: <strong>{chapters[currentChapter].title}</strong>
        </div>
        
        {earnedXP > 0 && (
          <div style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            🎉 Earned {earnedXP} XP in this session!
          </div>
        )}
      </CourseHeader>

      <ActivitiesGrid>
        {/* Video Activity */}
        <ActivityCard completed={chapters[currentChapter].activities.video}>
          <XPReward><Award size={16} /> +25 XP</XPReward>
          <ActivityHeader>
            <ActivityIcon completed={chapters[currentChapter].activities.video}>
              {chapters[currentChapter].activities.video ? <CheckCircle size={24} /> : <Play size={24} />}
            </ActivityIcon>
            <ActivityInfo>
              <ActivityTitle>Watch Educational Video</ActivityTitle>
              <ActivityDescription>
                Learn about {chapters[currentChapter].title.toLowerCase()}
              </ActivityDescription>
            </ActivityInfo>
          </ActivityHeader>
          <ActivityButton 
            completed={chapters[currentChapter].activities.video}
            onClick={() => {
              if (chapters[currentChapter].activities.video || chapters[currentChapter].submitted) return;
              setShowVideoPlayer(true);
            }}
            disabled={chapters[currentChapter].activities.video || chapters[currentChapter].submitted}
          >
            {chapters[currentChapter].activities.video ? (
              <>
                <CheckCircle size={16} /> Completed
              </>
            ) : (
              <>
                <Play size={16} /> Watch Video
              </>
            )}
          </ActivityButton>
        </ActivityCard>

        {/* PDF Activity */}
        <ActivityCard completed={chapters[currentChapter].activities.pdf}>
          <XPReward><Award size={16} /> +25 XP</XPReward>
          <ActivityHeader>
            <ActivityIcon completed={chapters[currentChapter].activities.pdf}>
              {chapters[currentChapter].activities.pdf ? <CheckCircle size={24} /> : <FileText size={24} />}
            </ActivityIcon>
            <ActivityInfo>
              <ActivityTitle>Download Study Materials</ActivityTitle>
              <ActivityDescription>
                Access comprehensive PDF resources for {chapters[currentChapter].title.toLowerCase()}
              </ActivityDescription>
            </ActivityInfo>
          </ActivityHeader>
          <ActivityButton 
            completed={chapters[currentChapter].activities.pdf}
            onClick={() => {
              if (chapters[currentChapter].activities.pdf || chapters[currentChapter].submitted) return;
              setShowPDFViewer(true);
            }}
            disabled={chapters[currentChapter].activities.pdf || chapters[currentChapter].submitted}
          >
            {chapters[currentChapter].activities.pdf ? (
              <>
                <CheckCircle size={16} /> Completed
              </>
            ) : (
              <>
                <FileText size={16} /> View & Download Materials
              </>
            )}
          </ActivityButton>
        </ActivityCard>

        {/* Quiz Activity */}
        <ActivityCard completed={chapters[currentChapter].activities.quiz}>
          <XPReward><Award size={16} /> +25 XP</XPReward>
          <ActivityHeader>
            <ActivityIcon completed={chapters[currentChapter].activities.quiz}>
              {chapters[currentChapter].activities.quiz ? <CheckCircle size={24} /> : <Brain size={24} />}
            </ActivityIcon>
            <ActivityInfo>
              <ActivityTitle>Take Knowledge Quiz</ActivityTitle>
              <ActivityDescription>
                Test your understanding of {chapters[currentChapter].title.toLowerCase()}
              </ActivityDescription>
            </ActivityInfo>
          </ActivityHeader>
          <ActivityButton 
            completed={chapters[currentChapter].activities.quiz}
            onClick={() => setShowQuiz(!showQuiz)}
            disabled={chapters[currentChapter].submitted}
          >
            {chapters[currentChapter].activities.quiz ? (
              <>
                <CheckCircle size={16} /> Completed
              </>
            ) : (
              <>
                <Brain size={16} /> Take Quiz
              </>
            )}
          </ActivityButton>
        </ActivityCard>
      </ActivitiesGrid>

      {/* Chapter Submit Button */}
      {(() => {
        const chapter = chapters[currentChapter];
        const allActivitiesCompleted = chapter.activities.video && 
                                      chapter.activities.pdf && 
                                      chapter.activities.quiz;
        const canSubmitChapter = allActivitiesCompleted && !chapter.submitted;
        
        if (canSubmitChapter) {
          return (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              border: '1px solid var(--accent-blue)'
            }}>
              <h3 style={{ marginTop: 0 }}>All Activities Completed!</h3>
              <p>Great job! You've completed all activities in this chapter.</p>
              <button
                onClick={handleChapterSubmit}
                style={{
                  background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(63, 185, 80, 0.3)',
                  animation: 'pulse 2s infinite'
                }}
              >
                🎉 Submit Chapter {chapters[currentChapter].id} (+25 Bonus XP!)
              </button>
            </div>
          );
        }
        return null;
      })()}

      {chapters[currentChapter].submitted && (
        <div style={{ textAlign: 'center', marginTop: '2rem', padding: '2rem', backgroundColor: 'rgba(63, 185, 80, 0.1)', borderRadius: '12px', border: '1px solid var(--accent-green)' }}>
          <h3 style={{ color: 'var(--accent-green)', margin: '0 0 1rem 0' }}>
            ✅ Chapter {chapters[currentChapter].id} Completed!
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            This chapter has been submitted. You cannot earn more XP from these activities.
            {currentChapter + 1 < chapters.length && " Proceed to the next chapter!"}
          </p>
        </div>
      )}

      {/* Quiz Section */}
      {showQuiz && !chapters[currentChapter].activities.quiz && !chapters[currentChapter].submitted && (
        <QuizContainer>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '2rem' }}>
            Knowledge Quiz
          </h2>
          
          {quizQuestions.map((q, index) => (
            <Question key={q.id}>
              <QuestionText>{index + 1}. {q.question}</QuestionText>
              {q.options.map((option, optionIndex) => (
                <AnswerOption
                  key={optionIndex}
                  selected={quizAnswers[q.id] === optionIndex}
                  correct={quizSubmitted && optionIndex === q.correct}
                  incorrect={quizSubmitted && quizAnswers[q.id] === optionIndex && optionIndex !== q.correct}
                  onClick={() => !quizSubmitted && handleQuizAnswer(q.id, optionIndex)}
                  disabled={quizSubmitted}
                >
                  {option}
                </AnswerOption>
              ))}
            </Question>
          ))}
          
          {!quizSubmitted ? (
            <ActivityButton onClick={handleQuizSubmit}>
              Submit Quiz
            </ActivityButton>
          ) : (() => {
            let correctAnswers = 0;
            quizQuestions.forEach(q => {
              if (quizAnswers[q.id] === q.correct) {
                correctAnswers++;
              }
            });
            const scorePercentage = Math.round((correctAnswers / quizQuestions.length) * 100);
            const passed = correctAnswers >= Math.ceil(quizQuestions.length * 0.8);
            
            return (
              <div style={{ textAlign: 'center', marginTop: '2rem', padding: '2rem', borderRadius: '12px', background: passed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${passed ? 'var(--accent-green)' : '#ef4444'}` }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {passed ? '🎉' : '📚'}
                </div>
                <h3 style={{ color: passed ? 'var(--accent-green)' : '#ef4444', margin: '0 0 1rem 0' }}>
                  Quiz {passed ? 'Passed' : 'Not Passed'}
                </h3>
                <p style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>
                  Score: {correctAnswers}/{quizQuestions.length} ({scorePercentage}%)
                </p>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {passed 
                    ? 'Excellent work! You\'ve demonstrated a solid understanding of the material.' 
                    : 'Please review the materials and try again. You need at least 80% to pass.'
                  }
                </p>
              </div>
            );
          })()}
        </QuizContainer>
      )}

      {/* Video Player Modal */}
      <VideoPlayer
        isOpen={showVideoPlayer}
        onClose={() => setShowVideoPlayer(false)}
        title={`${chapters[currentChapter].title} - Educational Video`}
        onComplete={() => handleActivityComplete('video')}
      />

      {/* PDF Viewer Modal */}
      <PDFViewer
        isOpen={showPDFViewer}
        onClose={() => setShowPDFViewer(false)}
        title="Study Materials"
        chapterTitle={chapters[currentChapter].title}
        onComplete={() => handleActivityComplete('pdf')}
      />
    </Container>
  );
};

export default CourseDetailPage;