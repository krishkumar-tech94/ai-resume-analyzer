import React, { useState } from 'react';
import { 
  ResumeAnalysisResult, 
  BulletPointRewrite, 
  MissingSkill, 
  SkillToLearn 
} from '../types/resume';
import { ScoreGauge } from './ScoreGauge';
import { exportAnalysisToPdf, exportAnalysisToMarkdown, copySummaryToClipboard } from '../utils/exportUtils';
import { 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Check, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Award, 
  ShieldCheck, 
  Target, 
  PenTool, 
  BookOpen, 
  Lightbulb, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: ResumeAnalysisResult;
  onReset: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis, onReset }) => {
  const [activeTab, setActiveTab] = useState<'extracted' | 'role' | 'ats' | 'rewrites' | 'learn' | 'suggestions'>('role');
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const handleCopyRewrite = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2500);
  };

  const handleCopySummary = async () => {
    const success = await copySummaryToClipboard(analysis);
    if (success) {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  const handleDownloadPdf = () => {
    setIsExportingPdf(true);
    try {
      exportAnalysisToPdf(analysis);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const candidateName = analysis.extractedData.candidateName || 'Candidate';
  const role = analysis.targetRoleAnalysis.targetRole;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              {role}
            </span>
            <span className="text-xs text-slate-400">
              Analyzed {new Date(analysis.analyzedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
            Analysis Report: <span className="text-indigo-400">{candidateName}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            File: {analysis.fileName}
          </p>
        </div>

        {/* Export and Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all disabled:opacity-50"
            title="Download full PDF Report"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isExportingPdf ? 'Exporting...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={() => exportAnalysisToMarkdown(analysis)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all"
            title="Download Markdown summary"
          >
            <FileText className="h-3.5 w-3.5 text-indigo-400" />
            <span>Export .MD</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all"
            title="Copy summary to clipboard"
          >
            {copiedSummary ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={onReset}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
          >
            Analyze Another
          </button>
        </div>
      </div>

      {/* Hero Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Overall Score Card (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm flex flex-col items-center justify-center text-center">
          <ScoreGauge 
            score={analysis.overallScore} 
            size="lg" 
            label="Overall Resume Score" 
            sublabel="Tech recruiter & ATS benchmark"
          />

          <div className="mt-6 w-full pt-4 border-t border-slate-800/80 flex items-center justify-around">
            <div className="text-center">
              <span className="text-[11px] uppercase font-bold text-slate-400">ATS Rating</span>
              <div className="mt-1 flex items-center justify-center gap-1">
                {analysis.atsAudit.isAtsFriendly ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Passed ({analysis.atsAudit.atsScore}%)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Review ({analysis.atsAudit.atsScore}%)
                  </span>
                )}
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800" />

            <div className="text-center">
              <span className="text-[11px] uppercase font-bold text-slate-400">Role Fit</span>
              <div className="mt-1 font-bold text-xs text-indigo-400">
                {analysis.targetRoleAnalysis.fitAssessment}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary & 5-Dimension Breakdown (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h2 className="font-bold text-sm text-slate-200">
                Executive Evaluation
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {analysis.overallSummary}
            </p>
          </div>

          {/* 5-Dimension Progress Bars */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Core Competency Dimensions
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {/* 1. Impact & Metrics */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Impact & Metrics (Google XYZ)</span>
                  <span className="font-mono font-bold text-indigo-400">{analysis.scoreBreakdown.impactAndMetrics}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${analysis.scoreBreakdown.impactAndMetrics}%` }}
                  />
                </div>
              </div>

              {/* 2. ATS Compatibility */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">ATS Compatibility & Headings</span>
                  <span className="font-mono font-bold text-emerald-400">{analysis.scoreBreakdown.atsCompatibility}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${analysis.scoreBreakdown.atsCompatibility}%` }}
                  />
                </div>
              </div>

              {/* 3. Role Relevance */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Target Role Alignment</span>
                  <span className="font-mono font-bold text-purple-400">{analysis.scoreBreakdown.roleRelevance}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${analysis.scoreBreakdown.roleRelevance}%` }}
                  />
                </div>
              </div>

              {/* 4. Technical Depth */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Technical Depth & Modern Stack</span>
                  <span className="font-mono font-bold text-pink-400">{analysis.scoreBreakdown.technicalDepth}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-pink-500 rounded-full transition-all duration-1000"
                    style={{ width: `${analysis.scoreBreakdown.technicalDepth}%` }}
                  />
                </div>
              </div>

              {/* 5. Clarity & Structure */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Clarity, Structure & Brevity</span>
                  <span className="font-mono font-bold text-amber-400">{analysis.scoreBreakdown.clarityAndStructure}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                    style={{ width: `${analysis.scoreBreakdown.clarityAndStructure}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Distinct Section Tabs */}
      <div className="space-y-6">
        
        {/* Tab Controls Bar */}
        <div className="flex overflow-x-auto pb-2 scrollbar-none gap-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('role')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'role'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Target className="h-4 w-4" />
            <span>Target Role & Skill Gaps</span>
            <span className="rounded bg-black/20 px-1.5 py-0.2 text-[10px]">
              {analysis.targetRoleAnalysis.missingOrWeakSkills.length} Gaps
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rewrites')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'rewrites'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <PenTool className="h-4 w-4" />
            <span>Bullet Point Rewrites</span>
            <span className="rounded bg-black/20 px-1.5 py-0.2 text-[10px]">
              {analysis.bulletPointRewrites.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ats')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'ats'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>ATS Audit & Checklist</span>
            <span className={`rounded px-1.5 py-0.2 text-[10px] ${analysis.atsAudit.isAtsFriendly ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
              {analysis.atsAudit.atsScore}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'learn'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Skills to Learn Next</span>
            <span className="rounded bg-black/20 px-1.5 py-0.2 text-[10px]">
              {analysis.skillsToLearnNext.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('extracted')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'extracted'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Extracted Profile (Truth)</span>
          </button>

          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'suggestions'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            <span>Strategic Advice</span>
          </button>
        </div>

        {/* TAB 1: Target Role & Skill Gaps */}
        {activeTab === 'role' && (
          <div className="space-y-6">
            
            {/* Role Header Card */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
                  <Target className="h-4 w-4" />
                  <span>Target Role Benchmark: {role}</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Fit Assessment: <span className="text-indigo-400">{analysis.targetRoleAnalysis.fitAssessment}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Evaluated against requirements for modern {role} positions, including technical depth, architectural ownership, and tooling mastery.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Match Score</span>
                  <div className="font-extrabold text-2xl text-indigo-400">
                    {analysis.targetRoleAnalysis.matchScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Missing Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Strengths For Role */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <h4 className="font-bold text-sm text-slate-200">
                    Demonstrated Strengths for {role}
                  </h4>
                </div>
                <div className="space-y-2.5">
                  {analysis.targetRoleAnalysis.strengthsForRole.map((strength, idx) => (
                    <div 
                      key={idx}
                      className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-2">
                    Matching Skills Detected in Resume:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.targetRoleAnalysis.matchingSkills.map((sk, idx) => (
                      <span 
                        key={idx}
                        className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Missing or Weak Skills */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="h-5 w-5" />
                  <h4 className="font-bold text-sm text-slate-200">
                    Missing or Weak Skills for {role}
                  </h4>
                </div>

                <div className="space-y-3">
                  {analysis.targetRoleAnalysis.missingOrWeakSkills.map((mSkill, idx) => {
                    const badgeColor = 
                      mSkill.importance === 'Critical' 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                        : mSkill.importance === 'Important'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30';

                    return (
                      <div 
                        key={idx}
                        className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-slate-100">
                            {mSkill.skill}
                          </span>
                          <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${badgeColor}`}>
                            {mSkill.importance}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {mSkill.reason}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: Bullet Point Rewrites */}
        {activeTab === 'rewrites' && (
          <div className="space-y-6">
            
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
                  <PenTool className="h-4 w-4" />
                  <span>Google X-Y-Z Achievement Optimization</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  High-Impact Bullet Point Rewrites
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Transform passive task descriptions into measurable accomplishments: <span className="font-semibold text-indigo-300">Accomplished [X] as measured by [Y] by doing [Z]</span>.
                </p>
              </div>
            </div>

            {/* Bullet Point Cards */}
            <div className="space-y-4">
              {analysis.bulletPointRewrites.map((rewrite, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 transition-all hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-300">
                      Bullet #{idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-indigo-400">
                      {rewrite.frameworkUsed}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Before (Weak) */}
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Original Weak Bullet</span>
                      </div>
                      <p className="text-xs text-slate-300 italic font-mono leading-relaxed">
                        "{rewrite.originalText}"
                      </p>
                      <div className="pt-2 border-t border-rose-500/20 text-[11px] text-rose-300/80">
                        <span className="font-semibold text-rose-300">Why it's weak: </span>
                        {rewrite.critique}
                      </div>
                    </div>

                    {/* After (Improved) */}
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>High-Impact Rewrite</span>
                          </div>
                          <button
                            onClick={() => handleCopyRewrite(rewrite.improvedText, idx)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            {copiedBulletIdx === idx ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-emerald-200 leading-relaxed">
                          "{rewrite.improvedText}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-400/80">
                        <span className="font-semibold">Format: </span>
                        Strong action verb + Context + Quantifiable outcome.
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Unnecessary or Weak Sections */}
            {analysis.weakOrUnclearSections.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  <h4 className="font-bold text-sm text-slate-200">
                    Unnecessary, Unclear, or Weak Sections to Prune
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.weakOrUnclearSections.map((sec, idx) => (
                    <div 
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-200">
                          {sec.sectionTitle}
                        </span>
                        <span className="rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold">
                          {sec.recommendationType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Issue: </span>
                        {sec.issue}
                      </p>
                      <p className="text-xs text-indigo-300 font-medium pt-1 border-t border-slate-800">
                        <span className="font-semibold">Action: </span>
                        {sec.actionableFix}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: ATS Audit & Checklist */}
        {activeTab === 'ats' && (
          <div className="space-y-6">
            
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Applicant Tracking System Verification</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  ATS Compatibility: <span className={analysis.atsAudit.isAtsFriendly ? 'text-emerald-400' : 'text-amber-400'}>{analysis.atsAudit.atsScore}%</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  {analysis.atsAudit.summary}
                </p>
              </div>

              <div className={`px-4 py-2 rounded-xl border font-bold text-xs flex items-center gap-2 ${
                analysis.atsAudit.isAtsFriendly 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
              }`}>
                {analysis.atsAudit.isAtsFriendly ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>ATS Friendly</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    <span>Requires Adjustments</span>
                  </>
                )}
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <h4 className="font-bold text-sm text-slate-200">
                Automated ATS Inspection Checklist
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.atsAudit.checklist.map((check, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border p-3.5 flex items-start gap-3 transition-colors ${
                      check.passed
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-amber-500/20 bg-amber-500/5'
                    }`}
                  >
                    {check.passed ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-slate-200 block">
                        {check.item}
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {check.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formatting Issues */}
            {analysis.atsAudit.formattingIssues.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <h4 className="font-bold text-sm text-slate-200">
                  Formatting Recommendations & Fixes
                </h4>
                <div className="space-y-3">
                  {analysis.atsAudit.formattingIssues.map((issue, idx) => (
                    <div 
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-200">
                            {issue.issue}
                          </span>
                          <span className={`rounded px-2 py-0.2 text-[10px] font-bold border ${
                            issue.severity === 'High'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-xs text-indigo-300 font-medium">
                          Fix: {issue.recommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: Skills to Learn Next */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Continuous Career Growth</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Skills to Learn Next for {role}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Strategic technologies and concepts to acquire to bridge skill gaps and stand out for competitive opportunities.
                </p>
              </div>
            </div>

            {/* Skills Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.skillsToLearnNext.map((skill, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-semibold">
                        {skill.category}
                      </span>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                        skill.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {skill.priority} Priority
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-100">
                      {skill.skill}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {skill.whyLearnIt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                        Recommended Portfolio Project:
                      </span>
                      <p className="text-slate-300 leading-relaxed font-medium">
                        {skill.projectIdea}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>Est. Mastery Time:</span>
                      <span className="font-mono font-bold text-slate-200">{skill.estimatedTimeToLearn}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 5: Extracted Profile (Facts Only) */}
        {activeTab === 'extracted' && (
          <div className="space-y-6">
            
            {/* Disclaimer Banner */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <span className="font-bold block text-sm text-emerald-200">
                  Strict Truth Verification — Grounded In Your Document
                </span>
                <p className="mt-0.5 text-emerald-300/90 leading-relaxed">
                  The data below represents verified factual items extracted directly from your resume. No phantom companies, degrees, or unearned tools have been added by AI.
                </p>
              </div>
            </div>

            {/* Candidate Overview Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {analysis.extractedData.candidateName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {analysis.extractedData.summary || 'No professional summary provided.'}
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs text-slate-300 pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Email</span>
                  <span className="truncate block font-mono text-[11px]">{analysis.extractedData.contactInfo.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Phone</span>
                  <span className="truncate block font-mono text-[11px]">{analysis.extractedData.contactInfo.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Location</span>
                  <span className="truncate block text-[11px]">{analysis.extractedData.contactInfo.location || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">LinkedIn</span>
                  <span className="truncate block text-[11px]">{analysis.extractedData.contactInfo.linkedin || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">GitHub</span>
                  <span className="truncate block text-[11px]">{analysis.extractedData.contactInfo.github || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Portfolio</span>
                  <span className="truncate block text-[11px]">{analysis.extractedData.contactInfo.portfolio || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Technical & Soft Skills Grid */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" />
                <span>Extracted Technical & Soft Skills</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                
                {/* Languages */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    Programming Languages
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.extractedData.technicalSkills.languages.length > 0 ? (
                      analysis.extractedData.technicalSkills.languages.map((l, i) => (
                        <span key={i} className="rounded bg-indigo-500/10 text-indigo-300 px-2 py-0.5 font-mono text-[11px]">
                          {l}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs italic">None detected</span>
                    )}
                  </div>
                </div>

                {/* Frameworks */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    Frameworks & Libraries
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.extractedData.technicalSkills.frameworksAndLibraries.length > 0 ? (
                      analysis.extractedData.technicalSkills.frameworksAndLibraries.map((f, i) => (
                        <span key={i} className="rounded bg-purple-500/10 text-purple-300 px-2 py-0.5 font-mono text-[11px]">
                          {f}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs italic">None detected</span>
                    )}
                  </div>
                </div>

                {/* AI / ML Tools */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    AI / ML & Data Tools
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.extractedData.technicalSkills.aiAndMlTools.length > 0 ? (
                      analysis.extractedData.technicalSkills.aiAndMlTools.map((a, i) => (
                        <span key={i} className="rounded bg-pink-500/10 text-pink-300 px-2 py-0.5 font-mono text-[11px]">
                          {a}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs italic">None detected</span>
                    )}
                  </div>
                </div>

                {/* Cloud & DevOps */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    Cloud & DevOps
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.extractedData.technicalSkills.cloudAndDevOps.length > 0 ? (
                      analysis.extractedData.technicalSkills.cloudAndDevOps.map((c, i) => (
                        <span key={i} className="rounded bg-sky-500/10 text-sky-300 px-2 py-0.5 font-mono text-[11px]">
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs italic">None detected</span>
                    )}
                  </div>
                </div>

                {/* Databases */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    Databases & Storage
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.extractedData.technicalSkills.databases.length > 0 ? (
                      analysis.extractedData.technicalSkills.databases.map((d, i) => (
                        <span key={i} className="rounded bg-emerald-500/10 text-emerald-300 px-2 py-0.5 font-mono text-[11px]">
                          {d}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs italic">None detected</span>
                    )}
                  </div>
                </div>

                {/* Soft Skills */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    Demonstrated Soft Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.extractedData.softSkills.length > 0 ? (
                      analysis.extractedData.softSkills.map((s, i) => (
                        <span key={i} className="rounded bg-amber-500/10 text-amber-300 px-2 py-0.5 text-[11px]">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs italic">None stated</span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Work Experience */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-400" />
                <span>Work & Internship Experience</span>
              </h4>

              {analysis.extractedData.workExperience.length > 0 ? (
                <div className="space-y-4">
                  {analysis.extractedData.workExperience.map((exp, idx) => (
                    <div 
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <span className="font-bold text-sm text-white">{exp.role}</span>
                          <span className="text-xs text-indigo-400 font-semibold ml-2">@ {exp.company}</span>
                          {exp.isInternship && (
                            <span className="ml-2 rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
                              Internship
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {exp.duration} {exp.location ? `• ${exp.location}` : ''}
                        </span>
                      </div>

                      <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pt-1">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="leading-relaxed">
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No professional work experience listed in resume.</p>
              )}
            </div>

            {/* Education & Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Education */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-400" />
                  <span>Education</span>
                </h4>
                {analysis.extractedData.education.map((edu, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1 text-xs">
                    <span className="font-bold text-slate-200 text-sm block">{edu.degree}</span>
                    <span className="text-indigo-400 font-semibold block">{edu.institution}</span>
                    <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                      <span>{edu.graduationYear ? `Class of ${edu.graduationYear}` : ''}</span>
                      <span>{edu.gpaOrHonors}</span>
                    </div>
                    {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                      <p className="text-[11px] text-slate-400 pt-1">
                        <span className="font-semibold text-slate-300">Coursework: </span>
                        {edu.relevantCoursework.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Projects & Certifications */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-indigo-400" />
                  <span>Projects & Certifications</span>
                </h4>

                <div className="space-y-3">
                  {analysis.extractedData.projects.map((proj, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{proj.title}</span>
                        {proj.url && (
                          <span className="text-indigo-400 text-[11px] truncate max-w-[150px]">{proj.url}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {proj.techStack.map((t, i) => (
                          <span key={i} className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {analysis.extractedData.certifications.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold uppercase text-slate-400">Certifications:</span>
                      {analysis.extractedData.certifications.map((c, i) => (
                        <div key={i} className="text-xs text-slate-300 flex justify-between">
                          <span>• {c.name} ({c.issuer})</span>
                          <span className="text-slate-500 font-mono text-[11px]">{c.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 6: Strategic Advice */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-indigo-400" />
                <span>Tailored Career Improvement Roadmap</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Strategic recommendations to maximize your interview conversion rate for {role} positions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.tailoredImprovementSuggestions.map((sug, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold">
                      {sug.category}
                    </span>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                      sug.priority === 'High'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {sug.priority} Priority
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-100">
                    {sug.title}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {sug.advice}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
