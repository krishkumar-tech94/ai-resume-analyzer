import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Support up to 25MB base64 uploads for PDF / DOCX
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Response JSON schema for resume analysis
const resumeResponseSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER, description: "Overall resume score 0 to 100 based on modern tech hiring criteria" },
    overallSummary: { type: Type.STRING, description: "2-3 concise sentences summarizing the candidate profile and fit" },
    scoreBreakdown: {
      type: Type.OBJECT,
      properties: {
        impactAndMetrics: { type: Type.INTEGER, description: "Score 0-100 evaluating quantified results, numbers, percentages, business impact" },
        atsCompatibility: { type: Type.INTEGER, description: "Score 0-100 on standard headers, parseable formatting, standard fonts, keywords" },
        roleRelevance: { type: Type.INTEGER, description: "Score 0-100 on alignment with the selected target career role" },
        technicalDepth: { type: Type.INTEGER, description: "Score 0-100 on technical rigor, complexity of stack, modern engineering practices" },
        clarityAndStructure: { type: Type.INTEGER, description: "Score 0-100 on readability, organization, section hierarchy, brevity" },
      },
      required: ["impactAndMetrics", "atsCompatibility", "roleRelevance", "technicalDepth", "clarityAndStructure"],
    },
    atsAudit: {
      type: Type.OBJECT,
      properties: {
        atsScore: { type: Type.INTEGER, description: "ATS compatibility score 0-100" },
        isAtsFriendly: { type: Type.BOOLEAN, description: "Whether the resume passes typical ATS screening filters" },
        summary: { type: Type.STRING, description: "Executive summary of ATS compliance" },
        keyFindings: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Top strengths and key red flags for ATS parseability",
        },
        formattingIssues: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              issue: { type: Type.STRING },
              severity: { type: Type.STRING, description: "High, Medium, or Low" },
              recommendation: { type: Type.STRING },
            },
            required: ["issue", "severity", "recommendation"],
          },
        },
        checklist: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              passed: { type: Type.BOOLEAN },
              note: { type: Type.STRING },
            },
            required: ["item", "passed", "note"],
          },
        },
      },
      required: ["atsScore", "isAtsFriendly", "summary", "keyFindings", "formattingIssues", "checklist"],
    },
    extractedData: {
      type: Type.OBJECT,
      description: "STRICT EXTRACTION: ONLY data present in the resume. DO NOT invent or assume any degree, company, or skill not explicitly mentioned.",
      properties: {
        candidateName: { type: Type.STRING, description: "Candidate name or 'Not specified'" },
        contactInfo: {
          type: Type.OBJECT,
          properties: {
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            github: { type: Type.STRING },
            portfolio: { type: Type.STRING },
          },
        },
        summary: { type: Type.STRING, description: "Professional summary or objective from the resume, or 'Not provided'" },
        technicalSkills: {
          type: Type.OBJECT,
          properties: {
            languages: { type: Type.ARRAY, items: { type: Type.STRING } },
            frameworksAndLibraries: { type: Type.ARRAY, items: { type: Type.STRING } },
            cloudAndDevOps: { type: Type.ARRAY, items: { type: Type.STRING } },
            databases: { type: Type.ARRAY, items: { type: Type.STRING } },
            aiAndMlTools: { type: Type.ARRAY, items: { type: Type.STRING } },
            otherTools: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["languages", "frameworksAndLibraries", "cloudAndDevOps", "databases", "aiAndMlTools", "otherTools"],
        },
        softSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Soft skills explicitly demonstrated or stated in the resume",
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              degree: { type: Type.STRING },
              institution: { type: Type.STRING },
              graduationYear: { type: Type.STRING },
              gpaOrHonors: { type: Type.STRING },
              relevantCoursework: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["degree", "institution"],
          },
        },
        workExperience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              duration: { type: Type.STRING },
              isInternship: { type: Type.BOOLEAN },
              highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["role", "company", "isInternship", "highlights"],
          },
        },
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
              description: { type: Type.STRING },
              url: { type: Type.STRING },
              highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["title", "techStack", "highlights"],
          },
        },
        certifications: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              issuer: { type: Type.STRING },
              date: { type: Type.STRING },
            },
            required: ["name", "issuer"],
          },
        },
        publicationsOrAwards: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["candidateName", "technicalSkills", "softSkills", "education", "workExperience", "projects", "certifications"],
    },
    targetRoleAnalysis: {
      type: Type.OBJECT,
      properties: {
        targetRole: { type: Type.STRING },
        fitAssessment: { type: Type.STRING, description: "Strong Fit, Moderate Fit, Developing Fit, or Gap Needs Bridging" },
        matchScore: { type: Type.INTEGER, description: "Role match score 0-100" },
        matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        missingOrWeakSkills: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              skill: { type: Type.STRING },
              importance: { type: Type.STRING, description: "Critical, Important, or Nice to have" },
              reason: { type: Type.STRING, description: "Why this skill is expected for the target role" },
            },
            required: ["skill", "importance", "reason"],
          },
        },
        strengthsForRole: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["targetRole", "fitAssessment", "matchScore", "matchingSkills", "missingOrWeakSkills", "strengthsForRole"],
    },
    bulletPointRewrites: {
      type: Type.ARRAY,
      description: "Take at least 3-5 weak, vague, or metric-less bullet points from the resume and rewrite them using Google XYZ Formula (Accomplished [X] as measured by [Y] by doing [Z]) with strong action verbs",
      items: {
        type: Type.OBJECT,
        properties: {
          originalText: { type: Type.STRING, description: "The exact or near-exact weak bullet point from the resume" },
          improvedText: { type: Type.STRING, description: "The high-impact rewritten bullet point" },
          critique: { type: Type.STRING, description: "Why the original was weak (e.g. passive voice, lacks numbers, vague responsibility)" },
          frameworkUsed: { type: Type.STRING, description: "e.g. Google XYZ Formula (Accomplished [X] as measured by [Y] by doing [Z])" },
        },
        required: ["originalText", "improvedText", "critique", "frameworkUsed"],
      },
    },
    weakOrUnclearSections: {
      type: Type.ARRAY,
      description: "Sections or lines that are redundant, unhelpful, outdated, or poorly structured",
      items: {
        type: Type.OBJECT,
        properties: {
          sectionTitle: { type: Type.STRING },
          currentContentSnippet: { type: Type.STRING },
          issue: { type: Type.STRING },
          actionableFix: { type: Type.STRING },
          recommendationType: { type: Type.STRING, description: "Remove, Rewrite, Restructure, or Clarify" },
        },
        required: ["sectionTitle", "issue", "actionableFix", "recommendationType"],
      },
    },
    skillsToLearnNext: {
      type: Type.ARRAY,
      description: "Recommended high-demand skills to learn to accelerate career in the target role",
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          category: { type: Type.STRING },
          priority: { type: Type.STRING, description: "High, Medium, or Low" },
          whyLearnIt: { type: Type.STRING },
          projectIdea: { type: Type.STRING, description: "A concrete project idea demonstrating this skill" },
          estimatedTimeToLearn: { type: Type.STRING, description: "e.g. 2-4 weeks" },
        },
        required: ["skill", "category", "priority", "whyLearnIt", "projectIdea", "estimatedTimeToLearn"],
      },
    },
    tailoredImprovementSuggestions: {
      type: Type.ARRAY,
      description: "Strategic advice to improve overall competitiveness",
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Metrics & Impact, Role Alignment, ATS Formatting, Projects & Portfolio, or Summary & Branding" },
          priority: { type: Type.STRING, description: "High, Medium, or Low" },
          title: { type: Type.STRING },
          advice: { type: Type.STRING },
        },
        required: ["category", "priority", "title", "advice"],
      },
    },
  },
  required: [
    "overallScore",
    "overallSummary",
    "scoreBreakdown",
    "atsAudit",
    "extractedData",
    "targetRoleAnalysis",
    "bulletPointRewrites",
    "weakOrUnclearSections",
    "skillsToLearnNext",
    "tailoredImprovementSuggestions",
  ],
};

