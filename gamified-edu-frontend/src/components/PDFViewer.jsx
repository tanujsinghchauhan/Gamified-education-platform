import React, { useState } from 'react';
import styled from 'styled-components';
import { Download, X, FileText, CheckCircle } from 'lucide-react';

const PDFContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PDFWrapper = styled.div`
  position: relative;
  width: 90%;
  max-width: 900px;
  height: 90%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

const PDFHeader = styled.div`
  background: var(--bg-gradient-primary);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PDFTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const PDFContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: white;
  color: #333;
  line-height: 1.8;
`;

const PDFActions = styled.div`
  background: #f8f9fa;
  padding: 1rem 2rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DownloadButton = styled.button`
  background: var(--bg-gradient-primary);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CompleteButton = styled.button`
  background: var(--bg-gradient-success);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ReadingProgress = styled.div`
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PDFViewer = ({ 
  isOpen, 
  onClose, 
  title = "Course Materials",
  chapterTitle = "Chapter 1",
  onComplete 
}) => {
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Sample PDF content - in a real app, this would be loaded from a file
  const pdfContent = `
    # ${chapterTitle}: ${title}

    ## Learning Objectives
    By the end of this chapter, you will be able to:
    - Understand the fundamental concepts of ${chapterTitle.toLowerCase()}
    - Apply key principles in practical scenarios
    - Analyze case studies and examples
    - Synthesize knowledge for comprehensive understanding

    ## Introduction
    This comprehensive study material covers all essential aspects of ${chapterTitle.toLowerCase()}. 
    The content is designed to provide you with both theoretical knowledge and practical insights 
    that will enhance your understanding and application of these concepts.

    ## Key Concepts

    ### Concept 1: Fundamental Principles
    The fundamental principles underlying this topic are crucial for building a solid foundation. 
    These principles have been developed over years of research and practical application, 
    providing a framework for understanding complex relationships and interactions.

    Key characteristics include:
    - Systematic approach to problem-solving
    - Evidence-based methodology
    - Continuous improvement and adaptation
    - Integration with existing knowledge systems

    ### Concept 2: Practical Applications
    Understanding how to apply theoretical knowledge in real-world scenarios is essential for 
    mastery. This section explores various applications and their implications.

    Common applications include:
    - Industry-specific implementations
    - Research and development contexts
    - Educational and training environments
    - Community and social impact initiatives

    ### Concept 3: Advanced Topics
    For those seeking deeper understanding, advanced topics provide additional complexity 
    and nuance to the subject matter. These concepts build upon the fundamentals while 
    introducing new perspectives and methodologies.

    ## Case Studies

    ### Case Study 1: Real-World Implementation
    This case study examines a successful implementation of the concepts discussed, 
    highlighting both challenges and solutions encountered during the process.

    Background: The project began with specific objectives and constraints that required 
    innovative approaches to overcome traditional limitations.

    Solution: Through systematic application of the principles learned, the team was able to 
    achieve remarkable results that exceeded initial expectations.

    Outcomes: The success of this implementation has led to broader adoption and continued 
    development of these methodologies.

    ### Case Study 2: Lessons Learned
    Sometimes the most valuable learning comes from challenges and setbacks. This case study 
    explores a situation where initial approaches needed significant modification.

    Challenge: The original approach encountered unexpected obstacles that required creative 
    problem-solving and adaptation.

    Response: The team's ability to remain flexible and apply alternative strategies 
    ultimately led to valuable insights and improved methodologies.

    Impact: These lessons have informed best practices and continue to guide future 
    implementations in similar contexts.

    ## Practical Exercises

    ### Exercise 1: Analysis and Reflection
    Take time to consider how the concepts presented might apply to your own context or interests. 
    Consider the following questions:

    1. What aspects of this material are most relevant to your goals?
    2. How might you adapt these concepts for your specific situation?
    3. What additional resources or support might you need for implementation?

    ### Exercise 2: Application Planning
    Develop a preliminary plan for applying what you've learned:

    1. Identify specific objectives you want to achieve
    2. Outline the steps you would take
    3. Consider potential challenges and how you might address them
    4. Think about how you would measure success

    ## Summary and Next Steps
    This chapter has provided a comprehensive overview of ${chapterTitle.toLowerCase()}, 
    including fundamental principles, practical applications, and real-world examples.

    Key takeaways:
    - Understanding core principles is essential for effective application
    - Real-world implementation requires flexibility and adaptation
    - Continuous learning and improvement are crucial for long-term success
    - Community and collaboration enhance individual learning outcomes

    ## Additional Resources
    For continued learning, consider exploring:
    - Recommended readings and publications
    - Online courses and tutorials
    - Professional networks and communities
    - Practical workshops and training opportunities

    ## Assessment Preparation
    To prepare for the upcoming quiz, focus on:
    - Key concepts and definitions
    - Practical applications and examples
    - Case study analysis and lessons learned
    - Integration with previous learning

    Remember that active engagement with the material, including note-taking and discussion, 
    will enhance your understanding and retention of these important concepts.
  `;

  const handleScroll = (e) => {
    const element = e.target;
    const scrollProgress = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setReadingProgress(Math.round(scrollProgress));
  };

  const handleDownload = () => {
    // Simulate PDF download
    const element = document.createElement('a');
    const file = new Blob([pdfContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${chapterTitle}_Materials.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setHasDownloaded(true);
  };

  const handleComplete = () => {
    if (readingProgress < 80) {
      alert('Please read at least 80% of the material before completing this activity.');
      return;
    }
    
    if (onComplete) {
      onComplete();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <PDFContainer>
      <PDFWrapper>
        <PDFHeader>
          <PDFTitle>
            <FileText size={20} />
            {title}
          </PDFTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </PDFHeader>
        
        <PDFContent onScroll={handleScroll}>
          <div style={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
            {pdfContent}
          </div>
        </PDFContent>
        
        <PDFActions>
          <ReadingProgress>
            📖 Reading Progress: {readingProgress}%
            {readingProgress >= 80 && (
              <span style={{ color: 'var(--accent-green)', marginLeft: '0.5rem' }}>
                ✓ Ready to complete!
              </span>
            )}
          </ReadingProgress>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <DownloadButton onClick={handleDownload}>
              <Download size={16} />
              {hasDownloaded ? 'Downloaded ✓' : 'Download PDF'}
            </DownloadButton>
            
            <CompleteButton onClick={handleComplete}>
              <CheckCircle size={16} />
              Complete Activity (+25 XP)
            </CompleteButton>
          </div>
        </PDFActions>
      </PDFWrapper>
    </PDFContainer>
  );
};

export default PDFViewer;