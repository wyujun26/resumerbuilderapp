import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Download, AlertCircle } from 'lucide-react';
import InputSection from './components/InputSection';
import AnalysisResults from './components/AnalysisResults';
import ComparisonView from './components/ComparisonView';
import { analyzeJobDescription, optimizeResume, calculateMatchScore } from './utils/analyzer';
import { exportToTxt, exportToDocx } from './utils/exporter';
import type { AnalysisResult, OptimizationResult } from './types';
import './App.css';

const STORAGE_KEYS = {
  JOB_DESCRIPTION: 'ats_job_description',
  CURRENT_RESUME: 'ats_current_resume',
  ANALYSIS_RESULT: 'ats_analysis_result',
  OPTIMIZATION_RESULT: 'ats_optimization_result',
  ACTIVE_TAB: 'ats_active_tab'
};

const App: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [currentResume, setCurrentResume] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'results' | 'comparison'>('input');

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedJobDescription = localStorage.getItem(STORAGE_KEYS.JOB_DESCRIPTION);
      const savedResume = localStorage.getItem(STORAGE_KEYS.CURRENT_RESUME);
      const savedAnalysis = localStorage.getItem(STORAGE_KEYS.ANALYSIS_RESULT);
      const savedOptimization = localStorage.getItem(STORAGE_KEYS.OPTIMIZATION_RESULT);
      const savedTab = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);

      if (savedJobDescription) setJobDescription(savedJobDescription);
      if (savedResume) setCurrentResume(savedResume);
      if (savedAnalysis) setAnalysisResult(JSON.parse(savedAnalysis));
      if (savedOptimization) setOptimizationResult(JSON.parse(savedOptimization));
      if (savedTab) setActiveTab(savedTab as 'input' | 'results' | 'comparison');
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Save job description to localStorage
  useEffect(() => {
    if (jobDescription) {
      localStorage.setItem(STORAGE_KEYS.JOB_DESCRIPTION, jobDescription);
    }
  }, [jobDescription]);

  // Save resume to localStorage
  useEffect(() => {
    if (currentResume) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_RESUME, currentResume);
    }
  }, [currentResume]);

  // Save analysis result to localStorage
  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem(STORAGE_KEYS.ANALYSIS_RESULT, JSON.stringify(analysisResult));
    }
  }, [analysisResult]);

  // Save optimization result to localStorage
  useEffect(() => {
    if (optimizationResult) {
      localStorage.setItem(STORAGE_KEYS.OPTIMIZATION_RESULT, JSON.stringify(optimizationResult));
    }
  }, [optimizationResult]);

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  const handleAnalyze = async () => {
    if (jobDescription.length < 100 || currentResume.length < 100) {
      alert('Please provide both job description and resume with sufficient content.');
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const analysis = analyzeJobDescription(jobDescription);
      const optimization = optimizeResume(currentResume, analysis);
      const matchScore = calculateMatchScore(currentResume, analysis);
      const optimizedMatchScore = calculateMatchScore(optimization.optimizedResume, analysis);

      const newAnalysisResult = {
        ...analysis,
        originalMatchScore: matchScore,
        optimizedMatchScore: optimizedMatchScore
      };
      
      setAnalysisResult(newAnalysisResult);
      setOptimizationResult(optimization);
      setIsAnalyzing(false);
      setActiveTab('results');
    }, 1500);
  };

  const handleExportTxt = () => {
    if (optimizationResult) {
      exportToTxt(optimizationResult.optimizedResume);
    }
  };

  const handleExportDocx = async () => {
    if (optimizationResult) {
      await exportToDocx(optimizationResult.optimizedResume);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setJobDescription('');
      setCurrentResume('');
      setAnalysisResult(null);
      setOptimizationResult(null);
      setActiveTab('input');
      
      // Clear localStorage
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <FileText size={32} />
            <h1>ATS Resume Optimizer</h1>
          </div>
          <p className="tagline">Optimize your resume for Applicant Tracking Systems</p>
        </div>
      </header>

      <main className="app-main">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'input' ? 'active' : ''}`}
            onClick={() => setActiveTab('input')}
          >
            Input
          </button>
          <button
            className={`tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
            disabled={!analysisResult}
          >
            Analysis Results
          </button>
          <button
            className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
            disabled={!optimizationResult}
          >
            Comparison
          </button>
        </div>

        <div className="content">
          {activeTab === 'input' && (
            <>
              <InputSection
                jobDescription={jobDescription}
                currentResume={currentResume}
                onJobDescriptionChange={setJobDescription}
                onResumeChange={setCurrentResume}
              />
              
              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || jobDescription.length < 100 || currentResume.length < 100}
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="spin" size={20} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Analyze & Optimize
                    </>
                  )}
                </button>
                
                {(jobDescription || currentResume) && (
                  <button className="btn btn-secondary" onClick={handleReset}>
                    Reset
                  </button>
                )}
              </div>

              <div className="info-card">
                <AlertCircle size={20} />
                <div>
                  <h3>How it works</h3>
                  <ul>
                    <li>Paste the job description in the left column (minimum 100 characters)</li>
                    <li>Paste your current resume in the right column (minimum 100 characters)</li>
                    <li>Click "Analyze & Optimize" to get your ATS-optimized resume</li>
                    <li>Review the analysis, comparison, and download your optimized resume</li>
                    <li><strong>Your data is automatically saved in your browser</strong></li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === 'results' && analysisResult && optimizationResult && (
            <>
              <AnalysisResults analysis={analysisResult} />
              
              <div className="export-section">
                <h3>Export Optimized Resume</h3>
                <div className="export-buttons">
                  <button className="btn btn-export" onClick={handleExportTxt}>
                    <Download size={18} />
                    Download as TXT
                  </button>
                  <button className="btn btn-export" onClick={handleExportDocx}>
                    <Download size={18} />
                    Download as DOCX
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'comparison' && optimizationResult && (
            <>
              <ComparisonView
                original={currentResume}
                optimized={optimizationResult.optimizedResume}
                changes={optimizationResult.changes}
              />
              
              <div className="export-section">
                <h3>Export Optimized Resume</h3>
                <div className="export-buttons">
                  <button className="btn btn-export" onClick={handleExportTxt}>
                    <Download size={18} />
                    Download as TXT
                  </button>
                  <button className="btn btn-export" onClick={handleExportDocx}>
                    <Download size={18} />
                    Download as DOCX
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with ChatAndBuild • ATS Resume Optimizer</p>
        <p className="disclaimer">
          This tool provides suggestions based on common ATS practices. Always review and verify all changes.
        </p>
      </footer>
    </div>
  );
};

export default App;
