import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  FileText, Folder, UploadCloud, Search, Plus, Trash2, 
  Copy, Check, BookOpen, HelpCircle, Edit3, Eye, 
  Download, Tag, Sparkles, ShieldCheck, CheckCircle2,
  FileCheck, Layers, ChevronRight, X
} from 'lucide-react';

export default function ContentCMS() {
  const { blogs, addBlog, deleteBlog, faqs, addFAQ, deleteFAQ } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('files'); // 'files' | 'pages' | 'blog' | 'faq'

  // Files State
  const [fileCategoryFilter, setFileCategoryFilter] = useState('All');
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [copiedFileId, setCopiedFileId] = useState(null);

  const [filesList, setFilesList] = useState([
    { id: 'f1', name: 'AeonCare_ICU_Bed_5Function_Manual.pdf', type: 'PDF Manual', size: '2.4 MB', date: '2026-07-10', category: 'Product Manuals', url: 'https://aeoncare.in/files/ICU_Bed_Manual.pdf' },
    { id: 'f2', name: 'Oxygen_Concentrator_10L_Prescription_Form.pdf', type: 'PDF Form', size: '850 KB', date: '2026-07-12', category: 'Prescription Forms', url: 'https://aeoncare.in/files/Oxy_Prescription_Form.pdf' },
    { id: 'f3', name: 'CDSCO_Medical_Device_License_33AAAA.pdf', type: 'Certificate', size: '1.8 MB', date: '2026-06-01', category: 'Certificates', url: 'https://aeoncare.in/files/CDSCO_License.pdf' },
    { id: 'f4', name: 'Home_Equipment_Rental_Terms_2026.pdf', type: 'Legal Doc', size: '1.1 MB', date: '2026-07-01', category: 'Legal Agreements', url: 'https://aeoncare.in/files/Rental_Terms_2026.pdf' },
    { id: 'f5', name: 'AeonCare_Product_Catalog_Brochure.pdf', type: 'Brochure', size: '5.6 MB', date: '2026-07-15', category: 'Brochures', url: 'https://aeoncare.in/files/Catalog_Brochure.pdf' }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState('Product Manuals');

  // Pages & Legal Docs State
  const [pagesList, setPagesList] = useState([
    { id: 'p1', title: 'Terms & Conditions of Equipment Sale & Rental', slug: '/pages/terms', status: 'Published', lastUpdated: '2026-07-01', views: 420, content: 'All medical devices sold or rented through AeonCare are inspected for clinical safety and certified under CDSCO guidelines...' },
    { id: 'p2', title: 'Privacy Policy & Patient Data Security', slug: '/pages/privacy', status: 'Published', lastUpdated: '2026-06-20', views: 310, content: 'AeonCare strictly adheres to Indian HIPAA data protection standards. Patient health prescriptions and billing records are stored securely.' },
    { id: 'p3', title: 'Home Setup & Delivery Service Level Agreement', slug: '/pages/delivery-sla', status: 'Published', lastUpdated: '2026-07-14', views: 580, content: 'Chennai metropolitan deliveries are executed within 4 to 8 hours. Emergency oxygen concentrator dispatches are prioritized 24/7.' },
    { id: 'p4', title: 'CDSCO Clinical Compliance Disclaimer', slug: '/pages/cdsco-disclaimer', status: 'Draft', lastUpdated: '2026-07-18', views: 45, content: 'Equipment rental requires verified physician prescriptions where mandated by Indian Drug Controller authorities.' }
  ]);

  const [editingPage, setEditingPage] = useState(null);

  // New Blog Modal State
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Home Care');
  const [blogAuthor, setBlogAuthor] = useState('Dr. S. Ranganathan');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');

  // New FAQ State
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  // File Upload Action
  const handleUploadFile = (e) => {
    e.preventDefault();
    if (!newFileName) return;
    const newFile = {
      id: `f-${Date.now()}`,
      name: newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.pdf`,
      type: 'PDF Document',
      size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
      date: new Date().toISOString().split('T')[0],
      category: newFileCategory,
      url: `https://aeoncare.in/files/${newFileName.replace(/\s+/g, '_')}.pdf`
    };
    setFilesList([newFile, ...filesList]);
    setShowUploadModal(false);
    setNewFileName('');
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedFileId(id);
    setTimeout(() => setCopiedFileId(null), 2500);
  };

  const handleDeleteFile = (id) => {
    setFilesList(prev => prev.filter(f => f.id !== id));
  };

  // Add Blog Action
  const handleCreateBlog = (e) => {
    e.preventDefault();
    if (!blogTitle || !blogSummary) return;
    addBlog({
      title: blogTitle,
      category: blogCategory,
      author: blogAuthor,
      summary: blogSummary,
      content: blogContent || blogSummary
    });
    setShowBlogModal(false);
    setBlogTitle('');
    setBlogSummary('');
    setBlogContent('');
  };

  // Add FAQ Action
  const handleCreateFAQ = (e) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) return;
    addFAQ({
      question: faqQuestion,
      answer: faqAnswer
    });
    setShowFaqModal(false);
    setFaqQuestion('');
    setFaqAnswer('');
  };

  // Filter Files
  const filteredFiles = filesList.filter(f => {
    const matchesCategory = fileCategoryFilter === 'All' || f.category === fileCategoryFilter;
    const matchesSearch = f.name.toLowerCase().includes(fileSearchQuery.toLowerCase()) || f.category.toLowerCase().includes(fileSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '0 0.5rem 3rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookOpen size={24} style={{ color: '#0d9488' }} /> Content & Files CMS
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
            Manage clinical PDF brochures, patient prescription disclaimers, store legal policies, caregiver blog articles, and helpdesk FAQs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {activeTab === 'files' && (
            <button className="btn btn-primary" onClick={() => setShowUploadModal(true)} style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UploadCloud size={18} /> Upload PDF / File
            </button>
          )}
          {activeTab === 'blog' && (
            <button className="btn btn-primary" onClick={() => setShowBlogModal(true)} style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> New Blog Post
            </button>
          )}
          {activeTab === 'faq' && (
            <button className="btn btn-primary" onClick={() => setShowFaqModal(true)} style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> Add New FAQ
            </button>
          )}
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', gap: '1.5rem' }}>
        {[
          { id: 'files', label: 'Files & Media Library', count: filesList.length, icon: Folder },
          { id: 'pages', label: 'Legal Pages & SLAs', count: pagesList.length, icon: FileText },
          { id: 'blog', label: 'Caregiver Blog Articles', count: blogs.length, icon: Edit3 },
          { id: 'faq', label: 'Helpdesk FAQs', count: faqs.length, icon: HelpCircle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 0.25rem',
                borderBottom: isActive ? '3px solid #0d9488' : '3px solid transparent',
                color: isActive ? '#0d9488' : '#64748b',
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                background: 'none',
                borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              <span style={{
                backgroundColor: isActive ? '#ccfbf1' : '#f1f5f9',
                color: isActive ? '#0f766e' : '#64748b',
                fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', fontWeight: '700'
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ----------------- TAB 1: FILES & MEDIA LIBRARY ----------------- */}
      {activeTab === 'files' && (
        <div>
          {/* Controls Bar */}
          <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '400px' }}>
              <Search size={18} style={{ color: '#94a3b8' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search files by name or category..." 
                value={fileSearchQuery} 
                onChange={(e) => setFileSearchQuery(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Category:</span>
              <select 
                className="form-input" 
                value={fileCategoryFilter} 
                onChange={(e) => setFileCategoryFilter(e.target.value)}
                style={{ fontSize: '0.85rem', width: '180px' }}
              >
                <option value="All">All Categories</option>
                <option value="Product Manuals">Product Manuals</option>
                <option value="Prescription Forms">Prescription Forms</option>
                <option value="Certificates">Certificates</option>
                <option value="Legal Agreements">Legal Agreements</option>
                <option value="Brochures">Brochures</option>
              </select>
            </div>
          </div>

          {/* Files Grid Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>File Name</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Size</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Uploaded Date</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Public URL Link</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      <Folder size={40} style={{ color: '#cbd5e1', marginBottom: '0.5rem' }} />
                      <div style={{ fontWeight: '700' }}>No files found matching criteria.</div>
                    </td>
                  </tr>
                ) : (
                  filteredFiles.map(file => (
                    <tr key={file.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}>
                      <td style={{ padding: '0.85rem 1.25rem', fontWeight: '700', color: '#1e293b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <FileText size={18} style={{ color: '#0d9488', flexShrink: 0 }} />
                          <span>{file.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                          {file.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{file.size}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{file.date}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <code style={{ fontSize: '0.75rem', color: '#0f766e', backgroundColor: '#f0fdf4', padding: '3px 8px', borderRadius: '4px' }}>
                          {file.url}
                        </code>
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => handleCopyUrl(file.url, file.id)}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            {copiedFileId === file.id ? <Check size={14} style={{ color: '#16a34a' }} /> : <Copy size={14} />}
                            {copiedFileId === file.id ? 'Copied!' : 'Copy Link'}
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm"
                            onClick={() => window.open(file.url, '_blank')}
                            title="Download/Preview"
                            style={{ color: '#0d9488', padding: '0.25rem 0.4rem' }}
                          >
                            <Download size={16} />
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDeleteFile(file.id)}
                            title="Delete File"
                            style={{ color: '#ef4444', padding: '0.25rem 0.4rem' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: LEGAL PAGES & SLAS ----------------- */}
      {activeTab === 'pages' && (
        <div style={{ display: 'grid', gridTemplateColumns: editingPage ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>
                Store Policies & Legal Pages ({pagesList.length})
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Live on Storefront Footer & Checkout</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {pagesList.map(page => (
                <div key={page.id} style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1e293b', marginBottom: '0.25rem' }}>
                      {page.title}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
                      <span style={{ fontFamily: 'monospace', color: '#0d9488' }}>{page.slug}</span>
                      <span>•</span>
                      <span>Last updated: {page.lastUpdated}</span>
                      <span>•</span>
                      <span>{page.views} views</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px',
                      backgroundColor: page.status === 'Published' ? '#dcfce7' : '#fef3c7',
                      color: page.status === 'Published' ? '#166534' : '#92400e'
                    }}>
                      {page.status}
                    </span>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => setEditingPage(page)}
                      style={{ fontSize: '0.75rem', fontWeight: '700' }}
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Page Drawer Pane */}
          {editingPage && (
            <div className="card animate-fade-in" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                  Editing: {editingPage.title}
                </h3>
                <button type="button" onClick={() => setEditingPage(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                setPagesList(prev => prev.map(p => p.id === editingPage.id ? editingPage : p));
                alert('Page content updated successfully!');
                setEditingPage(null);
              }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Page Title</label>
                  <input type="text" className="form-input" value={editingPage.title} onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>URL Slug</label>
                  <input type="text" className="form-input" value={editingPage.slug} onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Status</label>
                  <select className="form-input" value={editingPage.status} onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value })}>
                    <option value="Published">Published (Active)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Page Body Content (Markdown / HTML)</label>
                  <textarea className="form-input" rows="8" value={editingPage.content} onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })} style={{ fontSize: '0.85rem', lineHeight: '1.5' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setEditingPage(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ fontWeight: '700' }}>Save Changes</button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* ----------------- TAB 3: CAREGIVER BLOG ARTICLES ----------------- */}
      {activeTab === 'blog' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>
              Published Blog Articles ({blogs.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Displayed on Caregiver Blog Section</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {blogs.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No blog articles published yet.</div>
            ) : (
              blogs.map(blog => (
                <div key={blog.id} style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#ccfbf1', color: '#0f766e', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        {blog.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>By {blog.author || 'AeonCare Staff'} • {blog.date}</span>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.35rem' }}>{blog.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>{blog.summary}</p>
                  </div>

                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => deleteBlog(blog.id)}
                    style={{ color: '#ef4444', flexShrink: 0 }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ----------------- TAB 4: HELPDESK FAQS ----------------- */}
      {activeTab === 'faq' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>
              Patient & Equipment FAQs ({faqs.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Live on Storefront PDP & FAQ Page</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No FAQs added yet.</div>
            ) : (
              faqs.map(faq => (
                <div key={faq.id} style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <HelpCircle size={16} style={{ color: '#0d9488' }} /> Q: {faq.question}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', paddingLeft: '1.4rem' }}>
                      A: {faq.answer}
                    </div>
                  </div>

                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => deleteFAQ(faq.id)}
                    style={{ color: '#ef4444', flexShrink: 0 }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* UPLOAD FILE MODAL */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
          zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ backgroundColor: '#ffffff', maxWidth: '480px', width: '100%', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UploadCloud size={20} style={{ color: '#0d9488' }} /> Upload Clinical PDF / Document
              </h3>
              <button type="button" onClick={() => setShowUploadModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadFile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>Document Title / File Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Oxygen_Concentrator_Safety_Guide" 
                  value={newFileName} 
                  onChange={(e) => setNewFileName(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>Category</label>
                <select className="form-input" value={newFileCategory} onChange={(e) => setNewFileCategory(e.target.value)}>
                  <option value="Product Manuals">Product Manuals</option>
                  <option value="Prescription Forms">Prescription Forms</option>
                  <option value="Certificates">Certificates</option>
                  <option value="Legal Agreements">Legal Agreements</option>
                  <option value="Brochures">Brochures</option>
                </select>
              </div>

              <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '2rem 1rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                <UploadCloud size={36} style={{ color: '#0d9488', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1e293b' }}>Click to select or drag PDF file here</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Supports PDF, DOCX, PNG up to 25MB</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: '700' }}>Upload & Generate Link</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW BLOG MODAL */}
      {showBlogModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
          zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ backgroundColor: '#ffffff', maxWidth: '580px', width: '100%', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={20} style={{ color: '#0d9488' }} /> Create New Caregiver Article
              </h3>
              <button type="button" onClick={() => setShowBlogModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBlog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>Article Title *</label>
                <input type="text" className="form-input" required placeholder="e.g. Oxygen Therapy Guidelines for COPD Patients at Home" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Category</label>
                  <input type="text" className="form-input" value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Author Name</label>
                  <input type="text" className="form-input" value={blogAuthor} onChange={(e) => setBlogAuthor(e.target.value)} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>Short Summary *</label>
                <textarea className="form-input" rows="2" required placeholder="Brief excerpt for preview cards..." value={blogSummary} onChange={(e) => setBlogSummary(e.target.value)} />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>Full Article Body</label>
                <textarea className="form-input" rows="5" placeholder="Full article content..." value={blogContent} onChange={(e) => setBlogContent(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowBlogModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: '700' }}>Publish Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW FAQ MODAL */}
      {showFaqModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
          zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ backgroundColor: '#ffffff', maxWidth: '480px', width: '100%', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={20} style={{ color: '#0d9488' }} /> Add Patient FAQ
              </h3>
              <button type="button" onClick={() => setShowFaqModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateFAQ} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>Question *</label>
                <input type="text" className="form-input" required placeholder="e.g. Do you provide sanitized wheelchairs for rent?" value={faqQuestion} onChange={(e) => setFaqQuestion(e.target.value)} />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>Detailed Answer *</label>
                <textarea className="form-input" rows="4" required placeholder="Clear explanation for patients..." value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowFaqModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: '700' }}>Save FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
