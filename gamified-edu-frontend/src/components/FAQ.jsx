import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQContainer = styled.div`
  max-width: 1000px;
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

const FAQHeader = styled.div`
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

const FAQTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const FAQSubtitle = styled.p`
  font-size: 1.3rem;
  color: purple;
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FAQItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  ${props => props.isOpen && `
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  `}
`;

const FAQQuestion = styled.button`
  width: 100%;
  padding: 2rem;
  background: none;
  border: none;
  text-align: left;
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: color 0.3s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const FAQAnswer = styled.div`
  padding: 0 2rem 2rem 2rem;
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.7;
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const IconWrapper = styled.div`
  background: var(--bg-gradient-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: transform 0.3s ease;
  
  ${props => props.isOpen && `
    transform: rotate(180deg);
  `}
`;

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "What is GEEP and how does it work?",
      answer: "GEEP is a gamified learning platform that makes education engaging through interactive chapters, XP points, and level progression. You complete activities, earn points, and track your learning journey in a fun, game-like environment."
    },
    {
      question: "How do I earn XP points and level up?",
      answer: "You earn 25 XP for completing each activity and get bonus points for consistent learning. Every 100 XP earned increases your level by 1. Your progress is automatically saved and synced across all devices."
    },
    {
      question: "What happens if I lose my progress?",
      answer: "Your progress is securely stored in our cloud database and linked to your account. Even if you clear your browser data or switch devices, your XP, completed chapters, and achievements are safely preserved."
    },
    {
      question: "Can I access courses offline?",
      answer: "Currently, EcoVerse requires an internet connection to sync your progress and load new content. However, we're working on offline capabilities for downloaded courses in future updates."
    },
    {
      question: "How is my learning streak calculated?",
      answer: "Your learning streak counts consecutive days you've completed at least one activity on the platform. The streak resets if you miss a day, encouraging consistent daily learning habits."
    },
    {
      question: "Are there any prerequisites for courses?",
      answer: "Most courses are designed to be beginner-friendly with no prerequisites. However, some advanced courses may recommend completing foundational courses first, which will be clearly indicated in the course description."
    },
    {
      question: "How can I track my overall progress?",
      answer: "Your dashboard provides a comprehensive overview of your learning journey, including total XP, current level, completed chapters, learning streak, and overall completion percentage across all courses."
    },
    {
      question: "Can I retake quizzes and activities?",
      answer: "Yes! You can retake any quiz or activity to improve your understanding. However, XP is only awarded once per activity to maintain fair progression through the learning system."
    },
    {
      question: "Is GEEP free to use?",
      answer: "GEEP offers both free and premium content. Basic courses and features are completely free, while advanced courses and premium features require a subscription for unlimited access."
    },
    {
      question: "How do I get help if I'm stuck on a topic?",
      answer: "Each course includes detailed explanations, examples, and hints. You can also access our community forums, contact support through the help center, or reach out to instructors for additional guidance."
    }
  ];

  return (
    <FAQContainer>
      <FAQHeader>
        <FAQTitle>
          <HelpCircle size={40} />
          Frequently Asked Questions
        </FAQTitle>
        <FAQSubtitle>
          Find answers to common questions about GEEP and start your learning journey with confidence
        </FAQSubtitle>
      </FAQHeader>

      <FAQList>
        {faqData.map((item, index) => (
          <FAQItem key={index} isOpen={openItems[index]}>
            <FAQQuestion onClick={() => toggleItem(index)}>
              {item.question}
              <IconWrapper isOpen={openItems[index]}>
                {openItems[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </IconWrapper>
            </FAQQuestion>
            <FAQAnswer isOpen={openItems[index]}>
              {item.answer}
            </FAQAnswer>
          </FAQItem>
        ))}
      </FAQList>
    </FAQContainer>
  );
};

export default FAQ;