import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Download, Sparkles, Zap, Shield } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: 'Professional Templates',
      description: 'Choose from beautifully designed templates crafted by experts',
    },
    {
      icon: Zap,
      title: 'Quick & Easy',
      description: 'Create your resume in minutes with our intuitive editor',
    },
    {
      icon: Shield,
      title: 'ATS-Friendly',
      description: 'All templates are optimized for Applicant Tracking Systems',
    },
  ];

  const stats = [
    { label: 'Resumes Created', value: '10,000+' },
    { label: 'Templates Available', value: '25+' },
    { label: 'Success Rate', value: '95%' },
  ];

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Build Your Perfect Resume in Minutes
          </h1>
          <p style={styles.heroSubtitle}>
            Create professional, ATS-friendly resumes with our easy-to-use builder.
            Stand out from the crowd and land your dream job.
          </p>
          <div style={styles.heroButtons}>
            <button
              style={styles.primaryButton}
              onClick={() => navigate('/editor')}
            >
              <Plus size={20} />
              Create New Resume
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => navigate('/templates')}
            >
              <FileText size={20} />
              Browse Templates
            </button>
          </div>
        </div>
        <div style={styles.heroImage}>
          <img
            src="https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Professional workspace"
            style={styles.image}
          />
        </div>
      </section>

      <section style={styles.stats}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose Our Resume Builder?</h2>
        <div style={styles.featureGrid}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} style={styles.featureCard}>
                <div style={styles.featureIcon}>
                  <Icon size={32} color="#3b82f6" />
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
        <p style={styles.ctaSubtitle}>
          Join thousands of job seekers who have successfully landed their dream jobs
        </p>
        <button
          style={styles.ctaButton}
          onClick={() => navigate('/editor')}
        >
          <Plus size={20} />
          Create Your Resume Now
        </button>
      </section>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '80px',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'center',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 800,
    lineHeight: 1.2,
    background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#64748b',
    lineHeight: 1.6,
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    marginTop: '16px',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    background: '#ffffff',
    color: '#3b82f6',
    border: '2px solid #3b82f6',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'all 0.2s',
  },
  heroImage: {
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
  },
  statCard: {
    background: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 800,
    color: '#3b82f6',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: 500,
  },
  features: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '48px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 800,
    textAlign: 'center' as const,
    color: '#1e293b',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
  },
  featureCard: {
    background: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  featureIcon: {
    width: '64px',
    height: '64px',
    background: '#eff6ff',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '12px',
  },
  featureDescription: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: 1.6,
  },
  cta: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    padding: '64px',
    borderRadius: '24px',
    textAlign: 'center' as const,
    color: '#ffffff',
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: 800,
    marginBottom: '16px',
  },
  ctaSubtitle: {
    fontSize: '18px',
    opacity: 0.9,
    marginBottom: '32px',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    background: '#ffffff',
    color: '#3b82f6',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
};
