import React, { useState } from 'react';
import { HoloCard } from './HoloCard';
import { HoloButton } from './HoloButton';
import { EnergyProgressBar } from './EnergyProgressBar';
import { ArrowLeft, ArrowRight, Play, Pause, Volume2, BookOpen, CheckCircle2 } from 'lucide-react';

interface ChapterPageProps {
  chapterId: string;
  onBack: () => void;
  onNext: () => void;
}

export function ChapterPage({ chapterId, onBack, onNext }: ChapterPageProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'docs' | 'quiz'>('video');
  const [videoProgress, setVideoProgress] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const chapterData = {
    title: 'Quantum Entanglement',
    description: 'Exploring particle entanglement and quantum correlations',
    progress: 65,
    xp: 200,
    estimatedTime: '25 minutes'
  };

  const quizQuestions = [
    {
      id: 'q1',
      question: 'What is quantum entanglement?',
      options: [
        'A quantum phenomenon where particles become interconnected',
        'A method of quantum computing',
        'A type of quantum gate',
        'A quantum error correction technique'
      ],
      correct: 0
    },
    {
      id: 'q2',
      question: 'Which scientist first described quantum entanglement?',
      options: [
        'Niels Bohr',
        'Albert Einstein',
        'Erwin Schrödinger',
        'Werner Heisenberg'
      ],
      correct: 2
    }
  ];

  const handleQuizAnswer = (questionId: string, answerIndex: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const renderVideoPanel = () => (
    <div className="space-y-6">
      {/* Video Player */}
      <HoloCard glowColor="cyan" className="p-0 overflow-hidden">
        <div className="relative bg-black aspect-video flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-400/10" />
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-cyan-400/20 flex items-center justify-center mb-4 mx-auto">
              {isPlaying ? (
                <Pause className="w-8 h-8 text-cyan-400" />
              ) : (
                <Play className="w-8 h-8 text-cyan-400" />
              )}
            </div>
            <p className="text-slate-300">Quantum Entanglement Simulation</p>
          </div>
        </div>
        
        {/* Video Controls */}
        <div className="p-4 bg-slate-900/50">
          <div className="flex items-center gap-4 mb-3">
            <HoloButton 
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </HoloButton>
            <Volume2 className="w-4 h-4 text-slate-400" />
            <div className="flex-1">
              <EnergyProgressBar 
                progress={videoProgress} 
                color="cyan" 
                showText={false}
                size="sm"
              />
            </div>
            <span className="text-sm text-slate-400">12:30 / 25:00</span>
          </div>
        </div>
      </HoloCard>

      {/* Video Description */}
      <HoloCard glowColor="purple">
        <h3 className="text-lg font-bold text-white mb-3">Module Overview</h3>
        <p className="text-slate-300 mb-4">
          In this module, we explore the fascinating phenomenon of quantum entanglement, 
          where particles become mysteriously connected across vast distances. Learn how 
          this quantum property enables advanced computing capabilities and secure communication protocols.
        </p>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>Duration: {chapterData.estimatedTime}</span>
          <span>Reward: +{chapterData.xp} XP</span>
        </div>
      </HoloCard>
    </div>
  );

  const renderDocsPanel = () => (
    <div className="space-y-6">
      <HoloCard glowColor="purple">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Technical Documentation</h3>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <h4 className="text-cyan-400 font-bold mb-3">Quantum Entanglement Theory</h4>
          <p className="text-slate-300 mb-4">
            Quantum entanglement is a quantum mechanical phenomenon in which the quantum states 
            of two or more objects have to be described with reference to each other, even though 
            the individual objects may be spatially separated.
          </p>

          <h4 className="text-cyan-400 font-bold mb-3">Key Properties</h4>
          <ul className="text-slate-300 space-y-2 mb-4">
            <li>• Non-locality: Entangled particles affect each other instantaneously</li>
            <li>• Measurement correlation: Measuring one particle affects the other</li>
            <li>• Quantum superposition: Particles exist in multiple states simultaneously</li>
            <li>• Decoherence: Interaction with environment breaks entanglement</li>
          </ul>

          <h4 className="text-cyan-400 font-bold mb-3">Applications</h4>
          <p className="text-slate-300 mb-4">
            Quantum entanglement forms the basis for quantum computing, quantum cryptography, 
            and quantum teleportation protocols. It enables secure communication channels 
            and exponential computational speedup for specific problems.
          </p>

          <div className="bg-slate-800/50 border border-cyan-400/30 rounded-lg p-4 mt-6">
            <h5 className="text-cyan-400 font-bold mb-2">Mission Critical Note</h5>
            <p className="text-slate-300 text-sm">
              Understanding quantum entanglement is essential for advanced neural network 
              architectures and quantum-enhanced AI systems used in grid defense protocols.
            </p>
          </div>
        </div>
      </HoloCard>
    </div>
  );

  const renderQuizPanel = () => (
    <div className="space-y-6">
      <HoloCard glowColor="pink">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="w-6 h-6 text-pink-400" />
          <h3 className="text-lg font-bold text-white">Knowledge Assessment</h3>
        </div>
        <p className="text-slate-300 mb-6">
          Test your understanding of quantum entanglement concepts.
        </p>

        <div className="space-y-6">
          {quizQuestions.map((question, index) => (
            <div key={question.id} className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4">
                {index + 1}. {question.question}
              </h4>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label 
                    key={optionIndex}
                    className="flex items-center gap-3 p-3 rounded border border-slate-600 hover:border-pink-400/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={optionIndex}
                      onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                      className="text-pink-400"
                    />
                    <span className="text-slate-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <HoloButton variant="accent" className="px-8">
            Submit Assessment
          </HoloButton>
        </div>
      </HoloCard>
    </div>
  );

  const tabContent = {
    video: renderVideoPanel(),
    docs: renderDocsPanel(),
    quiz: renderQuizPanel()
  };

  return (
    <div className="min-h-screen bg-black grid-bg particle-bg">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-cyan-400/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <HoloButton onClick={onBack} variant="secondary" className="px-4">
              <ArrowLeft className="w-4 h-4" />
            </HoloButton>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-cyan-400 animate-glow">
                {chapterData.title}
              </h1>
              <p className="text-slate-400 text-sm">{chapterData.description}</p>
            </div>
            <HoloButton onClick={onNext} variant="primary" className="px-4">
              <ArrowRight className="w-4 h-4" />
            </HoloButton>
          </div>

          {/* Progress */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Module Progress</span>
              <span className="text-sm text-cyan-400">{chapterData.progress}% Complete</span>
            </div>
            <EnergyProgressBar 
              progress={chapterData.progress} 
              color="cyan" 
              showText={false}
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6">
          {(['video', 'docs', 'quiz'] as const).map((tab) => (
            <HoloButton
              key={tab}
              variant={activeTab === tab ? 'primary' : 'secondary'}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab === 'docs' ? 'Documentation' : tab}
            </HoloButton>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl">
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
}