import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { HelpCircle, ChevronDown, BookOpen, User, Calendar, Tag, ArrowRight, Plus, Trash, Search, X, Sparkles, Edit3 } from 'lucide-react';

export default function BlogFAQ({ mode = 'all' }) {
  const { faqs, addFAQ, deleteFAQ, blogs, addBlog, deleteBlog } = useContext(AppContext);
  
  // View mode switcher: 'all' | 'faq' | 'blog'
  const [currentView, setCurrentView] = useState(mode);

  // Keep currentView synced if prop changes
  useEffect(() => {
    setCurrentView(mode);
  }, [mode]);
  
  // Local States
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('All');
  const [selectedBlogCategory, setSelectedBlogCategory] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Form States
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('Rentals');

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState('Caregiver Support');
  const [newBlogAuthor, setNewBlogAuthor] = useState('AeonCare Specialist');
  const [newBlogSummary, setNewBlogSummary] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');

  const faqCategories = ['All', 'Rentals', 'Shipping', 'Regulatory', 'Returns', 'Sanitization', 'Billing'];
  const blogCategories = ['All', 'Caregiver Support', 'Senior Wellness', 'Mobility & Transit', 'Clinical Guide'];

  // Filtering FAQs
  const filteredFaqs = faqs.filter(f => {
    const matchesCategory = selectedFaqCategory === 'All' || f.category === selectedFaqCategory;
    const matchesQuery = !searchQuery || 
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Filtering Blogs
  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = selectedBlogCategory === 'All' || b.category === selectedBlogCategory;
    const matchesQuery = !searchQuery || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const handleCreateFaq = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    addFAQ({
      question: newQuestion,
      answer: newAnswer,
      category: newFaqCategory
    });
    setNewQuestion('');
    setNewAnswer('');
    setShowFaqModal(false);
    alert('✅ FAQ item successfully published!');
  };

  const handleCreateBlog = (e) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogSummary.trim() || !newBlogContent.trim()) return;
    addBlog({
      title: newBlogTitle,
      category: newBlogCategory,
      author: newBlogAuthor,
      summary: newBlogSummary,
      content: newBlogContent,
      date: new Date().toISOString().split('T')[0]
    });
    setNewBlogTitle('');
    setNewBlogSummary('');
    setNewBlogContent('');
    setShowBlogModal(false);
    alert('✅ Blog Article published successfully!');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem', flex: 1 }} className="animate-fade-in">
      
      {/* Top Banner & Creation Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid hsl(var(--border))',
        paddingBottom: '1.5rem'
      }}>
        <div>
          <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>Healthcare Knowledge Base</span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'hsl(var(--text-main))' }}>
            Caregiver Blog & Help Center
          </h1>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.95rem' }}>
            Explore certified medical articles, equipment setup guides, and quick answers to your questions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-outline"
            onClick={() => setShowFaqModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}
          >
            <Plus size={16} /> ➕ Create FAQ
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowBlogModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}
          >
            <Edit3 size={16} /> ✍️ Create Blog Article
          </button>
        </div>
      </div>

      {/* Global Search Bar & View Mode Switcher */}
      {!selectedBlog && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
          
          {/* Sub-view navigation tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'hsl(var(--card))', padding: '4px', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}>
            <button 
              onClick={() => setCurrentView('all')}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', border: 'none', cursor: 'pointer', backgroundColor: currentView === 'all' ? 'hsl(var(--primary))' : 'transparent', color: currentView === 'all' ? 'white' : 'hsl(var(--text-muted))' }}
            >
              📚 All Knowledge Base
            </button>
            <button 
              onClick={() => setCurrentView('faq')}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', border: 'none', cursor: 'pointer', backgroundColor: currentView === 'faq' ? 'hsl(var(--primary))' : 'transparent', color: currentView === 'faq' ? 'white' : 'hsl(var(--text-muted))' }}
            >
              ❓ Help & FAQs Only
            </button>
            <button 
              onClick={() => setCurrentView('blog')}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', border: 'none', cursor: 'pointer', backgroundColor: currentView === 'blog' ? 'hsl(var(--primary))' : 'transparent', color: currentView === 'blog' ? 'white' : 'hsl(var(--text-muted))' }}
            >
              ✍️ Caregiver Blog Only
            </button>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
            <input 
              type="text" 
              className="form-input"
              placeholder="Search FAQs, articles, rental terms, or equipment guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.75rem', paddingRight: '2rem', height: '48px', fontSize: '0.95rem', borderRadius: '24px' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'hsl(var(--text-muted))' }}>
                <X size={16} />
              </button>
            )}
          </div>

        </div>
      )}

      {/* Main View switching between Blog Detail vs Dashboard */}
      {selectedBlog ? (
        /* Blog Detail View */
        <div style={{ maxWidth: '850px', margin: '0 auto', backgroundColor: 'hsl(var(--card))', padding: '2.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)', border: '1px solid hsl(var(--border))' }}>
          <button 
            className="btn btn-outline" 
            onClick={() => setSelectedBlog(null)} 
            style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}
          >
            ← Back to Knowledge Library
          </button>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary">{selectedBlog.category}</span>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={14} /> Published {selectedBlog.date}
            </span>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1rem', color: 'hsl(var(--text-main))', lineHeight: '1.3' }}>
            {selectedBlog.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                <User size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'hsl(var(--text-main))', display: 'block' }}>{selectedBlog.author}</span>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>AeonCare Certified Clinical Contributor</span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (window.confirm('Delete this blog article?')) {
                  deleteBlog(selectedBlog.id);
                  setSelectedBlog(null);
                }
              }}
              style={{ color: '#ef4444', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Trash size={14} /> Delete Post
            </button>
          </div>

          {/* Body Content */}
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'hsl(var(--text-main))', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ fontWeight: '600', fontSize: '1.2rem', color: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary) / 0.05)', padding: '1rem 1.25rem', borderRadius: '8px', borderLeft: '4px solid hsl(var(--primary))' }}>
              {selectedBlog.summary}
            </p>
            <p style={{ whiteSpace: 'pre-line' }}>
              {selectedBlog.content}
            </p>
            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'hsl(var(--text-muted-light) / 0.3)', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem', color: 'hsl(var(--text-main))' }}>🩺 Need Clinical Assistance?</h4>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', margin: 0 }}>
                Speak directly with our home medical equipment specialists for personalized cot, wheelchair, and oxygen setup consultations. Call us at <strong>+91 98401 23456</strong>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Blog & FAQs Flexible Column Layout */
        <div style={{ display: 'grid', gridTemplateColumns: currentView === 'all' ? 'repeat(auto-fit, minmax(450px, 1fr))' : '1fr', gap: '3rem', maxWidth: currentView === 'all' ? '1280px' : '900px', margin: '0 auto' }}>
          
          {/* FAQ Column (Shown if currentView === 'all' || currentView === 'faq') */}
          {(currentView === 'all' || currentView === 'faq') && (
            <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-accent" style={{ marginBottom: '0.35rem' }}>Help Desk</span>
                <h2 style={{ fontSize: '1.65rem', fontWeight: '800' }}>Frequently Asked Questions ({filteredFaqs.length})</h2>
              </div>
              <button 
                className="btn btn-ghost" 
                onClick={() => setShowFaqModal(true)} 
                style={{ fontSize: '0.8rem', color: 'hsl(var(--primary))', fontWeight: '700' }}
              >
                + Add Question
              </button>
            </div>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {faqCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedFaqCategory(cat)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    border: '1px solid',
                    borderColor: selectedFaqCategory === cat ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                    backgroundColor: selectedFaqCategory === cat ? 'hsl(var(--primary))' : 'hsl(var(--card))',
                    color: selectedFaqCategory === cat ? 'white' : 'hsl(var(--text-main))',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Accordions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredFaqs.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'hsl(var(--text-muted))', backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px dashed hsl(var(--border))' }}>
                  No FAQ questions found matching your filter criteria.
                </div>
              ) : (
                filteredFaqs.map(faq => {
                  const isOpen = activeFaq === faq.id;
                  return (
                    <div key={faq.id} className={`faq-accordion ${isOpen ? 'open' : ''}`} style={{ borderRadius: '10px', border: '1px solid', borderColor: isOpen ? 'hsl(var(--primary) / 0.4)' : 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))', overflow: 'hidden' }}>
                      <div 
                        className="faq-header" 
                        onClick={() => toggleFaq(faq.id)}
                        style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: isOpen ? 'hsl(var(--primary))' : 'hsl(var(--text-main))', fontWeight: '700', fontSize: '0.95rem' }}>
                          <HelpCircle size={18} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                          {faq.question}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', fontWeight: 'bold' }}>{faq.category}</span>
                          <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)' }} />
                        </div>
                      </div>
                      
                      {isOpen && (
                        <div style={{ padding: '0 1rem 1rem 1rem', borderTop: '1px solid hsl(var(--border))', paddingTop: '0.75rem' }}>
                          <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', lineHeight: '1.6', margin: 0 }}>
                            {faq.answer}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Delete this FAQ item?')) deleteFAQ(faq.id);
                              }}
                              style={{ color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                            >
                              <Trash size={12} /> Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          )}

          {/* Blogs Column (Shown if currentView === 'all' || currentView === 'blog') */}
          {(currentView === 'all' || currentView === 'blog') && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>Caregiver Library</span>
                <h2 style={{ fontSize: '1.65rem', fontWeight: '800' }}>Articles & Clinical Guides ({filteredBlogs.length})</h2>
              </div>
              <button 
                className="btn btn-ghost" 
                onClick={() => setShowBlogModal(true)} 
                style={{ fontSize: '0.8rem', color: 'hsl(var(--primary))', fontWeight: '700' }}
              >
                + Write Article
              </button>
            </div>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {blogCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedBlogCategory(cat)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    border: '1px solid',
                    borderColor: selectedBlogCategory === cat ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                    backgroundColor: selectedBlogCategory === cat ? 'hsl(var(--primary))' : 'hsl(var(--card))',
                    color: selectedBlogCategory === cat ? 'white' : 'hsl(var(--text-main))',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredBlogs.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'hsl(var(--text-muted))', backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px dashed hsl(var(--border))' }}>
                  No articles found matching your criteria.
                </div>
              ) : (
                filteredBlogs.map(post => (
                  <div key={post.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
                      <span className="badge badge-secondary">{post.category}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Calendar size={12} /> {post.date}
                      </span>
                    </div>

                    <h3 
                      style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.5rem', color: 'hsl(var(--text-main))', cursor: 'pointer', lineHeight: '1.3' }}
                      onClick={() => setSelectedBlog(post)}
                    >
                      {post.title}
                    </h3>
                    
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginBottom: '1rem', lineHeight: '1.5' }}>
                      {post.summary}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid hsl(var(--border))', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--text-main))' }}>By {post.author}</span>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button 
                          onClick={() => {
                            if (window.confirm('Delete this article?')) deleteBlog(post.id);
                          }}
                          style={{ color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          <Trash size={14} />
                        </button>
                        <button 
                          onClick={() => setSelectedBlog(post)} 
                          style={{ color: 'hsl(var(--primary))', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
                        >
                          Read Guide <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          )}

        </div>
      )}

      {/* ================= MODAL: CREATE FAQ ================= */}
      {showFaqModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="animate-fade-in" style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '550px', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={20} style={{ color: '#2563eb' }} /> Add New FAQ Item
              </h3>
              <button onClick={() => setShowFaqModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateFaq}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">FAQ Category</label>
                <select className="form-input" value={newFaqCategory} onChange={(e) => setNewFaqCategory(e.target.value)}>
                  {faqCategories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Question Text</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. What is the minimum rental period for hospital beds?"
                  value={newQuestion} 
                  onChange={(e) => setNewQuestion(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Answer Description</label>
                <textarea 
                  className="form-input" 
                  required 
                  rows={4}
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="Provide clear step-by-step instructions or policy answers..."
                  value={newAnswer} 
                  onChange={(e) => setNewAnswer(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowFaqModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE BLOG ARTICLE ================= */}
      {showBlogModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="animate-fade-in" style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '650px', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} style={{ color: '#2563eb' }} /> Publish Clinical Blog Guide
              </h3>
              <button onClick={() => setShowBlogModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBlog}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Article Category</label>
                  <select className="form-input" value={newBlogCategory} onChange={(e) => setNewBlogCategory(e.target.value)}>
                    {blogCategories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Author Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. Dr. Ananya Sen"
                    value={newBlogAuthor} 
                    onChange={(e) => setNewBlogAuthor(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Article Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. How to Clean and Maintain Oxygen Concentrators at Home"
                  value={newBlogTitle} 
                  onChange={(e) => setNewBlogTitle(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Short Summary</label>
                <textarea 
                  className="form-input" 
                  required 
                  rows={2}
                  style={{ fontFamily: 'inherit' }}
                  placeholder="A 2-sentence key highlight for search and card previews..."
                  value={newBlogSummary} 
                  onChange={(e) => setNewBlogSummary(e.target.value)}
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Full Article Content</label>
                <textarea 
                  className="form-input" 
                  required 
                  rows={6}
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="Write comprehensive guidelines, step-by-step clinical tips, and equipment recommendations..."
                  value={newBlogContent} 
                  onChange={(e) => setNewBlogContent(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowBlogModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Guide Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
