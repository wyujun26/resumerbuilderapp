import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Eye, Download, ArrowLeft } from 'lucide-react';

export default function Editor() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Experienced software engineer with 5+ years of expertise in full-stack development.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Led development of cloud-based applications using React and Node.js',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California',
        location: 'Berkeley, CA',
        graduationDate: '2018-05',
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'AWS'],
  });

  const handleSave = () => {
    const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    const newResume = {
      id: id || Date.now().toString(),
      title: `${formData.fullName}'s Resume`,
      template: 'modern',
      lastModified: new Date().toISOString().split('T')[0],
      thumbnail: 'https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=400',
      data: formData,
    };
    
    if (id) {
      const index = resumes.findIndex((r: any) => r.id === id);
      if (index !== -1) {
        resumes[index] = newResume;
      }
    } else {
      resumes.push(newResume);
    }
    
    localStorage.setItem('resumes', JSON.stringify(resumes));
    navigate('/resumes');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/resumes')}>
          <ArrowLeft size={20} />
          Back to Resumes
        </button>
        <div style={styles.actions}>
          <button style={styles.actionButton} onClick={() => navigate(`/preview/${id || 'new'}`)}>
            <Eye size={18} />
            Preview
          </button>
          <button style={styles.actionButton}>
            <Download size={18} />
            Download PDF
          </button>
          <button style={styles.saveButton} onClick={handleSave}>
            <Save size={18} />
            Save Resume
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.form}>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Personal Information</h2>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  style={styles.input}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  style={styles.input}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Professional Summary</h2>
            <textarea
              style={styles.textarea}
              rows={4}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Work Experience</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} style={styles.experienceCard}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Job Title</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={exp.title}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index].title = e.target.value;
                        setFormData({ ...formData, experience: newExp });
                      }}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Company</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index].company = e.target.value;
                        setFormData({ ...formData, experience: newExp });
                      }}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    style={styles.textarea}
                    rows={3}
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].description = e.target.value;
                      setFormData({ ...formData, experience: newExp });
                    }}
                  />
                </div>
              </div>
            ))}
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Skills</h2>
            <div style={styles.skillsContainer}>
              {formData.skills.map((skill, index) => (
                <div key={index} style={styles.skillTag}>
                  {skill}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div style={styles.preview}>
          <div style={styles.previewCard}>
            <h3 style={styles.previewTitle}>Live Preview</h3>
            <div style={styles.previewContent}>
              <div style={styles.resumePreview}>
                <h1 style={styles.resumeName}>{formData.fullName}</h1>
                <p style={styles.resumeContact}>
                  {formData.email} • {formData.phone} • {formData.location}
                </p>
                <div style={styles.resumeSection}>
                  <h2 style={styles.resumeSectionTitle}>Summary</h2>
                  <p style={styles.resumeText}>{formData.summary}</p>
                </div>
                <div style={styles.resumeSection}>
                  <h2 style={styles.resumeSectionTitle}>Experience</h2>
                  {formData.experience.map((exp, index) => (
                    <div key={index} style={styles.resumeExperience}>
                      <h3 style={styles.resumeJobTitle}>{exp.title}</h3>
                      <p style={styles.resumeCompany}>{exp.company}</p>
                      <p style={styles.resumeText}>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: '#f1f5f9',
    color: '#475569',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: '#f1f5f9',
    color: '#475569',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#3b82f6',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  section: {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#475569',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#1e293b',
  },
  textarea: {
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#1e293b',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  },
  experienceCard: {
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  skillTag: {
    padding: '8px 16px',
    background: '#eff6ff',
    color: '#3b82f6',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 500,
  },
  preview: {
    position: 'sticky' as const,
    top: '96px',
    height: 'fit-content',
  },
  previewCard: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  previewTitle: {
    padding: '20px',
    fontSize: '18px',
    fontWeight: 700,
    color: '#1e293b',
    borderBottom: '1px solid #e2e8f0',
  },
  previewContent: {
    padding: '24px',
    maxHeight: '800px',
    overflowY: 'auto' as const,
  },
  resumePreview: {
    background: '#ffffff',
    padding: '32px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  resumeName: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: '8px',
  },
  resumeContact: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '24px',
  },
  resumeSection: {
    marginBottom: '24px',
  },
  resumeSectionTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '2px solid #3b82f6',
  },
  resumeText: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: 1.6,
  },
  resumeExperience: {
    marginBottom: '16px',
  },
  resumeJobTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '4px',
  },
  resumeCompany: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '8px',
  },
};
