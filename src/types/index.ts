export interface AnalysisResult {
  keywords: string[];
  requiredSkills: string[];
  qualifications: string[];
  missingKeywords: string[];
  keywordDensity: Record<string, number>;
  originalMatchScore: number;
  optimizedMatchScore: number;
  suggestions: string[];
}

export interface OptimizationResult {
  optimizedResume: string;
  changes: Change[];
  addedKeywords: string[];
}

export interface Change {
  type: 'added' | 'modified' | 'removed';
  section: string;
  original?: string;
  modified: string;
  reason: string;
}

export interface ResumeSection {
  title: string;
  content: string;
}
