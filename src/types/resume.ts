export type TargetRole = 
  | 'AI/ML Engineer' 
  | 'Software Engineer' 
  | 'Data Scientist' 
  | 'Data Analyst';

export type ExperienceLevel = 
  | 'Entry-Level / Intern (0-2 yrs)'
  | 'Mid-Level (2-5 yrs)'
  | 'Senior Level (5+ yrs)';

export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface TechnicalSkills {
  languages: string[];
  frameworksAndLibraries: string[];
  cloudAndDevOps: string[];
  databases: string[];
  aiAndMlTools: string[];
  otherTools: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  graduationYear?: string;
  gpaOrHonors?: string;
  relevantCoursework?: string[];
}

export interface WorkExperienceItem {
  role: string;
  company: string;
  location?: string;
  duration?: string;
  isInternship: boolean;
  highlights: string[];
}

export interface ProjectItem {
  title: string;
  techStack: string[];
  description: string;
  url?: string;
  highlights: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date?: string;
}

export interface ExtractedResumeData {
  candidateName: string;
  contactInfo: ContactInfo;
  summary?: string;
  technicalSkills: TechnicalSkills;
  softSkills: string[];
  education: EducationItem[];
  workExperience: WorkExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  publicationsOrAwards: string[];
}

export interface ScoreBreakdown {
  impactAndMetrics: number; // 0-100
  atsCompatibility: number; // 0-100
  roleRelevance: number; // 0-100
  technicalDepth: number; // 0-100
  clarityAndStructure: number; // 0-100
}

export interface AtsChecklistItem {
  item: string;
  passed: boolean;
  note: string;
}

export interface FormattingIssue {
  issue: string;
  severity: 'High' | 'Medium' | 'Low';
  recommendation: string;
}

export interface AtsAudit {
  atsScore: number; // 0-100
  isAtsFriendly: boolean;
  summary: string;
  keyFindings: string[];
  formattingIssues: FormattingIssue[];
  checklist: AtsChecklistItem[];
}

export interface MissingSkill {
  skill: string;
  importance: 'Critical' | 'Important' | 'Nice to have';
  reason: string;
}

export interface TargetRoleAnalysis {
  targetRole: TargetRole;
  fitAssessment: 'Strong Fit' | 'Moderate Fit' | 'Developing Fit' | 'Gap Needs Bridging';
  matchScore: number; // 0-100
  matchingSkills: string[];
  missingOrWeakSkills: MissingSkill[];
  strengthsForRole: string[];
}

export interface BulletPointRewrite {
  originalText: string;
  improvedText: string;
  critique: string;
  frameworkUsed: string;
}

export interface WeakSection {
  sectionTitle: string;
  currentContentSnippet: string;
  issue: string;
  actionableFix: string;
  recommendationType: 'Remove' | 'Rewrite' | 'Restructure' | 'Clarify';
}

export interface SkillToLearn {
  skill: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  whyLearnIt: string;
  projectIdea: string;
  estimatedTimeToLearn: string;
}

export interface ImprovementSuggestion {
  category: 'Metrics & Impact' | 'Role Alignment' | 'ATS Formatting' | 'Projects & Portfolio' | 'Summary & Branding';
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  advice: string;
}

export interface ResumeAnalysisResult {
  overallScore: number; // 0-100
  overallSummary: string;
  scoreBreakdown: ScoreBreakdown;
  atsAudit: AtsAudit;
  extractedData: ExtractedResumeData;
  targetRoleAnalysis: TargetRoleAnalysis;
  bulletPointRewrites: BulletPointRewrite[];
  weakOrUnclearSections: WeakSection[];
  skillsToLearnNext: SkillToLearn[];
  tailoredImprovementSuggestions: ImprovementSuggestion[];
  analyzedAt: string;
  fileName: string;
}
