import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Cpu, 
  Code, 
  Database, 
  BarChart3, 
  Layers,
  ArrowRight,
  ClipboardPaste,
  FileCheck
} from 'lucide-react';
import { TargetRole, ExperienceLevel } from '../types/resume';
import { SAMPLE_RESUMES, SampleResume } from '../data/sampleResumes';

interface ResumeUploadProps {
  onAnalyze: (payload: {
    fileType: 'pdf' | 'docx' | 'text';
    fileData: string;
    fileName: string;
    targetRole: TargetRole;
    experienceLevel: ExperienceLevel;
  }) => void;
  isLoading: boolean;
  loadingStep: string;
  errorMessage: string | null;
  onClearError: () => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onAnalyze,
  isLoading,
  loadingStep,
  errorMessage,
  onClearError,
}) => {
  const [targetRole, setTargetRole] = useState<TargetRole>('Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Entry-Level / Intern (0-2 yrs)');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('upload');
  const [pastedText, setPastedText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{ file: File; base64: string; type: 'pdf' | 'docx' | 'text' } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const roles: { role: TargetRole; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
    {
      role: 'Software Engineer',
      icon: Code,
      description: 'Full-stack, backend, frontend, systems & scalable architectures',
    },
    {
      role: 'AI/ML Engineer',
      icon: Cpu,
      description: 'Deep learning, LLMs, PyTorch, RAG, inference & MLOps pipelines',
    },
    {
      role: 'Data Scientist',
      icon: Database,
      description: 'Predictive modeling, statistical experimentation, ML algorithms & Python',
    },
    {
      role: 'Data Analyst',
      icon: BarChart3,
      description: 'SQL, BI reporting, data transformation, KPIs & exploratory analytics',
    },
  ];

  const levels: ExperienceLevel[] = [
    'Entry-Level / Intern (0-2 yrs)',
    'Mid-Level (2-5 yrs)',
    'Senior Level (5+ yrs)',
  ];

  const handleFileProcess = (file: File) => {
    setLocalError(null);
    onClearError();

    const extension = file.name.split('.').pop()?.toLowerCase();
    let detectedType: 'pdf' | 'docx' | 'text' | null = null;

    if (extension === 'pdf' || file.type === 'application/pdf') {
      detectedType = 'pdf';
    } else if (
      extension === 'docx' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      detectedType = 'docx';
    } else if (extension === 'txt' || file.type === 'text/plain') {
      detectedType = 'text';
    }

    if (!detectedType) {
      setLocalError('Unsupported file type. Please upload a valid PDF (.pdf), Word Document (.docx), or plain text (.txt) file.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setLocalError('File size exceeds the 20MB limit. Please upload a smaller resume file.');
      return;
    }

    const reader = new FileReader();

    if (detectedType === 'text') {
      reader.onload = () => {
        const textContent = reader.result as string;
        if (!textContent || textContent.trim().length < 20) {
          setLocalError('The file appears to be empty or contains insufficient text.');
          return;
        }
        setSelectedFile({ file, base64: textContent, type: 'text' });
      };
      reader.readAsText(file);
    } else {
      reader.onload = () => {
        const base64Data = reader.result as string;
        setSelectedFile({ file, base64: base64Data, type: detectedType! });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleTriggerAnalysis = () => {
    setLocalError(null);
    onClearError();

    if (activeTab === 'upload') {
      if (!selectedFile) {
        setLocalError('Please select or drag-and-drop a resume file (PDF or DOCX) to analyze.');
        return;
      }
      onAnalyze({
        fileType: selectedFile.type,
        fileData: selectedFile.base64,
        fileName: selectedFile.file.name,
        targetRole,
        experienceLevel,
      });
    } else if (activeTab === 'paste') {
      if (!pastedText || pastedText.trim().length < 30) {
        setLocalError('Please paste your full resume content (at least 30 characters).');
        return;
      }
      onAnalyze({
        fileType: 'text',
        fileData: pastedText.trim(),
        fileName: 'Pasted_Resume.txt',
        targetRole,
        experienceLevel,
      });
    }
  };

  const handleLoadSample = (sample: SampleResume) => {
    setLocalError(null);
    onClearError();
    setTargetRole(sample.targetRole);
    setExperienceLevel(sample.experienceLevel as ExperienceLevel);

    onAnalyze({
      fileType: 'text',
      fileData: sample.text,
      fileName: sample.fileName,
      targetRole: sample.targetRole,
      experienceLevel: sample.experienceLevel as ExperienceLevel,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Multimodal ATS & Tech Career Evaluator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Elevate Your Resume for <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Top Tech Roles</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Upload your resume in PDF or DOCX format. Get instant ATS compatibility checks, role-specific skill gap analysis, and high-impact Google XYZ bullet point rewrites powered by Gemini AI.
        </p>
      </div>

      {/* Target Role Selector */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                1
              </span>
              Select Target Career Role
            </h2>
            <p className="text-xs text-slate-400">
              Analysis rubrics and missing skills are benchmarked directly against this discipline.
            </p>
          </div>

          {/* Experience Level Pill Selector */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-slate-950 p-1 border border-slate-800">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setExperienceLevel(lvl)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                  experienceLevel === lvl
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {roles.map(({ role, icon: Icon, description }) => {
            const isSelected = targetRole === role;
            return (
              <div
                key={role}
                onClick={() => setTargetRole(role)}
                className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : 'border-slate-800/80 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-950'
                }`}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {role}
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Methods Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                2
              </span>
              Provide Your Resume
            </h2>
            <p className="text-xs text-slate-400">
              Upload PDF or DOCX file, paste text, or try with pre-loaded demo profiles.
            </p>
          </div>

          {/* Method Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload Document</span>
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'paste'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ClipboardPaste className="h-3.5 w-3.5" />
              <span>Paste Text</span>
            </button>
            <button
              onClick={() => setActiveTab('samples')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'samples'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck className="h-3.5 w-3.5" />
              <span>Demo Profiles</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Upload File */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-500/10 scale-[0.99]'
                  : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-slate-700/80 bg-slate-950/40 hover:border-indigo-500/50 hover:bg-slate-950/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={handleFileInputChange}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-lg">
                    <FileText className="h-7 w-7" />
                  </div>
                  <span className="font-bold text-sm text-slate-100 mt-2">
                    {selectedFile.file.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {(selectedFile.file.size / 1024).toFixed(1)} KB • {selectedFile.type.toUpperCase()} Ready
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="mt-2 text-xs font-semibold text-rose-400 hover:text-rose-300 underline underline-offset-4"
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-md">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-bold text-base text-slate-200">
                      Drop your resume here or <span className="text-indigo-400 underline underline-offset-2">browse files</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports PDF (.pdf) and Microsoft Word (.docx) up to 20MB
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-1">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">.PDF</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">.DOCX</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">.TXT</span>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex justify-end">
              <button
                disabled={isLoading || !selectedFile}
                onClick={handleTriggerAnalysis}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-sm text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Analyze Resume with Gemini</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Paste Text */}
        {activeTab === 'paste' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Paste Plain Text Resume
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the complete text from your resume here (Contact info, Summary, Skills, Work Experience, Education, Projects)..."
                rows={10}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>Min. 30 characters</span>
                <span>{pastedText.length} characters</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                disabled={isLoading || pastedText.trim().length < 30}
                onClick={handleTriggerAnalysis}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-sm text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Analyze Pasted Resume</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Demo Profiles */}
        {activeTab === 'samples' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Click any realistic pre-configured resume below to instantly run a full diagnostic test:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SAMPLE_RESUMES.map((sample) => (
                <div
                  key={sample.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-100">{sample.name}</span>
                      <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                        {sample.targetRole}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {sample.description}
                    </p>
                  </div>
                  <button
                    disabled={isLoading}
                    onClick={() => handleLoadSample(sample)}
                    className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-lg border border-indigo-500/30 bg-indigo-600/10 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    <span>Load & Run Analysis</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error message alert */}
        {(localError || errorMessage) && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Error: </span>
              {localError || errorMessage}
            </div>
          </div>
        )}

        {/* Loading Spinner with Progressive Steps */}
        {isLoading && (
          <div className="rounded-2xl border border-indigo-500/30 bg-slate-950/90 p-8 text-center space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
              <div className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                Analyzing Resume with Gemini 3.8 Flash...
              </h3>
              <p className="text-xs text-indigo-400 font-mono mt-1 animate-pulse">
                {loadingStep}
              </p>
            </div>
            <div className="max-w-md mx-auto h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[pulse_1.5s_infinite]" />
            </div>
          </div>
        )}
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-4">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
            <Check className="h-4 w-4" />
            <span>Strict Truth Verification</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extracts verbatim credentials from your document with zero hallucinated companies or degrees.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-4">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs mb-1">
            <Check className="h-4 w-4" />
            <span>ATS Compatibility Audit</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Simulates Workday and Greenhouse parsers to identify heading and formatting pitfalls.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-4">
          <div className="flex items-center gap-2 text-pink-400 font-semibold text-xs mb-1">
            <Check className="h-4 w-4" />
            <span>Google XYZ Bullet Rewriter</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rewrites weak bullet points into high-impact, quantifiable achievement statements.
          </p>
        </div>
      </div>
    </div>
  );
};
