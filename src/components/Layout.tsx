import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Layout as LayoutIcon, User, Upload } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/templates', icon: LayoutIcon, label: 'Templates' },
    { path: '/jd-uploads', icon: Upload, label: 'JD Uploads' },
    { path: '/resumes', icon: FileText, label: 'My Resumes' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <Link to="/" style={styles.logo}>
            <FileText size={28} color="#3b82f6" />
            <span style={styles.logoText}>Resume Builder</span>
          </Link>
          <div style={styles.navLinks}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {}),
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  nav: {
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  navContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: 700,
    fontSize: '20px',
    color: '#1e293b',
  },
  logoText: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    gap: '8px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    color: '#64748b',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  navLinkActive: {
    background: '#eff6ff',
    color: '#3b82f6',
  },
  main: {
    flex: 1,
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    padding: '32px 24px',
  },
};
