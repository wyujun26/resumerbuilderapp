import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  popular: boolean;
}

export default function Templates() {
  const navigate = useNavigate();

  const templates: Template[] = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean and contemporary design perfect for tech roles',
      thumbnail: 'https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=600',
      popular: true,
    },
    {
      id: 'classic',
      name: 'Classic Executive',
      description: 'Traditional layout ideal for corporate positions',
      thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
      popular: true,
    },
    {
      id: 'minimal',
      name: 'Minimal Elegance',
      description: 'Simple and elegant design that highlights your content',
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
      popular: false,
    },
    {
      id: 'creative',
      name: 'Creative Bold',
      description: 'Stand out with this unique and creative template',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
      popular: true,
    },
    {
      id: 'technical',
      name: 'Technical Pro',
      description: 'Perfect for developers and technical professionals',
      thumbnail: 'https://images.pexels.com/photos/4065906/pexels-photo-4065906.jpeg?auto=compress&cs=tinysrgb&w=600',
      popular: false,
    },
    {
      id: 'academic',
      name: 'Academic Scholar',
      description: 'Ideal for academic and research positions',
      thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
      popular: false,
    },
  ];

  const handleSelectTemplate = (templateId: string) => {
    navigate(`/editor?template=${templateId}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Resume Templates</h1>
        <p style={styles.subtitle}>
          Choose from our professionally designed templates
        </p>
      </div>

      <div style={styles.grid}>
        {templates.map((template) => (
          <div key={template.id} style={styles.card}>
            {template.popular && (
              <div style={styles.badge}>
                <Check size={14} />
                Popular
              </div>
            )}
            <div style={styles.cardImage}>
              <img
                src={template.thumbnail}
                alt={template.name}
                style={styles.image}
              />
              <div style={styles.overlay}>
                <button
                  style={styles.useButton}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  Use This Template
                </button>
              </div>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>{template.name}</h3>
              <p style={styles.cardDescription}>{template.description}</p>
            </div>
          </div>
        ))}
      </div>
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
    textAlign: 'center' as const,
    marginBottom: '16px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#64748b',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '32px',
  },
  card: {
    position: 'relative' as const,
    background: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  badge: {
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    background: '#3b82f6',
    color: '#ffffff',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    zIndex: 10,
  },
  cardImage: {
    position: 'relative' as const,
    height: '280px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  useButton: {
    padding: '12px 24px',
    background: '#ffffff',
    color: '#3b82f6',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 600,
    transition: 'transform 0.2s',
  },
  cardContent: {
    padding: '24px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '8px',
  },
  cardDescription: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: 1.6,
  },
};
