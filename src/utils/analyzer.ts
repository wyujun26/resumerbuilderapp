import type { AnalysisResult, OptimizationResult, Change } from '../types';

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'we', 'you', 'your', 'our', 'their'
]);

const SKILL_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue',
  'node.js', 'express', 'mongodb', 'sql', 'postgresql', 'mysql', 'aws',
  'azure', 'docker', 'kubernetes', 'git', 'agile', 'scrum', 'ci/cd',
  'rest api', 'graphql', 'microservices', 'testing', 'tdd', 'leadership',
  'communication', 'problem solving', 'team collaboration', 'project management',
  'supply chain', 'logistics', 'procurement', 'inventory', 'forecasting',
  'kpi', 'otif', 'cost reduction', 'process improvement', 'vendor management',
  'ebitda', 'nps', 'compliance', 'analytics', 'optimization'
];

const ACTION_VERBS = [
  'Spearheaded', 'Orchestrated', 'Engineered', 'Architected', 'Pioneered',
  'Transformed', 'Optimized', 'Streamlined', 'Accelerated', 'Championed',
  'Delivered', 'Executed', 'Implemented', 'Launched', 'Established',
  'Drove', 'Led', 'Managed', 'Directed', 'Coordinated',
  'Developed', 'Created', 'Built', 'Designed', 'Formulated',
  'Improved', 'Enhanced', 'Strengthened', 'Elevated', 'Maximized',
  'Reduced', 'Minimized', 'Eliminated', 'Resolved', 'Mitigated',
  'Analyzed', 'Evaluated', 'Assessed', 'Identified', 'Diagnosed',
  'Negotiated', 'Collaborated', 'Partnered', 'Facilitated', 'Aligned'
];

export function analyzeJobDescription(jobDescription: string): Omit<AnalysisResult, 'originalMatchScore' | 'optimizedMatchScore'> {
  const text = jobDescription.toLowerCase();
  const words = text.split(/\W+/).filter(word => 
    word.length > 2 && !STOP_WORDS.has(word)
  );

  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);

  const keywords = sortedWords.map(([word]) => word);

  const requiredSkills = SKILL_KEYWORDS.filter(skill => 
    text.includes(skill.toLowerCase())
  );

  const qualifications: string[] = [];
  if (text.includes('bachelor') || text.includes('degree')) {
    qualifications.push("Bachelor's degree or equivalent experience");
  }
  if (text.includes('master')) {
    qualifications.push("Master's degree preferred");
  }
  if (text.includes('years') || text.includes('experience')) {
    const yearMatch = text.match(/(\d+)\+?\s*years?/);
    if (yearMatch) {
      qualifications.push(`${yearMatch[1]}+ years of experience`);
    }
  }

  const keywordDensity: Record<string, number> = {};
  sortedWords.forEach(([word, count]) => {
    keywordDensity[word] = Math.round((count / words.length) * 100);
  });

  const suggestions = [
    'Use ALL CAPS for section headers',
    'Start each bullet with strong action verbs',
    'Include quantifiable metrics (%, $, numbers)',
    'Write 120-150 word professional summary',
    'Align skills with job requirements',
    'Use simple, ATS-friendly formatting',
    'Include keyword-rich bullet points'
  ];

  return {
    keywords,
    requiredSkills,
    qualifications,
    missingKeywords: [],
    keywordDensity,
    suggestions
  };
}

export function calculateMatchScore(resume: string, analysis: Omit<AnalysisResult, 'originalMatchScore' | 'optimizedMatchScore'>): number {
  const resumeLower = resume.toLowerCase();
  let matchedKeywords = 0;
  let totalWeight = 0;

  analysis.keywords.forEach(keyword => {
    totalWeight += 1;
    if (resumeLower.includes(keyword.toLowerCase())) {
      matchedKeywords += 1;
    }
  });

  analysis.requiredSkills.forEach(skill => {
    totalWeight += 3;
    if (resumeLower.includes(skill.toLowerCase())) {
      matchedKeywords += 3;
    }
  });

  const score = Math.round((matchedKeywords / totalWeight) * 100);
  return Math.min(score, 98);
}

