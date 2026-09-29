import { jsPDF } from 'jspdf';
import { ResumeAnalysisResult } from '../types/resume';

/**
 * Exports the comprehensive resume analysis to a formatted PDF
 */
export function exportAnalysisToPdf(analysis: ResumeAnalysisResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Resume Analysis & ATS Report', margin, 16);

  // Subtitle / Candidate info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  const candidate = analysis.extractedData.candidateName || 'Candidate';
  const role = analysis.targetRoleAnalysis.targetRole;
  doc.text(`Candidate: ${candidate}  |  Target Role: ${role}  |  Analyzed: ${new Date(analysis.analyzedAt).toLocaleDateString()}`, margin, 24);

  // Score banner inside header
  doc.setFontSize(11);
  doc.setTextColor(99, 102, 241); // indigo-400
  doc.setFont('helvetica', 'bold');
  doc.text(`Overall Score: ${analysis.overallScore}/100    ATS Compatibility: ${analysis.atsAudit.atsScore}/100`, margin, 32);

  y = 46;

  // Executive Summary Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Evaluation Summary', margin, y);
  y += 6;

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const summaryLines = doc.splitTextToSize(analysis.overallSummary, pageWidth - 2 * margin);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.5 + 4;

  // Score Breakdown
  checkPageBreak(30);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('2. Score Breakdown', margin, y);
  y += 6;

  const breakdown = [
    `Impact & Measurable Metrics: ${analysis.scoreBreakdown.impactAndMetrics}/100`,
    `ATS Compatibility & Parsing: ${analysis.scoreBreakdown.atsCompatibility}/100`,
    `Target Role Alignment: ${analysis.scoreBreakdown.roleRelevance}/100`,
    `Technical Depth & Engineering Rigor: ${analysis.scoreBreakdown.technicalDepth}/100`,
    `Clarity, Brevity & Structure: ${analysis.scoreBreakdown.clarityAndStructure}/100`,
  ];

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  breakdown.forEach((item) => {
    doc.text(`• ${item}`, margin + 4, y);
    y += 5;
  });
  y += 4;

  // Target Role & Skill Gap Analysis
  checkPageBreak(40);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`3. Target Role Alignment: ${analysis.targetRoleAnalysis.targetRole}`, margin, y);
  y += 6;

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // emerald
  doc.text(`Role Fit: ${analysis.targetRoleAnalysis.fitAssessment} (Match Score: ${analysis.targetRoleAnalysis.matchScore}/100)`, margin + 4, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  if (analysis.targetRoleAnalysis.missingOrWeakSkills.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(225, 29, 72); // rose
    doc.text('Missing or Weak Skills Identified for this Role:', margin + 4, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    analysis.targetRoleAnalysis.missingOrWeakSkills.forEach((item) => {
      checkPageBreak(12);
      const text = `• [${item.importance}] ${item.skill}: ${item.reason}`;
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin - 6);
      doc.text(lines, margin + 6, y);
      y += lines.length * 4.5;
    });
    y += 3;
  }

  // ATS Audit
  checkPageBreak(40);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('4. ATS (Applicant Tracking System) Audit', margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  analysis.atsAudit.checklist.forEach((check) => {
    checkPageBreak(8);
    const symbol = check.passed ? '[PASS]' : '[FAIL]';
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(check.passed ? 16 : 225, check.passed ? 185 : 29, check.passed ? 129 : 72);
    doc.text(symbol, margin + 4, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const line = `  ${check.item} — ${check.note}`;
    const splitted = doc.splitTextToSize(line, pageWidth - 2 * margin - 18);
    doc.text(splitted, margin + 18, y);
    y += splitted.length * 4.5;
  });
  y += 4;

  // Bullet Point Rewrites
  if (analysis.bulletPointRewrites.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('5. Bullet Point Rewrites (Google XYZ Formula)', margin, y);
    y += 6;

    analysis.bulletPointRewrites.forEach((rw, idx) => {
      checkPageBreak(30);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(225, 29, 72); // rose
      doc.text(`Weak Bullet #${idx + 1}:`, margin + 4, y);
      y += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const origLines = doc.splitTextToSize(`"${rw.originalText}"`, pageWidth - 2 * margin - 8);
      doc.text(origLines, margin + 6, y);
      y += origLines.length * 4.5 + 2;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129); // emerald
      doc.text('Improved Rewrite:', margin + 4, y);
      y += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const impLines = doc.splitTextToSize(`"${rw.improvedText}"`, pageWidth - 2 * margin - 8);
      doc.text(impLines, margin + 6, y);
      y += impLines.length * 4.5 + 4;
    });
  }

  // Skills to Learn Next
  if (analysis.skillsToLearnNext.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('6. Recommended Skills to Learn Next', margin, y);
    y += 6;

    analysis.skillsToLearnNext.forEach((skill) => {
      checkPageBreak(15);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(79, 70, 229); // indigo
      doc.text(`• ${skill.skill} (${skill.category}) [Priority: ${skill.priority}, Est: ${skill.estimatedTimeToLearn}]`, margin + 4, y);
      y += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const whyLines = doc.splitTextToSize(`Why: ${skill.whyLearnIt}`, pageWidth - 2 * margin - 8);
      doc.text(whyLines, margin + 6, y);
      y += whyLines.length * 4.2;

      const projLines = doc.splitTextToSize(`Project Idea: ${skill.projectIdea}`, pageWidth - 2 * margin - 8);
      doc.text(projLines, margin + 6, y);
      y += projLines.length * 4.2 + 3;
    });
  }

  // Save the PDF
  const safeName = (analysis.extractedData.candidateName || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${safeName}_AI_Resume_Analysis.pdf`);
}

/**
 * Exports the analysis as clean Markdown
 */
export function exportAnalysisToMarkdown(analysis: ResumeAnalysisResult) {
  const candidate = analysis.extractedData.candidateName || 'Candidate';
  const role = analysis.targetRoleAnalysis.targetRole;

  const content = `# AI Resume Analysis & ATS Report
**Candidate:** ${candidate}  
**Target Role:** ${role}  
**Analyzed Date:** ${new Date(analysis.analyzedAt).toLocaleDateString()}  
**Overall Score:** ${analysis.overallScore}/100  
**ATS Compatibility:** ${analysis.atsAudit.atsScore}/100 (${analysis.atsAudit.isAtsFriendly ? 'ATS Friendly' : 'Attention Needed'})

---

## 1. Executive Summary
${analysis.overallSummary}

---

## 2. Score Breakdown
- **Impact & Metrics:** ${analysis.scoreBreakdown.impactAndMetrics}/100
- **ATS Compatibility:** ${analysis.scoreBreakdown.atsCompatibility}/100
- **Target Role Alignment:** ${analysis.scoreBreakdown.roleRelevance}/100
- **Technical Depth:** ${analysis.scoreBreakdown.technicalDepth}/100
- **Clarity & Structure:** ${analysis.scoreBreakdown.clarityAndStructure}/100

---

## 3. Target Role Fit (${role})
- **Assessment:** ${analysis.targetRoleAnalysis.fitAssessment}
- **Match Score:** ${analysis.targetRoleAnalysis.matchScore}/100

### Strengths for this Role:
${analysis.targetRoleAnalysis.strengthsForRole.map((s) => `- ${s}`).join('\n')}

### Missing or Weak Skills:
${analysis.targetRoleAnalysis.missingOrWeakSkills
  .map((m) => `- **[${m.importance}] ${m.skill}**: ${m.reason}`)
  .join('\n')}

---

## 4. ATS Checklist Audit
${analysis.atsAudit.checklist
  .map((c) => `- [${c.passed ? 'x' : ' '}] **${c.item}**: ${c.note}`)
  .join('\n')}

### Formatting Recommendations:
${analysis.atsAudit.formattingIssues
  .map((f) => `- **[${f.severity}] ${f.issue}**: ${f.recommendation}`)
  .join('\n')}

---

## 5. Bullet Point Rewrites (Google XYZ Formula)
${analysis.bulletPointRewrites
  .map(
    (b, i) => `### Bullet #${i + 1}
**Original:** *"${b.originalText}"*  
**Critique:** ${b.critique}  
**Improved:** **"${b.improvedText}"**  
**Framework:** ${b.frameworkUsed}
`
  )
  .join('\n\n')}

---

## 6. Skills to Learn Next
${analysis.skillsToLearnNext
  .map(
    (s) => `### ${s.skill} (${s.category}) — Priority: ${s.priority}
- **Estimated Time:** ${s.estimatedTimeToLearn}
- **Why Learn It:** ${s.whyLearnIt}
- **Recommended Project:** ${s.projectIdea}
`
  )
  .join('\n')}

---

## 7. Extracted Resume Profile (Verified Facts)
- **Email:** ${analysis.extractedData.contactInfo.email || 'N/A'}
- **Phone:** ${analysis.extractedData.contactInfo.phone || 'N/A'}
- **Location:** ${analysis.extractedData.contactInfo.location || 'N/A'}
- **Languages:** ${analysis.extractedData.technicalSkills.languages.join(', ') || 'None listed'}
- **Frameworks:** ${analysis.extractedData.technicalSkills.frameworksAndLibraries.join(', ') || 'None listed'}
- **Cloud & DevOps:** ${analysis.extractedData.technicalSkills.cloudAndDevOps.join(', ') || 'None listed'}
- **Databases:** ${analysis.extractedData.technicalSkills.databases.join(', ') || 'None listed'}
- **AI/ML Tools:** ${analysis.extractedData.technicalSkills.aiAndMlTools.join(', ') || 'None listed'}
`;

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = candidate.replace(/[^a-zA-Z0-9]/g, '_');
  a.download = `${safeName}_AI_Resume_Analysis.md`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Copies a scannable summary to clipboard
 */
export async function copySummaryToClipboard(analysis: ResumeAnalysisResult): Promise<boolean> {
  const text = `AI Resume Analysis Summary:
Candidate: ${analysis.extractedData.candidateName || 'Candidate'}
Target Role: ${analysis.targetRoleAnalysis.targetRole}
Overall Score: ${analysis.overallScore}/100
ATS Score: ${analysis.atsAudit.atsScore}/100 (${analysis.atsAudit.isAtsFriendly ? 'ATS Friendly' : 'Needs Optimization'})
Role Match: ${analysis.targetRoleAnalysis.fitAssessment} (${analysis.targetRoleAnalysis.matchScore}/100)

Summary:
${analysis.overallSummary}

Top Missing Skills:
${analysis.targetRoleAnalysis.missingOrWeakSkills.slice(0, 4).map((m) => `• ${m.skill} (${m.importance})`).join('\n')}
`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