// Resume Analysis Endpoint
app.post('/api/analyze-resume', async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileType, fileData, fileName, targetRole = 'Software Engineer', experienceLevel = 'Entry-Level / Intern (0-2 yrs)' } = req.body;

    if (!fileData || typeof fileData !== 'string') {
      res.status(400).json({ error: 'No resume file data or text was provided.' });
      return;
    }

    if (!apiKey) {
      res.status(500).json({ error: 'Server configuration error: GEMINI_API_KEY is not configured.' });
      return;
    }

    let parts: any[] = [];

    if (fileType === 'docx') {
      // Decode base64 to Buffer and extract raw text via mammoth
      try {
        const cleanBase64 = fileData.replace(/^data:.*?;base64,/, '');
        const buffer = Buffer.from(cleanBase64, 'base64');
        const extraction = await mammoth.extractRawText({ buffer });
        const text = extraction.value.trim();

        if (!text || text.length < 20) {
          res.status(400).json({
            error: 'Could not extract readable text from the DOCX file. The document may be empty or contain non-text elements only.'
          });
          return;
        }

        parts.push({
          text: `Extracted Document Content (DOCX):\n\n${text}`
        });
      } catch (docErr: any) {
        res.status(400).json({
          error: `Failed to process DOCX file: ${docErr.message || 'Corrupted or unsupported format'}`
        });
        return;
      }
    } else if (fileType === 'pdf') {
      // Use native PDF support in Gemini 3.8 Flash
      const cleanBase64 = fileData.replace(/^data:.*?;base64,/, '');
      if (!cleanBase64 || cleanBase64.length < 100) {
        res.status(400).json({ error: 'The uploaded PDF file is empty or corrupted.' });
        return;
      }

      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: cleanBase64,
        }
      });
    } else {
      // Plain text resume
      const text = fileData.trim();
      if (text.length < 25) {
        res.status(400).json({ error: 'The resume text is too short. Please provide a complete resume with your background, skills, and experience.' });
        return;
      }
      parts.push({
        text: `Resume Text Content:\n\n${text}`
      });
    }

    const promptText = `
You are an elite Silicon Valley Principal Staff Engineer and Lead Technical Hiring Manager specializing in AI/ML Engineering, Software Engineering, Data Science, and Data Analytics. You are also an authority on Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo, Ashby).

Evaluate the attached resume document thoroughly for the Target Role: "${targetRole}" and Experience Level: "${experienceLevel}".

CRITICAL INSTRUCTIONS:
1. STRICT TRUTH PRESERVATION (DO NOT INVENT):
   - In "extractedData", extract ONLY what is explicitly stated in the resume document.
   - Do NOT invent companies, universities, degrees, dates, tools, or certifications that are not present.
   - If contact details (email, phone, LinkedIn, GitHub) or summary are missing from the resume, leave them blank or state "Not provided".
   - Keep a clear, absolute distinction between extracted facts from the candidate's resume vs your analytical recommendations.

2. TARGET ROLE ANALYSIS FOR "${targetRole}":
   - Compare the candidate's verified skills and project achievements against industry standards for "${targetRole}".
   - Identify concrete missing or weak skills (e.g., for AI/ML: PyTorch, model evaluation, MLOps, vector DBs; for SWE: system design, concurrency, testing, CI/CD, data structures; for Data Science: experimentation/AB testing, statistics, feature engineering).
   - Rate the overall fit realistically.

3. ATS AUDIT & CHECKLIST:
   - Check standard section headers ("Education", "Experience", "Skills", "Projects").
   - Check for parseable contact details, single-column vs multi-column risk, date formats, bullet formatting.
   - Evaluate whether bullet points start with strong action verbs and contain measurable outcomes (Google XYZ formula).

4. ACTIONABLE BULLET REWRITES:
   - Identify at least 3-5 weak, passive, or metric-less bullet points from the resume.
   - Rewrite them using the Google XYZ Formula: "Accomplished [X] as measured by [Y] by doing [Z]".
   - Explain the specific critique for each.

5. WEAK & UNCLEAR SECTIONS:
   - Point out obsolete elements (e.g., generic objectives, reference statements, high school info, buzzword lists without context).

6. SKILLS TO LEARN NEXT:
   - Provide a targeted list of 3-5 high-value skills to bridge the gap toward the target role, complete with practical project ideas.

Return the complete analysis strictly formatted as a JSON object matching the defined schema.
`;

    parts.push({ text: promptText });

    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: any = null;
    let responseText: string | undefined;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Calling Gemini API with model: ${modelName}...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts,
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: resumeResponseSchema,
            temperature: 0.2, // Low temperature for high factual accuracy and consistency
          },
        });

        responseText = response.text;
        if (responseText) {
          break; // Successfully got response!
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} encountered error:`, err.message || err);
        lastError = err;
        // Wait 1 second before trying next model
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!responseText) {
      const errDetail = lastError?.message || 'Gemini models are experiencing high demand. Please try again in a few moments.';
      throw new Error(errDetail);
    }

    const parsedData = JSON.parse(responseText);

    res.json({
      ...parsedData,
      analyzedAt: new Date().toISOString(),
      fileName: fileName || (fileType === 'text' ? 'Pasted_Resume.txt' : `Uploaded_Resume.${fileType}`),
    });
  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze resume. Please check the document and try again.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Resume Analyzer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