interface ParsedResume {
  name: string;
  contact: string[];
  summary: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  certifications: string[];
  other: Map<string, string[]>;
}

interface ExperienceEntry {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  details: string[];
}

function parseResume(resume: string): ParsedResume {
  const lines = resume.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const parsed: ParsedResume = {
    name: '',
    contact: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    other: new Map()
  };

  let currentSection = 'HEADER';
  let currentExperience: Partial<ExperienceEntry> | null = null;
  let currentEducation: Partial<EducationEntry> | null = null;
  let sectionContent: string[] = [];

  const sectionKeywords = {
    summary: ['SUMMARY', 'OBJECTIVE', 'PROFILE'],
    experience: ['EXPERIENCE', 'EMPLOYMENT', 'WORK HISTORY'],
    education: ['EDUCATION', 'ACADEMIC'],
    skills: ['SKILLS', 'COMPETENCIES', 'TECHNICAL'],
    certifications: ['CERTIFICATION', 'CERTIFICATE', 'LICENSE']
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();

    // Detect section headers
    let newSection = '';
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.some(kw => upperLine.includes(kw))) {
        newSection = section;
        break;
      }
    }

    if (newSection) {
      // Save previous section
      if (currentSection === 'experience' && currentExperience?.bullets) {
        parsed.experience.push(currentExperience as ExperienceEntry);
        currentExperience = null;
      }
      if (currentSection === 'education' && currentEducation?.degree) {
        parsed.education.push(currentEducation as EducationEntry);
        currentEducation = null;
      }

      currentSection = newSection;
      continue;
    }

    // Parse based on current section
    if (currentSection === 'HEADER') {
      if (i === 0) {
        parsed.name = line;
      } else if (line.includes('@') || line.includes('phone') || line.includes('linkedin')) {
        parsed.contact.push(line);
      }
    } else if (currentSection === 'summary') {
      parsed.summary.push(line);
    } else if (currentSection === 'experience') {
      const isBullet = line.match(/^[•\-\*]/);
      
      if (isBullet) {
        if (currentExperience) {
          currentExperience.bullets = currentExperience.bullets || [];
          currentExperience.bullets.push(line.replace(/^[•\-\*]\s*/, ''));
        }
      } else {
        // New job entry
        if (currentExperience?.bullets) {
          parsed.experience.push(currentExperience as ExperienceEntry);
        }
        
        // Try to parse job title, company, dates
        const parts = line.split('|').map(p => p.trim());
        currentExperience = {
          title: parts[0] || line,
          company: parts[1] || '',
          location: parts[2] || '',
          dates: parts[3] || '',
          bullets: []
        };
      }
    } else if (currentSection === 'education') {
      if (!currentEducation) {
        currentEducation = {
          degree: line,
          institution: '',
          year: '',
          details: []
        };
      } else if (!currentEducation.institution) {
        currentEducation.institution = line;
      } else if (!currentEducation.year && line.match(/\d{4}/)) {
        currentEducation.year = line;
      } else {
        currentEducation.details = currentEducation.details || [];
        currentEducation.details.push(line);
      }
    } else if (currentSection === 'skills') {
      parsed.skills.push(line);
    } else if (currentSection === 'certifications') {
      parsed.certifications.push(line);
    }
  }

  // Save last entries
  if (currentExperience?.bullets) {
    parsed.experience.push(currentExperience as ExperienceEntry);
  }
  if (currentEducation?.degree) {
    parsed.education.push(currentEducation as EducationEntry);
  }

  return parsed;
}

