'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Camera,
  MessageCircle,
  Globe,
  Shield,
  Activity,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface DemoModeProps {
  visible?: boolean;
}

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string;
}

const DEMO_STEPS: Step[] = [
  {
    id: 1,
    title: 'AI Smart Search',
    description: 'Press ⌘K to search across announcements, offers, services, and colleagues with AI suggestions',
    icon: <Search className="w-6 h-6" />,
  },
  {
    id: 2,
    title: 'AI Marketplace Assistant',
    description: 'List items using voice, camera, or text with AI that recognizes images and generates listings',
    icon: <Camera className="w-6 h-6" />,
  },
  {
    id: 3,
    title: 'AI HR Assistant',
    description: 'Get instant help with HR queries, salary certificates, leave requests, and IT support',
    icon: <MessageCircle className="w-6 h-6" />,
  },
  {
    id: 4,
    title: 'Cross-Company Ecosystem',
    description: 'Access offers, announcements, and marketplace across all 30+ IHC subsidiaries',
    icon: <Globe className="w-6 h-6" />,
  },
  {
    id: 5,
    title: 'Enterprise Integration Ready',
    description: 'Azure AD SSO, SuccessFactors, MS Teams, and ADX Market Data connectors',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    id: 6,
    title: 'Activity Log & Audit Trail',
    description: 'Complete audit trail of all user actions for compliance and transparency',
    icon: <Activity className="w-6 h-6" />,
  },
];

export default function DemoMode({ visible: initialVisible = false }: DemoModeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsOpen(initialVisible);
  }, [initialVisible]);

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    setCurrentStep(0);
  };

  const step = DEMO_STEPS[currentStep];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-4 py-3 rounded-[20px] bg-[#9D63F6] hover:bg-[#7C3DDD] text-white shadow-lg transition-all duration-200 hover:shadow-xl"
        aria-label="Start demo mode"
      >
        <Play className="w-5 h-5" />
        <span className="text-sm font-medium">Demo Mode</span>
      </button>
    );
  }

  return (
    <>
      {/* Dark Overlay with Spotlight Effect */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
        }}
        onClick={handleSkip}
      />

      {/* Spotlight Circle (animated) */}
      <div
        className="fixed z-50 pointer-events-none transition-all duration-500"
        style={{
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 60px rgba(200, 151, 58, 0.6), inset 0 0 20px rgba(200, 151, 58, 0.3)',
          opacity: isAnimating ? 0.3 : 0.8,
        }}
      />

      {/* Tooltip Card */}
      <div
        className={`fixed z-50 max-w-sm transition-all duration-300 ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(calc(-50% + 160px), -50%)',
        }}
      >
        <div
          className="rounded-[20px] p-6 shadow-2xl border border-[#DFE1E6]"
          style={{
            backgroundColor: '#F8F9FB',
            boxShadow:
              '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(200, 151, 58, 0.4)',
          }}
        >
          {/* Header with Icon and Close Button */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="p-3 rounded-[12px] flex-shrink-0"
              style={{ backgroundColor: '#9D63F6' }}
            >
              <div className="text-white">{step.icon}</div>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 hover:bg-[#DFE1E6] rounded-lg transition-colors"
              aria-label="Close demo"
            >
              <X className="w-5 h-5 text-[#15161E]" />
            </button>
          </div>

          {/* Step Counter */}
          <div
            className="text-xs font-semibold mb-2"
            style={{ color: '#FFBD4C' }}
          >
            {`${currentStep + 1} of ${DEMO_STEPS.length}`}
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: '#9D63F6' }}
          >
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-sm mb-6 leading-relaxed" style={{ color: '#15161E' }}>
            {step.description}
          </p>

          {/* Progress Indicator */}
          <div className="flex gap-1 mb-6">
            {DEMO_STEPS.map((_, index) => (
              <div
                key={index}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  flex: 1,
                  backgroundColor: index <= currentStep ? '#FFBD4C' : '#DFE1E6',
                }}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-[12px] text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:disabled:bg-transparent"
              style={{
                backgroundColor: currentStep === 0 ? 'transparent' : '#DFE1E6',
                color: '#15161E',
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={handleSkip}
              className="px-3 py-2 rounded-[12px] text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: '#A4ABB8',
                color: 'white',
              }}
            >
              <span>Skip</span>
            </button>

            <button
              onClick={currentStep === DEMO_STEPS.length - 1 ? handleSkip : handleNext}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-[12px] text-sm font-medium text-white transition-all duration-200"
              style={{ backgroundColor: '#9D63F6' }}
            >
              <span>
                {currentStep === DEMO_STEPS.length - 1 ? 'Finish' : 'Next'}
              </span>
              {currentStep !== DEMO_STEPS.length - 1 && (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
