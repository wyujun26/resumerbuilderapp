import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate software engineer with a love for creating elegant solutions to complex problems.',
  });

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert('Profile saved successfully!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Profile</h1>
        <p style={styles.subtitle}>Manage your personal information</p>
      </div>

      <div style={styles.content}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            <User size={64} color="#3b82f6" />
          </div>
          <button style={styles.uploadButton}>Upload Photo</button>
        </div>

        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <User size={18} />
              Full Name
            </label>
            <input
              type="text"
              style={styles.input}
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Mail size={18} />
              Email Address
            </label>
            <input
              type="email"
              style={styles.input}
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Phone size={18} />
              Phone Number
            </label>
            <input
              type="tel"
              style={styles.input}
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <MapPin size={18} />
              Location
            </label>
            <input
              type="text"
              style={styles.input}
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Bio</label>
            <textarea
              style={styles.textarea}
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>

          <button style={styles.saveButton} onClick={handleSave}>
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>5</div>
          <div style={styles.statLabel}>Resumes Created</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>12</div>
          <div style={styles.statLabel}>Downloads</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>3</div>
          <div style={styles.statLabel}>Templates Used</div>
        </div>
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
    marginBottom: '8px',
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
  content: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '32px',
  },
  avatarSection: {
    background: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '24px',
  },
  avatar: {
    width: '128px',
    height: '128px',
    background: '#eff6ff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    padding: '10px 20px',
    background: '#3b82f6',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
  },
  form: {
    background: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#475569',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#1e293b',
  },
  textarea: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#1e293b',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: '#ffffff',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 600,
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  statCard: {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#3b82f6',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: 500,
  },
};
