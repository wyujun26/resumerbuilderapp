import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import type { AnalysisResult } from '../types';
import './AnalysisResults.css';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  const scoreImprovement = analysis.optimizedMatchScore - analysis.originalMatchScore;

  return (
    <div className="analysis-results">
      <div className="score-cards">
        <div className="score-card original">
          <h3>Original Match Score</h3>
          <div className="score">{analysis.originalMatchScore}%</div>
          <p>Before optimization</p>
        </div>

        <div className="score-arrow">
          <TrendingUp size={32} />
          <span className="improvement">+{scoreImprovement}%</span>
        </div>

        <div className="score-card optimized">
          <h3>Optimized Match Score</h3>
          <div className="score">{analysis.optimizedMatchScore}%</div>
          <p>After optimization</p>
        </div>
      </div>

      <div className="analysis-grid">
        <div className="analysis-card">
          <div className="card-header">
            <Target size={24} />
            <h3>Key Requirements</h3>
          </div>
          <div className="keyword-list">
            {analysis.keywords.slice(0, 15).map((keyword, index) => (
              <span key={index} className="keyword-tag primary">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="analysis-card">
          <div className="card-header">
            <CheckCircle size={24} />
            <h3>Required Skills</h3>
          </div>
          <div className="keyword-list">
            {analysis.requiredSkills.map((skill, index) => (
              <span key={index} className="keyword-tag success">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="analysis-card">
          <div className="card-header">
            <AlertTriangle size={24} />
            <h3>Missing Keywords</h3>
          </div>
          <div className="keyword-list">
            {analysis.missingKeywords.length > 0 ? (
              analysis.missingKeywords.map((keyword, index) => (
                <span key={index} className="keyword-tag warning">
                  {keyword}
                </span>
              ))
            ) : (
              <p className="no-missing">All key requirements are present!</p>
            )}
          </div>
        </div>

        <div className="analysis-card full-width">
          <div className="card-header">
            <TrendingUp size={24} />
            <h3>Optimization Suggestions</h3>
          </div>
          <ul className="suggestions-list">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