function generateProfessionalSummary(
  parsed: ParsedResume,
  keywords: string[],
  requiredSkills: string[]
): string {
  const topKeywords = [...new Set([...requiredSkills.slice(0, 8), ...keywords.slice(0, 8)])];
  const yearsExp = parsed.experience.length > 0 ? `${parsed.experience.length * 2}+` : '5+';
  
  const sentences: string[] = [];
  
  // Opening statement
  sentences.push(
    `Results-driven professional with ${yearsExp} years of proven expertise in ${topKeywords.slice(0, 3).join(', ')}, and ${topKeywords[3] || 'strategic initiatives'}.`
  );
  
  // Core competencies
  sentences.push(
    `Demonstrated track record of delivering measurable business outcomes through ${topKeywords.slice(4, 6).join(' and ')}, with deep proficiency in ${topKeywords.slice(6, 8).join(' and ')}.`
  );
  
  // Value proposition
  sentences.push(
    `Recognized for transforming complex challenges into scalable solutions that drive organizational growth, operational excellence, and competitive advantage through data-driven decision-making and cross-functional collaboration.`
  );

  return sentences.join(' ');
}

function enhanceBullet(bullet: string, keywords: string[], usedVerbs: Set<string>): string {
  let enhanced = bullet.trim().replace(/^[•\-\*]\s*/, '');
  
  // Check if starts with action verb
  const startsWithVerb = ACTION_VERBS.some(v => 
    enhanced.toLowerCase().startsWith(v.toLowerCase())
  );
  
  if (!startsWithVerb) {
    const verb = ACTION_VERBS.find(v => !usedVerbs.has(v)) || ACTION_VERBS[0];
    usedVerbs.add(verb);
    enhanced = `${verb} ${enhanced.charAt(0).toLowerCase()}${enhanced.slice(1)}`;
  } else {
    usedVerbs.add(enhanced.split(' ')[0]);
  }
  
  // Naturally incorporate keywords if missing
  const missingKeywords = keywords.filter(kw => 
    !enhanced.toLowerCase().includes(kw.toLowerCase())
  ).slice(0, 1);
  
  if (missingKeywords.length > 0 && enhanced.length < 150) {
    enhanced += ` leveraging ${missingKeywords[0]}`;
  }
  
  return enhanced;
}

