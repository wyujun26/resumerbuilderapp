import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Eye, Download, Trash2, Edit } from 'lucide-react';

interface Resume {
  id: string;
  title: string;
  template: string;
  lastModified: string;
  thumbnail: string;
}

export default function MyResumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    const savedResumes = localStorage.getItem('resumes');
    if (savedResumes) {
      setResumes(JSON.parse(savedResumes));
    } else {
      const sampleResumes: Resume[] = [
        {
          id: '1',
          title: 'Software Engineer Resume',
          template: 'modern',
          lastModified: '2024-01-15',
          thumbnail: 'https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=400',
        },
        {
          id: '2',
          title: 'Marketing Manager Resume',
          template: 'professional',
          lastModified: '2024-01-10',
          thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
        },
        {
          id: '3',
          title: 'Data Analyst Resume',
          template: 'minimal',
          lastModified: '2024-01-05',
          thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
        },
      ];
      setResumes(sampleResumes);
      localStorage.setItem('resumes', JSON.stringify(sampleResumes));
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedResumes = resumes.filter((r) => r.id !== id);
    setResumes(updatedResumes);
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Resumes</h1>
          <p style={styles.subtitle}>Manage and edit your resume collection</p>
        </div>
        <button
          style={styles.createButton}
          onClick={() => navigate('/editor')}
        >
          <Plus size={20} />
          Create New Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <div style={styles.empty}>
          <FileText size={64} color="#cbd5e1" />
          <h2 style={styles.emptyTitle}>No resumes yet</h2>
          <p style={styles.emptyText}>Create your first resume to get started</p>
          <button
            style={styles.emptyButton}
            onClick={() => navigate('/editor')}
          >
            <Plus size={20} />
            Create Resume
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {resumes.map((resume) => (
            <div key={resume.id} style={styles.card}>
              <div style={styles.cardThumbnail}>
                <img
                  src={resume.thumbnail}
                  alt={resume.title}
                  style={styles.thumbnailImage}
                />
                <div style={styles.cardOverlay}>
                  <button
                    style={styles.overlayButton}
                    onClick={() => navigate(`/preview/${resume.id}`)}
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    style={styles.overlayButton}
                    onClick={() => navigate(`/editor/${resume.id}`)}
                  >
                    <Edit size={20} />
                  </button>
                </div>
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{resume.title}</h3>
                <p style={styles.cardMeta}>
                  Modified: {new Date(resume.lastModified).toLocaleDateString()}
                </p>
                <div style={styles.cardActions}>
                  <button
                    style={styles.actionButton}
                    onClick={() => navigate(`/editor/${resume.id}`)}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button style={styles.actionButton}>
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => handleDelete(resume.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '32px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: '#ffffff',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1e293b',
    marginTop: '24px',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '24px',
  },
  emptyButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#3b82f6',
    color: '#ffffff',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardThumbnail: {
    position: 'relative' as const,
    height: '200px',
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  cardOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  overlayButton: {
    width: '48px',
    height: '48px',
    background: '#ffffff',
    color: '#3b82f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
  },
  cardContent: {
    padding: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '8px',
  },
  cardMeta: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '16px',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    background: '#f1f5f9',
    color: '#475569',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'background 0.2s',
  },
  deleteButton: {
    background: '#fee2e2',
    color: '#dc2626',
  },
};
