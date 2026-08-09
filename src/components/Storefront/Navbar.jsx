import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, ShoppingCart, User, Phone, MessageSquare, ShieldCheck, Heart, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, setViewMode, toggleCartOpen, layoutOverride }) {
  const { layout: contextLayout, products, cart, userRole, storeSettings } = useContext(AppContext);
  const layout = layoutOverride || contextLayout;
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const suggestionRef = useRef(null);

  const [currentCategory, setCurrentCategory] = useState(() => (typeof window !== 'undefined' && window.__pendingCategory) ? window.__pendingCategory : 'All');

  useEffect(() => {
    const handleCategoryChange = (e) => {
      if (e && e.detail) {
        setCurrentCategory(e.detail);
      }
    };
    window.addEventListener('selectCategory', handleCategoryChange);
    return () => window.removeEventListener('selectCategory', handleCategoryChange);
  }, []);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simple Typo Tolerance & Synonym search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const normalized = query.toLowerCase().trim();

    // Synonym map: e.g. "cot" -> "hospital bed", "diaper" -> "incontinence", "bp" -> "blood pressure"
    const synonyms = {
      'cot': 'bed',
      'cots': 'bed',
      'beds': 'bed',
      'diaper': 'incontinence',
      'diapers': 'incontinence',
      'pads': 'incontinence',
      'bp': 'monitor',
      'sphygmomanometer': 'monitor',
      'wheel chair': 'wheelchair',
      'chairs': 'wheelchair',
      'walker': 'mobility',
      'temp': 'thermometer',
      'fever': 'thermometer'
    };

    let searchTarget = normalized;
    Object.keys(synonyms).forEach(syn => {
      if (normalized.includes(syn)) {
        searchTarget = synonyms[syn];
      }
    });

    // Match products (typo tolerance modeled as character overlap / substring check)
    const matches = products.filter(p => {
      const titleMatch = p.title.toLowerCase().includes(searchTarget);
      const descMatch = p.description.toLowerCase().includes(searchTarget);
      const tagMatch = p.tags.some(t => t.toLowerCase().includes(searchTarget));
      const brandMatch = p.brand.toLowerCase().includes(searchTarget);
      const categoryMatch = p.category.toLowerCase().includes(searchTarget);

      return titleMatch || descMatch || tagMatch || brandMatch || categoryMatch;
    });

    setSuggestions(matches.slice(0, 5));
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery('');
    setShowSuggestions(false);
    setActiveTab('catalog');
    
    // Dispatch custom event to select product and open its detail page
    setTimeout(() => {
      const event = new CustomEvent('selectProduct', { detail: product.id });
      window.dispatchEvent(event);
    }, 50);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      setShowSuggestions(false);
      setActiveTab('catalog');
      setTimeout(() => {
        const event = new CustomEvent('filterSearch', { detail: searchQuery });
        window.dispatchEvent(event);
      }, 50);
    }
  };

  const cartItemsCount = cart.reduce((acc, curr) => acc + curr.qty, 0);

  return (
    <header className="animate-fade-in">
      {!layout?.hiddenSections?.includes('announcementBar') && (
        <div style={{ backgroundColor: 'hsl(var(--primary))', color: 'white', fontSize: '0.8rem', padding: '0.4rem 1rem', textAlign: 'center', fontWeight: '500' }}>
          {layout.announcementBar}
        </div>
      )}

      {/* Main Navigation Row */}
      <div style={{ borderBottom: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
            <span style={{ display: 'inline-block', backgroundColor: 'hsl(var(--primary))', color: 'white', borderRadius: '8px', padding: '6px' }}>
              <ShieldCheck size={24} />
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(var(--primary))', letterSpacing: '-0.03em' }}>
              {layout?.logoText || storeSettings?.storeName || 'AeonCare'}
            </span>
          </div>

          {/* Autocomplete Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '500px', position: 'relative' }} ref={suggestionRef}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search wheelchairs, electric beds, BP monitors (e.g., 'cot')..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                style={{ paddingLeft: '2.5rem', borderRadius: '99px', border: '1px solid hsl(var(--border))' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
            </div>

            {/* Suggestions Modal */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-box">
                {suggestions.map(p => (
                  <div key={p.id} className="suggestion-item" onClick={() => handleSuggestionClick(p)}>
                    <img src={p.image} alt={p.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: 'hsl(var(--text-main))' }}>{p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
                        {p.category} • <span style={{ color: 'hsl(var(--primary))', fontWeight: '600' }}>₹{p.price}</span>
                        {p.isRentable && <span style={{ color: 'hsl(var(--accent))', marginLeft: '6px' }}>[Rentable]</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Support Widget & Action Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <a href={`tel:${storeSettings?.storePhone || '+919840123456'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(var(--text-main))' }} className="btn-ghost btn" title="Call Us Support">
              <Phone size={18} style={{ color: 'hsl(var(--primary))' }} />
              <span className="hide-mobile">{storeSettings?.storePhone ? `Call ${storeSettings.storePhone}` : 'Call Support'}</span>
            </a>

            <button 
              className="btn btn-ghost" 
              style={{ position: 'relative', padding: '0.5rem' }} 
              onClick={() => setActiveTab('userPortal')}
              title="My Account"
            >
              <User size={22} style={{ color: 'hsl(var(--text-main))' }} />
            </button>

            <button 
              className="btn btn-primary" 
              style={{ position: 'relative', borderRadius: '99px', padding: '0.6rem 1rem' }} 
              onClick={toggleCartOpen}
            >
              <ShoppingCart size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Cart</span>
              {cartItemsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: 'hsl(var(--accent))',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        {!layout?.hiddenSections?.includes('navigation_menu') && (
          <div style={{ borderTop: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', gap: '2rem', overflowX: 'auto' }}>
              {(layout.navigationTabs || [
                { id: 'home', label: 'Home', collection: 'home' },
                { id: 'catalog', label: 'Shop Catalog', collection: 'All' },
                { id: 'hospital_bed', label: 'Hospital Bed Collection', collection: 'Hospital Bed' },
                { id: 'walkers_stick', label: 'Walkers & Walkstick Collection', collection: 'Walkers & Walkstick' },
                { id: 'services', label: 'Care Services', collection: 'services' },
                { id: 'blog', label: 'Blog & FAQs', collection: 'blog' },
                { id: 'userPortal', label: 'My Account', collection: 'userPortal' }
              ]).map((tab, idx) => {
                let target = tab.collection;
                const labelLower = (tab.label || '').toLowerCase();
                
                // Smart fallback if target is unassigned or still legacy tab.id
                if (!target || target === tab.id) {
                  if (labelLower.includes('hospital bed') || labelLower.includes('bed collection') || labelLower.includes('hospital cot')) {
                    target = 'Hospital Bed';
                  } else if (labelLower.includes('walker') || labelLower.includes('walkstick') || labelLower.includes('walking stick')) {
                    target = 'Walkers & Walkstick';
                  } else if (labelLower.includes('wheelchair')) {
                    target = 'Wheelchairs';
                  } else if (labelLower.includes('services') || labelLower.includes('care services')) {
                    target = 'services';
                  } else if (labelLower.includes('home')) {
                    target = 'home';
                  } else if (labelLower.includes('blog') || labelLower.includes('faq')) {
                    target = 'blog';
                  } else if (labelLower.includes('account') || labelLower.includes('userportal')) {
                    target = 'userPortal';
                  } else if (labelLower.includes('all') || labelLower.includes('shop') || labelLower.includes('catalog')) {
                    target = 'All';
                  } else {
                    target = tab.id || 'All';
                  }
                }

                const handleNavClick = () => {
                  if (target === 'home' || target === 'services' || target === 'blog' || target === 'userPortal') {
                    setActiveTab(target);
                  } else {
                    const catTarget = target || 'All';
                    if (typeof window !== 'undefined') window.__pendingCategory = catTarget;
                    setCurrentCategory(catTarget);
                    setActiveTab('catalog');
                    window.dispatchEvent(new CustomEvent('selectCategory', { detail: catTarget }));
                  }
                };

                const isStorePage = target === 'home' || target === 'services' || target === 'blog' || target === 'userPortal';

                let isActive = false;
                if (isStorePage) {
                  isActive = activeTab === target;
                } else if (activeTab === 'catalog') {
                  const normCurr = (currentCategory || 'All').toLowerCase().replace(/[^a-z0-9]/g, '');
                  const normTgt = (target || 'All').toLowerCase().replace(/[^a-z0-9]/g, '');
                  const normLabel = labelLower.replace(/[^a-z0-9]/g, '');

                  if (normTgt === 'all' || normTgt === 'catalog' || tab.id === 'catalog' || normLabel.includes('allproducts') || normLabel.includes('shopcatalog')) {
                    isActive = normCurr === 'all' || normCurr === 'catalog';
                  } else {
                    isActive = normCurr === normTgt || 
                               (normCurr.length > 3 && normTgt.includes(normCurr)) || 
                               (normTgt.length > 3 && normCurr.includes(normTgt)) ||
                               (normCurr.startsWith('wheelchair') && normTgt.startsWith('wheelchair')) ||
                               (normCurr.startsWith('hospitalbed') && normTgt.startsWith('hospitalbed')) ||
                               (normCurr.includes('walker') && normTgt.includes('walker'));
                  }
                }

                return (
                  <button
                    key={tab.id || idx}
                    onClick={handleNavClick}
                    style={{
                      padding: '1rem 0.25rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                      borderBottom: isActive ? '3px solid hsl(var(--primary))' : '3px solid transparent',
                      transition: 'all var(--transition-fast)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Mobile Bottom Navigation Bar (<768px viewport) */}
      <div className="mobile-bottom-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0.5rem 0.25rem', zIndex: 999, boxShadow: '0 -4px 12px rgba(0,0,0,0.06)'
      }}>
        <button 
          onClick={() => setActiveTab('home')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: activeTab === 'home' ? 'hsl(var(--primary))' : '#64748b', fontSize: '0.7rem', fontWeight: '600' }}
        >
          <ShieldCheck size={20} />
          <span>Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('catalog')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: activeTab === 'catalog' ? 'hsl(var(--primary))' : '#64748b', fontSize: '0.7rem', fontWeight: '600' }}
        >
          <Search size={20} />
          <span>Catalog</span>
        </button>

        <button 
          onClick={() => setActiveTab('userPortal')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: activeTab === 'userPortal' ? 'hsl(var(--primary))' : '#64748b', fontSize: '0.7rem', fontWeight: '600' }}
        >
          <User size={20} />
          <span>Account</span>
        </button>

        <button 
          onClick={toggleCartOpen}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#64748b', fontSize: '0.7rem', fontWeight: '600', position: 'relative' }}
        >
          <ShoppingCart size={20} />
          <span>Cart</span>
          {cartItemsCount > 0 && (
            <span style={{
              position: 'absolute', top: '-4px', right: '8px',
              backgroundColor: 'hsl(var(--accent))', color: 'white',
              borderRadius: '50%', width: '16px', height: '16px',
              fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700'
            }}>
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