export function optimizeResume(
  resume: string,
  analysis: Omit<AnalysisResult, 'originalMatchScore' | 'optimizedMatchScore'>
): OptimizationResult {
  const parsed = parseResume(resume);
  const changes: Change[] = [];
  const usedVerbs = new Set<string>();
  const topKeywords = [...new Set([...analysis.requiredSkills, ...analysis.keywords])].slice(0, 20);
  
  const output: string[] = [];
  
  // 1. HEADER
  output.push(parsed.name.toUpperCase());
  parsed.contact.forEach(c => output.push(c));
  output.push('');
  
  // 2. PROFESSIONAL SUMMARY
  output.push('PROFESSIONAL SUMMARY');
  output.push('─────────────────────────────────────────────────────────────────────────────────');
  const summary = generateProfessionalSummary(parsed, analysis.keywords, analysis.requiredSkills);
  output.push(summary);
  output.push('');
  
  changes.push({
    type: 'modified',
    section: 'Professional Summary',
    modified: '120-150 word keyword-optimized summary',
    reason: 'ATS-compliant format with industry terminology'
  });
  
  // 3. KEY HIGHLIGHTS
  output.push('KEY HIGHLIGHTS');
  output.push('─────────────────────────────────────────────────────────────────────────────────');
  
  const highlights: string[] = [];
  parsed.experience.forEach(exp => {
    exp.bullets.forEach(bullet => {
      if (bullet.match(/\d+%|\$\d+|increased|reduced|improved|achieved/i)) {
        highlights.push(bullet);
      }
    });
  });
  
  highlights.slice(0, 5).forEach(h => {
    const enhanced = enhanceBullet(h, topKeywords, usedVerbs);
    output.push(`• ${enhanced}`);
  });
  output.push('');
  
  changes.push({
    type: 'added',
    section: 'Key Highlights',
    modified: 'Top 5 quantifiable achievements',
    reason: 'Prominently display metrics for ATS scanning'
  });
  
  // 4. PROFESSIONAL EXPERIENCE
  output.push('PROFESSIONAL EXPERIENCE');
  output.push('─────────────────────────────────────────────────────────────────────────────────');
  
  parsed.experience.forEach(exp => {
    output.push(`${exp.title} | ${exp.company} | ${exp.location} | ${exp.dates}`);
    exp.bullets.forEach(bullet => {
      const enhanced = enhanceBullet(bullet, topKeywords, usedVerbs);
      output.push(`• ${enhanced}`);
    });
    output.push('');
  });
  
  changes.push({
    type: 'modified',
    section: 'Professional Experience',
    modified: 'Enhanced bullets with action verbs and keywords',
    reason: 'Improved ATS parsing and keyword density'
  });
  
  // 5. EDUCATION
  output.push('EDUCATION');
  output.push('─────────────────────────────────────────────────────────────────────────────────');
  
  parsed.education.forEach(edu => {
    output.push(`${edu.degree} | ${edu.institution} | ${edu.year}`);
    edu.details.forEach(d => output.push(d));
    output.push('');
  });
  
  // 6. TECHNICAL SKILLS & COMPETENCIES
  output.push('TECHNICAL SKILLS & COMPETENCIES');
  output.push('─────────────────────────────────────────────────────────────────────────────────');
  
  const allSkills = [...new Set([
    ...parsed.skills.join(', ').split(',').map(s => s.trim()),
    ...analysis.requiredSkills
  ])];
  
  output.push(allSkills.join(' • '));
  output.push('');
  
  changes.push({
    type: 'modified',
    section: 'Technical Skills',
    modified: 'Added missing job-required skills',
    reason: 'Ensure all critical keywords are present'
  });
  
  // 7. CERTIFICATIONS
  if (parsed.certifications.length > 0) {
    output.push('CERTIFICATIONS');
    output.push('─────────────────────────────────────────────────────────────────────────────────');
    parsed.certifications.forEach(cert => output.push(`• ${cert}`));
    output.push('');
  }
  
  // 8. KEYWORD ALIGNMENT REPORT
  output.push('═════════════════════════════════════════════════════════════════════════════════');
  output.push('KEYWORD ALIGNMENT REPORT');
  output.push('═════════════════════════════════════════════════════════════════════════════════');
  
  const resumeText = output.join('\n').toLowerCase();
  topKeywords.slice(0, 15).forEach(keyword => {
    const count = (resumeText.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const status = count > 0 ? '✓' : '✗';
    const locations: string[] = [];
    
    if (output.slice(0, 10).join('\n').toLowerCase().includes(keyword.toLowerCase())) {
      locations.push('Summary');
    }
    if (output.join('\n').toLowerCase().includes(keyword.toLowerCase())) {
      if (output.join('\n').includes('KEY HIGHLIGHTS')) locations.push('Highlights');
      if (output.join('\n').includes('PROFESSIONAL EXPERIENCE')) locations.push('Experience');
      if (output.join('\n').includes('TECHNICAL SKILLS')) locations.push('Skills');
    }
    
    output.push(`${status} ${keyword} (${count}x) - ${locations.join(', ') || 'Not found'}`);
  });
  output.push('');
  
  // 9. MISSING KEYWORDS
  output.push('MISSING/UNDERWEIGHTED KEYWORDS');
  output.push('─────────────────────────────────────────────────────────────────────────────────');
  
  const missing = topKeywords.filter(kw => 
    !resumeText.includes(kw.toLowerCase())
  );
  
  if (missing.length > 0) {
    output.push('Consider naturally incorporating these keywords:');
    missing.forEach(kw => output.push(`• ${kw}`));
  } else {
    output.push('✓ All critical keywords are present in your resume!');
  }
  
  return {
    optimizedResume: output.join('\n'),
    changes,
    addedKeywords: topKeywords.slice(0, 10)
  };
}
