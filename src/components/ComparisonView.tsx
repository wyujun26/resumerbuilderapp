import React from 'react';
import { ArrowRight, Plus, Edit3 } from 'lucide-react';
import type { Change } from '../types';
import './ComparisonView.css';

interface ComparisonViewProps {
  original: string;
  optimized: string;
  changes: Change[];
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  original,
  optimized,
  changes
}) => {
  return (
    <div className="comparison-view">
      <div className="changes-summary">
        <h3>Changes Made</h3>
        <div className="changes-list">
          {changes.map((change, index) => (
            <div key={index} className={`change-item ${change.type}`}>
              <div className="change-icon">
                {change.type === 'added' && <Plus size={18} />}
                {change.type === 'modified' && <Edit3 size={18} />}
              </div>
              <div className="change-content">
                <div className="change-header">
                  <span className="change-type">{change.type}</span>
                  <span className="change-section">{change.section}</span>
                </div>
                <p className="change-text">{change.modified}</p>
                <p className="change-reason">{change.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="resume-comparison">
        <div className="resume-column">
          <div className="resume-header original">
            <h3>Original Resume</h3>
          </div>
          <div className="resume-content">
            <pre>{original}</pre>
          </div>
        </div>

        <div className="comparison-arrow">
          <ArrowRight size={32} />
        </div>

        <div className="resume-column">
          <div className="resume-header optimized">
            <h3>Optimized Resume</h3>
          </div>
          <div className="resume-content">
            <pre>{optimized}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
