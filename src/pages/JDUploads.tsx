import React, { useState } from 'react';
import { Upload, Link as LinkIcon, FileText, Download, Eye, Trash2 } from 'lucide-react';

interface JobDescription {
  id: string;
  title: string;
  company: string;
  content: string;
  source: 'file' | 'url' | 'text';
  url?: string;
  createdAt: string;
}

function JDUploads() {
  const [jdList, setJdList] = useState<JobDescription[]>(() => {
    const saved = localStorage.getItem('jobDescriptions');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState<'file' | 'url' | 'text'>('file');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewingJD, setViewingJD] = useState<JobDescription | null>(null);

  const saveToLocalStorage = (jds: JobDescription[]) => {
    localStorage.setItem('jobDescriptions', JSON.stringify(jds));
    setJdList(jds);
  };

  const extractTextFromHTML = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const scripts = tempDiv.getElementsByTagName('script');
    const styles = tempDiv.getElementsByTagName('style');
    Array.from(scripts).forEach(script => script.remove());
    Array.from(styles).forEach(style => style.remove());
    
    let text = tempDiv.textContent || tempDiv.innerText || '';
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  };

  const extractJobInfo = (content: string): { title: string; company: string } => {
    const lines = content.split('\n').filter(line => line.trim());
    
    let title = 'Job Position';
    let company = 'Company';
    
    const titleKeywords = ['position', 'role', 'job title', 'title:', 'position:'];
    const companyKeywords = ['company', 'organization', 'employer', 'company:'];
    
    for (const line of lines.slice(0, 10)) {
      const lowerLine = line.toLowerCase();
      
      if (!title || title === 'Job Position') {
        for (const keyword of titleKeywords) {
          if (lowerLine.includes(keyword)) {
            title = line.replace(/^[^:]*:/, '').trim() || line.trim();
            break;
          }
        }
      }
      
      if (!company || company === 'Company') {
        for (const keyword of companyKeywords) {
          if (lowerLine.includes(keyword)) {
            company = line.replace(/^[^:]*:/, '').trim() || line.trim();
            break;
          }
        }
      }
    }
    
    if (title === 'Job Position' && lines.length > 0) {
      title = lines[0].substring(0, 50);
    }
    if (company === 'Company' && lines.length > 1) {
      company = lines[1].substring(0, 50);
    }
    
    return { title, company };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const { title, company } = extractJobInfo(content);
      
      const newJD: JobDescription = {
        id: Date.now().toString(),
        title,
        company,
        content,
        source: 'file',
        createdAt: new Date().toISOString()
      };
      
      saveToLocalStorage([...jdList, newJD]);
    };
    reader.readAsText(file);
  };

  const handleURLSubmit = async () => {
    if (!urlInput.trim()) return;
    
    setIsLoading(true);
    try {
      const accessToken = import.meta.env.VITE_PROXY_SERVER_ACCESS_TOKEN;
      
      const response = await fetch('https://proxy.chatandbuild.com/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          url: urlInput,
          method: 'GET',
          headers: {},
          body: {}
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch URL content');
      }

      const data = await response.text();
      const plainText = extractTextFromHTML(data);
      const { title, company } = extractJobInfo(plainText);
      
      const newJD: JobDescription = {
        id: Date.now().toString(),
        title,
        company,
        content: plainText,
        source: 'url',
        url: urlInput,
        createdAt: new Date().toISOString()
      };
      
      saveToLocalStorage([...jdList, newJD]);
      setUrlInput('');
    } catch (error) {
      console.error('Error fetching URL:', error);
      alert('Failed to fetch content from URL. Please try again or use text paste instead.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    
    const { title, company } = extractJobInfo(textInput);
    
    const newJD: JobDescription = {
      id: Date.now().toString(),
      title,
      company,
      content: textInput,
      source: 'text',
      createdAt: new Date().toISOString()
    };
    
    saveToLocalStorage([...jdList, newJD]);
    setTextInput('');
  };

  const handleDelete = (id: string) => {
    const updated = jdList.filter(jd => jd.id !== id);
    saveToLocalStorage(updated);
  };

  const handleDownload = (jd: JobDescription) => {
    const blob = new Blob([jd.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jd.title.replace(/\s+/g, '_')}_JD.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Job Description Uploads</h1>
        <p style={styles.subtitle}>Upload, extract, or paste job descriptions to tailor your resume</p>
      </div>

      <div style={styles.card}>
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('file')}
            style={{
              ...styles.tab,
              ...(activeTab === 'file' ? styles.tabActive : {}),
            }}
          >
            <Upload size={20} />
            <span>Upload File</span>
          </button>
          <button
            onClick={() => setActiveTab('url')}
            style={{
              ...styles.tab,
              ...(activeTab === 'url' ? styles.tabActive : {}),
            }}
          >
            <LinkIcon size={20} />
            <span>Extract from URL</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            style={{
              ...styles.tab,
              ...(activeTab === 'text' ? styles.tabActive : {}),
            }}
          >
            <FileText size={20} />
            <span>Paste Text</span>
          </button>
        </div>

        <div style={styles.tabContent}>
          {activeTab === 'file' && (
            <div style={styles.uploadArea}>
              <Upload size={48} color="#cbd5e1" />
              <label style={styles.uploadLabel}>
                <span style={styles.uploadLink}>Click to upload</span>
                <span style={styles.uploadText}> or drag and drop</span>
                <input
                  type="file"
                  style={styles.fileInput}
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </label>
              <p style={styles.uploadHint}>TXT, PDF, DOC up to 10MB</p>
            </div>
          )}

          {activeTab === 'url' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Posting URL</label>
              <div style={styles.inputGroup}>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/job-posting"
                  style={styles.input}
                  disabled={isLoading}
                />
                <button
                  onClick={handleURLSubmit}
                  disabled={isLoading || !urlInput.trim()}
                  style={{
                    ...styles.button,
                    ...(isLoading || !urlInput.trim() ? styles.buttonDisabled : {}),
                  }}
                >
                  {isLoading ? 'Extracting...' : 'Extract'}
                </button>
              </div>
              <p style={styles.hint}>
                Paste the URL of a job posting to automatically extract the description
              </p>
            </div>
          )}

          {activeTab === 'text' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Description Text</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste the job description here..."
                rows={10}
                style={styles.textarea}
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                style={{
                  ...styles.button,
                  ...styles.buttonFullWidth,
                  ...(!textInput.trim() ? styles.buttonDisabled : {}),
                }}
              >
                Save Description
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Saved Job Descriptions</h2>
        {jdList.length === 0 ? (
          <div style={styles.emptyState}>
            <FileText size={64} color="#e2e8f0" />
            <p style={styles.emptyText}>No job descriptions saved yet</p>
            <p style={styles.emptyHint}>Upload, extract, or paste a job description to get started</p>
          </div>
        ) : (
          <div style={styles.list}>
            {jdList.map((jd) => (
              <div key={jd.id} style={styles.listItem}>
                <div style={styles.listItemContent}>
                  <h3 style={styles.listItemTitle}>{jd.title}</h3>
                  <p style={styles.listItemCompany}>{jd.company}</p>
                  <div style={styles.listItemMeta}>
                    <span style={styles.badge}>{jd.source}</span>
                    <span style={styles.metaDivider}>•</span>
                    <span>{new Date(jd.createdAt).toLocaleDateString()}</span>
                    {jd.url && (
                      <>
                        <span style={styles.metaDivider}>•</span>
                        <a 
                          href={jd.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={styles.link}
                        >
                          <LinkIcon size={12} style={{ marginRight: '4px' }} />
                          Original Link
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <div style={styles.listItemActions}>
                  <button
                    onClick={() => setViewingJD(jd)}
                    style={{ ...styles.iconButton, ...styles.iconButtonBlue }}
                    title="View"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => handleDownload(jd)}
                    style={{ ...styles.iconButton, ...styles.iconButtonGreen }}
                    title="Download"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(jd.id)}
                    style={{ ...styles.iconButton, ...styles.iconButtonRed }}
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewingJD && (
        <div style={styles.modal} onClick={() => setViewingJD(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{viewingJD.title}</h2>
                <p style={styles.modalCompany}>{viewingJD.company}</p>
              </div>
              <button
                onClick={() => setViewingJD(null)}
                style={styles.modalClose}
              >
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <pre style={styles.modalText}>
                {viewingJD.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '30px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '32px',
  },
  tabContainer: {
    display: 'flex',
    gap: '8px',
    borderBottom: '2px solid #e2e8f0',
    marginBottom: '24px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'transparent',
    color: '#64748b',
    fontWeight: 500,
    fontSize: '15px',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6',
  },
  tabContent: {
    minHeight: '200px',
  },
  uploadArea: {
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    padding: '64px 32px',
    textAlign: 'center' as const,
    transition: 'border-color 0.2s',
    cursor: 'pointer',
  },
  uploadLabel: {
    cursor: 'pointer',
    display: 'block',
    marginTop: '16px',
  },
  uploadLink: {
    color: '#3b82f6',
    fontWeight: 500,
  },
  uploadText: {
    color: '#64748b',
  },
  fileInput: {
    display: 'none',
  },
  uploadHint: {
    fontSize: '14px',
    color: '#94a3b8',
    marginTop: '8px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#475569',
  },
  inputGroup: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  },
  button: {
    padding: '10px 24px',
    background: '#3b82f6',
    color: '#ffffff',
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '15px',
    transition: 'background 0.2s',
  },
  buttonFullWidth: {
    width: '100%',
    marginTop: '8px',
  },
  buttonDisabled: {
    background: '#cbd5e1',
    cursor: 'not-allowed',
  },
  hint: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '20px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '48px 24px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#64748b',
    marginTop: '16px',
    marginBottom: '8px',
  },
  emptyHint: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    transition: 'box-shadow 0.2s',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '4px',
  },
  listItemCompany: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '8px',
  },
  listItemMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#94a3b8',
  },
  badge: {
    textTransform: 'capitalize' as const,
    padding: '2px 8px',
    background: '#f1f5f9',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
  },
  metaDivider: {
    color: '#cbd5e1',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    color: '#3b82f6',
    fontSize: '14px',
  },
  listItemActions: {
    display: 'flex',
    gap: '8px',
    marginLeft: '16px',
  },
  iconButton: {
    padding: '8px',
    borderRadius: '8px',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonBlue: {
    color: '#3b82f6',
    background: 'transparent',
  },
  iconButtonGreen: {
    color: '#10b981',
    background: 'transparent',
  },
  iconButtonRed: {
    color: '#ef4444',
    background: 'transparent',
  },
  modal: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 1000,
  },
  modalContent: {
    background: '#ffffff',
    borderRadius: '12px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '24px',
    borderBottom: '1px solid #e2e8f0',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '4px',
  },
  modalCompany: {
    fontSize: '16px',
    color: '#64748b',
  },
  modalClose: {
    fontSize: '32px',
    color: '#94a3b8',
    background: 'transparent',
    padding: '0 8px',
    lineHeight: 1,
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto' as const,
    flex: 1,
  },
  modalText: {
    whiteSpace: 'pre-wrap' as const,
    fontFamily: 'inherit',
    fontSize: '15px',
    lineHeight: 1.6,
    color: '#475569',
    margin: 0,
  },
};

export default JDUploads;
