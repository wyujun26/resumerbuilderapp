import React from 'react';
import { FileText, Briefcase } from 'lucide-react';
import './InputSection.css';

interface InputSectionProps {
  jobDescription: string;
  currentResume: string;
  onJobDescriptionChange: (value: string) => void;
  onResumeChange: (value: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  jobDescription,
  currentResume,
  onJobDescriptionChange,
  onResumeChange
}) => {
  return (
    <div className="input-section">
      <div className="input-column">
        <div className="input-header">
          <Briefcase size={24} />
          <h2>Job Description</h2>
        </div>
        <textarea
          className="input-textarea"
          placeholder="Paste the job description here...&#10;&#10;Include:&#10;• Job title and responsibilities&#10;• Required skills and qualifications&#10;• Preferred experience&#10;• Technical requirements&#10;&#10;Minimum 100 characters required"
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          rows={20}
        />
        <div className="char-count">
          {jobDescription.length} characters
          {jobDescription.length < 100 && (
            <span className="warning"> (minimum 100 required)</span>
          )}
        </div>
      </div>

      <div className="input-column">
        <div className="input-header">
          <FileText size={24} />
          <h2>Current Resume</h2>
        </div>
        <textarea
          className="input-textarea"
          placeholder="Paste your current resume here...&#10;&#10;Include:&#10;• Professional summary&#10;• Work experience&#10;• Education&#10;• Skills&#10;• Certifications (if any)&#10;&#10;Minimum 100 characters required"
          value={currentResume}
          onChange={(e) => onResumeChange(e.target.value)}
          rows={20}
        />
        <div className="char-count">
          {currentResume.length} characters
          {currentResume.length < 100 && (
            <span className="warning"> (minimum 100 required)</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputSection;
