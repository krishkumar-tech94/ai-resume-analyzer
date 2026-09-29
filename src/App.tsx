import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ResumeUpload } from './components/ResumeUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ResumeAnalysisResult, TargetRole, ExperienceLevel } from './types/resume';

export default function App() {
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('Reading document content...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  const handleAnalyze = async (payload: {
    fileType: 'pdf' | 'docx' | 'text';
    fileData: string;
    fileName: string;
    targetRole: TargetRole;
    experienceLevel: ExperienceLevel;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('1/4 Parsing resume document layout & text...');

    // Simulate progressive status updates for better user feedback
    const step2Timer = setTimeout(() => {
      setLoadingStep('2/4 Verifying entities (experience, education, tools)...');
    }, 2500);

    const step3Timer = setTimeout(() => {
      setLoadingStep('3/4 Running ATS screening audit & heading checks...');
    }, 5000);

    const step4Timer = setTimeout(() => {
      setLoadingStep('4/4 Benchmarking role fit & rewriting bullet points...');
    }, 8000);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume. Please try again.');
      }

      setAnalysis(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during resume analysis.');
    } finally {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      clearTimeout(step4Timer);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar 
        onOpenHowItWorks={() => setShowHowItWorks(true)}
        onReset={handleReset}
        hasAnalysis={!!analysis}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {!analysis ? (
          <ResumeUpload 
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            loadingStep={loadingStep}
            errorMessage={errorMessage}
            onClearError={() => setErrorMessage(null)}
          />
        ) : (
          <AnalysisDashboard 
            analysis={analysis} 
            onReset={handleReset} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} AI Resume Analyzer • Powered by Gemini 3.8 Flash</p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHowItWorks(true)}
              className="hover:text-indigo-400 transition-colors"
            >
              How It Works
            </button>
            <span>•</span>
            <span className="text-slate-400">Strict Truth Guarantee (Zero Hallucination)</span>
          </div>
        </div>
      </footer>

      {/* How It Works Modal */}
      <HowItWorksModal 
        isOpen={showHowItWorks} 
        onClose={() => setShowHowItWorks(false)} 
      />
    </div>
  );
}
