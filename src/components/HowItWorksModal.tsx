import React from 'react';
import { X, FileSearch, ShieldCheck, Target, PenTool, Lightbulb, Bot } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: FileSearch,
      title: '1. Multimodal Document Ingestion',
      badge: 'PDF / DOCX / TXT',
      desc: 'PDFs are processed using Gemini 3.8 Flash’s native document understanding, retaining spatial orientation, tables, multi-column layouts, and font hierarchies. DOCX files are unpacked into clean text structures via node-mammoth, ensuring zero data loss.'
    },
    {
      icon: Bot,
      title: '2. Zero-Hallucination Fact Extraction',
      badge: 'Truth Verification',
      desc: 'The parser applies a strict boundary between what is factually printed on the resume versus what is recommended. Experience dates, degrees, institutions, and declared skills are extracted without fabricating unearned credentials.'
    },
    {
      icon: ShieldCheck,
      title: '3. ATS (Applicant Tracking System) Audit',
      badge: 'Workday & Greenhouse Rules',
      desc: 'Tests against modern ATS parsing engines. Checks for standardized headings (Education, Experience, Skills), standard date formats, parseable contact metadata, and absence of design artifacts that cause automated rejection.'
    },
    {
      icon: Target,
      title: '4. Role-Specific Benchmarking',
      badge: 'AI/ML & SWE Roles',
      desc: 'Analyzes your background against actual tech industry standards for AI/ML Engineer, Data Scientist, Software Engineer, or Data Analyst. Flags missing critical competencies (e.g. MLOps, CI/CD, Vector DBs, System Design).'
    },
    {
      icon: PenTool,
      title: '5. Google X-Y-Z Bullet Point Rewriting',
      badge: 'Impact Optimization',
      desc: 'Identifies passive or vague bullet points and transforms them using the formula: "Accomplished [X] as measured by [Y] by doing [Z]". Demonstrates measurable engineering impact rather than a passive list of job chores.'
    },
    {
      icon: Lightbulb,
      title: '6. Skills Gap & Project Roadmap',
      badge: 'Actionable Growth',
      desc: 'Generates a prioritized "Skills to Learn Next" guide tailored to your chosen target role, including realistic hands-on project ideas to bolster your GitHub portfolio.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-slate-100 shadow-2xl shadow-indigo-950/50"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            System Architecture & Methodology
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            How This AI Resume Analyzer Works
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            A look into the pipeline combining Gemini 3.8 Flash, strict ATS heuristics, and tech hiring manager rubrics.
          </p>
        </div>

        {/* Steps List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-950/90"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-200">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                    {step.badge}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-950/30 p-4 text-xs text-indigo-200">
          <p className="font-semibold text-indigo-300 mb-1">
            Privacy & Non-Fabrication Guarantee:
          </p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Your resume content is analyzed securely and transiently for this session. We never train public models on your uploaded files. All extracted profile fields represent pure ground-truth found in your submitted document.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
          >
            Got it, let’s analyze
          </button>
        </div>
      </div>
    </div>
  );
};
