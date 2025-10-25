import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Edit } from 'lucide-react';

export default function Preview() {
  const navigate = useNavigate();
  const { id } = useParams();

  const sampleData = {
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Led development of cloud-based applications using React and Node.js. Managed a team of 5 developers and improved system performance by 40%.',
      },
      {
        title: 'Software Engineer',
        company: 'StartupXYZ',
        location: 'San Francisco, CA',
        startDate: '2018-06',
        endDate: '2019-12',
        description: 'Developed and maintained web applications using modern JavaScript frameworks. Collaborated with cross-functional teams to deliver high-quality products.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        graduationDate: '2018-05',
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'MongoDB'],
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/resumes')}>
          <ArrowLeft size={20} />
          Back to Resumes
        </button>
        <div style={styles.actions}>
          <button style={styles.actionButton} onClick={() => navigate(`/editor/${id}`)}>
            <Edit size={18} />
            Edit Resume
          </button>
          <button style={styles.downloadButton}>
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.resume}>
          <div style={styles.resumeHeader}>
            <h1 style={styles.name}>{sampleData.fullName}</h1>
            <div style={styles.contact}>
              <span>{sampleData.email}</span>
              <span>•</span>
              <span>{sampleData.phone}</span>
              <span>•</span>
              <span>{sampleData.location}</span>
            </div>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Professional Summary</h2>
            <p style={styles.text}>{sampleData.summary}</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Work Experience</h2>
            {sampleData.experience.map((exp, index) => (
              <div key={index} style={styles.experienceItem}>
                <div style={styles.experienceHeader}>
                  <div>
                    <h3 style={styles.jobTitle}>{exp.title}</h3>
                    <p style={styles.company}>{exp.company} • {exp.location}</p>
                  </div>
                  <p style={styles.dates}>
                    {exp.startDate} - {exp.endDate}
                  </p>
                </div>
                <p style={styles.text}>{exp.description}</p>
              </div>
            ))}
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Education</h2>
            {sampleData.education.map((edu, index) => (
              <div key={index} style={styles.educationItem}>
                <div style={styles.experienceHeader}>
                  <div>
                    <h3 style={styles.degree}>{edu.degree}</h3>
                    <p style={styles.school}>{edu.school} • {edu.location}</p>
                  </div>
                  <p style={styles.dates}>{edu.graduationDate}</p>
                </div>
              </div>
            ))}
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Skills</h2>
            <div style={styles.skillsGrid}>
              {sampleData.skills.map((skill, index) => (
                <div key={index} style={styles.skillTag}>
                  {skill}
                </div>
              ))}
            </div>
          </section>
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
  downloadButton: {
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
    display: 'flex',
    justifyContent: 'center',
  },
  resume: {
    width: '100%',
    maxWidth: '800px',
    background: '#ffffff',
    padding: '48px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  resumeHeader: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '2px solid #e2e8f0',
  },
  name: {
    fontSize: '36px',
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: '12px',
  },
  contact: {
    display: 'flex',
    gap: '12px',
    fontSize: '14px',
    color: '#64748b',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '2px solid #3b82f6',
  },
  text: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: 1.7,
  },
  experienceItem: {
    marginBottom: '24px',
  },
  experienceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  jobTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '4px',
  },
  company: {
    fontSize: '15px',
    color: '#64748b',
  },
  dates: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: 500,
  },
  educationItem: {
    marginBottom: '16px',
  },
  degree: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '4px',
  },
  school: {
    fontSize: '15px',
    color: '#64748b',
  },
  skillsGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '12px',
  },
  skillTag: {
    padding: '8px 16px',
    background: '#eff6ff',
    color: '#3b82f6',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 500,
  },
};
