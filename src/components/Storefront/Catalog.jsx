import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, Star, ShoppingCart, X, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

export default function Catalog({ selectedProductId, setSelectedProductId, initialSearchVal }) {
  const { products, addToCart, layout } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return (typeof window !== 'undefined' && window.__pendingCategory) ? window.__pendingCategory : 'All';
  });
  const [priceFilter, setPriceFilter] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewModeType, setViewModeType] = useState('grid'); // grid | list
  const [displayPerPage, setDisplayPerPage] = useState(() => String(layout?.productsPerPage || 20));
  const [currentPage, setCurrentPage] = useState(1);

  // Sync displayPerPage if admin changes layout setting
  useEffect(() => {
    if (layout?.productsPerPage) {
      setDisplayPerPage(String(layout.productsPerPage));
    }
  }, [layout?.productsPerPage]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, priceFilter, searchQuery, displayPerPage]);

  // Handle incoming searches or category selections from other pages
  useEffect(() => {
    const handleSelectCategory = (e) => {
      if (typeof window !== 'undefined') {
        window.__pendingCategory = e.detail;
      }
      setSelectedCategory(e.detail);
      setSearchQuery('');
      setPriceFilter('All');
      setSelectedBrand('All');
      setSelectedProductId(null);
    };

    const handleFilterSearch = (e) => {
      setSearchQuery(e.detail);
      setSelectedCategory('All');
      setPriceFilter('All');
      setSelectedBrand('All');
      setSelectedProductId(null);
    };

    window.addEventListener('selectCategory', handleSelectCategory);
    window.addEventListener('filterSearch', handleFilterSearch);

    return () => {
      window.removeEventListener('selectCategory', handleSelectCategory);
      window.removeEventListener('filterSearch', handleFilterSearch);
    };
  }, [setSelectedProductId]);

  // Sync search input if passed as prop
  useEffect(() => {
    if (initialSearchVal) {
      setSearchQuery(initialSearchVal);
    }
  }, [initialSearchVal]);

  const [selectedSubCategory, setSelectedSubCategory] = useState('All');

  const defaultCategories = [
    'All',
    'Hospital Bed',
    'Wheelchairs',
    'Walkers & Walkstick',
    'Home Care',
    'Mobility Aid',
    'Respiratory Care',
    'Diagnostics',
    'Rehab & Ortho',
    'Surgicals & PPE',
    'Hospital Supplies',
    'Mother & Baby Care'
  ];

  const categories = defaultCategories.includes(selectedCategory)
    ? defaultCategories
    : [...defaultCategories, selectedCategory];

  const brands = ['All', 'CareQuip', 'Vissco', 'Accu-Chek', 'Seni', 'Dyna', 'AEONCARE'];

  // Category Description Maps matching AeonCare DTC theme
  const categoryDescriptions = {
    'All': 'Discover our comprehensive catalog of premium medical and home-care products. Explore mobility solutions, diagnostics monitors, hospital cots and daily patient hygiene support.',
    'Hospital Bed': 'Discover manual and 5-function electric hospital beds, medical mattresses, guard rails, and ICU cot accessories for home recovery.',
    'Hospital Bed Collection': 'Discover manual and 5-function electric hospital beds, medical mattresses, guard rails, and ICU cot accessories for home recovery.',
    'Wheelchairs': 'Find lightweight folding wheelchairs, electric motorized wheelchairs, commode chairs, and mobility transit equipment.',
    'Wheelchair': 'Find lightweight folding wheelchairs, electric motorized wheelchairs, commode chairs, and mobility transit equipment.',
    'Walkers & Walkstick': 'Browse height-adjustable aluminum patient walkers, quad cane walking sticks, elbow crutches, and mobility balance aids.',
    'Walkers & Walkstick Collection': 'Browse height-adjustable aluminum patient walkers, quad cane walking sticks, elbow crutches, and mobility balance aids.',
    'Home Care': 'Discover hospital beds, bed accessories, incontinence diapers, and bathroom assist safety handles for patient comfort.',
    'Mobility Aid': 'Find lightweight folding wheelchairs, commode chairs, walkers, and transfer aids engineered for mobility assistance.',
    'Rehab & Ortho': 'Explore neck braces, lumbar supports, shoulder immobilizers, and rehabilitation aids.',
    'Medical Devices': 'Track blood pressure, body temperature, blood glucose, and respiratory oxygen metrics with certified monitors.',
    'Respiratory Care': 'Continuous 10L medical oxygen concentrators, nebulizers, pulse oximeters, and respiratory care equipment.',
    'Diagnostics': 'Digital blood pressure monitors, glucose meters, clinical thermometers, and diagnostic tools.',
    'Surgicals & PPE': 'Acquire certified high-filtration face masks, nitrile gloves, isolation gowns, and disinfectants.',
    'Hospital Supplies': 'Professional lab scrubs, clinical linen, and patient transfer stretchers.',
    'Mother & Baby Care': 'Gentle maternal hygiene, postpartum support, and infant care equipment.'
  };

  // Helper function to extract normalized collection names regardless of array or string format
  const getNormalizedCollections = (item) => {
    if (!item) return [];
    if (Array.isArray(item.collections)) {
      return item.collections.map(c => String(c).toLowerCase().trim()).filter(Boolean);
    }
    if (typeof item.collections === 'string' && item.collections.trim().length > 0) {
      return item.collections.split(',').map(c => c.toLowerCase().trim()).filter(Boolean);
    }
    return [];
  };

  // Filter logic
  const filteredProducts = products.filter(p => {
    if (!p) return false;

    const pCat = (p.category || '').toLowerCase().trim();
    const pTitle = (p.title || '').toLowerCase().trim();
    const pDesc = (p.description || '').toLowerCase().trim();
    const pBrand = (p.brand || '').toLowerCase().trim();
    const pCollections = getNormalizedCollections(p);
    const pTags = Array.isArray(p.tags) 
      ? p.tags.map(t => String(t || '').toLowerCase().trim()) 
      : (typeof p.tags === 'string' ? p.tags.split(',').map(t => t.toLowerCase().trim()) : []);

    // Category filter
    if (selectedCategory !== 'All') {
      const rawTarget = String(selectedCategory).toLowerCase().trim();
      const cleanTarget = rawTarget
        .replace(/\b(collection|collections|page|items|store|highlight|highlights)\b/gi, '')
        .trim();

      // 1. Direct explicit assignment match (check p.collections or p.category)
      const isExplicitInCol = pCat === rawTarget || pCat === cleanTarget || pCollections.some(c => c === rawTarget || c === cleanTarget || (cleanTarget.length > 2 && c.includes(cleanTarget)) || (c.length > 2 && cleanTarget.includes(c)));

      // Check if ANY products in the catalog have been explicitly linked to this collection by the admin
      const hasExplicitCollectionItems = products.some(prod => {
        if (!prod) return false;
        const cat = (prod.category || '').toLowerCase().trim();
        const colls = getNormalizedCollections(prod);
        return cat === rawTarget || cat === cleanTarget || colls.some(c => c === rawTarget || c === cleanTarget || (cleanTarget.length > 2 && c.includes(cleanTarget)) || (c.length > 2 && cleanTarget.includes(c)));
      });

      if (hasExplicitCollectionItems) {
        // Strict Mode: Admin manually selected products for this collection. Show ONLY assigned products!
        if (!isExplicitInCol) return false;
      } else {
        // Fallback Mode: No manual collection assignments. Fall back to smart keyword matching.
        let matched = false;

        if (cleanTarget.includes('hospital bed') || cleanTarget.includes('bed') || cleanTarget === 'cot') {
          matched = pTitle.includes('bed') || pTitle.includes('cot') || pTags.some(t => t.includes('bed') || t.includes('cot')) || pCollections.some(c => c.includes('bed') || c.includes('cot')) || pCat.includes('hospital bed');
        } else if (cleanTarget.includes('wheelchair') || cleanTarget.includes('wheel chair')) {
          matched = pTitle.includes('wheelchair') || pTitle.includes('wheel chair') || pTags.some(t => t.includes('wheelchair')) || pCollections.some(c => c.includes('wheelchair')) || pCat.includes('wheelchair');
        } else if (cleanTarget.includes('walker') || cleanTarget.includes('walkstick') || cleanTarget.includes('stick') || cleanTarget.includes('crutch')) {
          matched = pTitle.includes('walker') || pTitle.includes('stick') || pTitle.includes('crutch') || pTags.some(t => t.includes('walker') || t.includes('stick') || t.includes('crutch')) || pCollections.some(c => c.includes('walker') || c.includes('stick')) || pCat.includes('walker');
        } else {
          const catMatch = pCat === rawTarget || pCat === cleanTarget || (cleanTarget.length > 3 && pCat.includes(cleanTarget));
          const colMatch = pCollections.some(c => c === rawTarget || c === cleanTarget || (cleanTarget.length > 3 && c.includes(cleanTarget)));
          const tagMatch = pTags.some(t => t === rawTarget || t === cleanTarget || (cleanTarget.length > 3 && (t.includes(cleanTarget) || cleanTarget.includes(t))));
          matched = catMatch || colMatch || tagMatch;
        }

        if (!matched) return false;
      }
    }
    
    // Brand filter
    if (selectedBrand !== 'All' && pBrand.toUpperCase() !== String(selectedBrand).toUpperCase()) return false;
    
    // Price filter
    if (priceFilter !== 'All') {
      const priceNum = Number(p.price) || 0;
      if (priceFilter === 'under2k' && priceNum >= 2000) return false;
      if (priceFilter === '2k-10k' && (priceNum < 2000 || priceNum > 10000)) return false;
      if (priceFilter === 'over10k' && priceNum <= 10000) return false;
    }

    // Search query
    if (searchQuery.trim().length > 0) {
      const target = searchQuery.toLowerCase().trim();
      const titleMatch = pTitle.includes(target);
      const descMatch = pDesc.includes(target);
      const brandMatch = pBrand.includes(target);
      const catMatch = pCat.includes(target);
      const tagMatch = pTags.some(t => t.includes(target));
      if (!titleMatch && !descMatch && !brandMatch && !catMatch && !tagMatch) return false;
    }

    return true;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'discount') {
      const discountA = Math.round(((a.mrp - a.price) / a.mrp) * 100);
      const discountB = Math.round(((b.mrp - b.price) / b.mrp) * 100);
      return discountB - discountA;
    }
    return a.title.localeCompare(b.title);
  });

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const clearAllFilters = () => {
    if (typeof window !== 'undefined') window.__pendingCategory = 'All';
    setSelectedCategory('All');
    setPriceFilter('All');
    setSelectedBrand('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedBrand !== 'All' || priceFilter !== 'All' || searchQuery.trim().length > 0;

  const perPage = Math.max(1, Number(displayPerPage) || 20);
  const totalPages = Math.ceil(sortedProducts.length / perPage) || 1;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, sortedProducts.length);
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + perPage);

  return (
    <div className="catalog-container animate-fade-in">
      
      {/* Category Heading & Description at the Top */}
      <div className="catalog-header">
        <h1 className="catalog-title">
          {selectedCategory === 'All' ? 'Healthcare Equipment Store' : selectedCategory}
        </h1>
        <p className="catalog-desc">
          {categoryDescriptions[selectedCategory] || categoryDescriptions['All']}
        </p>
      </div>

      {/* Dismissible Active Filter Pill Badges */}
      {hasActiveFilters && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Active Filters:</span>
          {selectedCategory !== 'All' && (
            <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.6rem', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Collection: {selectedCategory} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('All')} />
            </span>
          )}
          {selectedBrand !== 'All' && (
            <span style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.6rem', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Brand: {selectedBrand} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedBrand('All')} />
            </span>
          )}
          {priceFilter !== 'All' && (
            <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.6rem', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Price: {priceFilter} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setPriceFilter('All')} />
            </span>
          )}
          {searchQuery && (
            <span style={{ backgroundColor: '#f1f5f9', color: '#334155', fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.6rem', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Query: "{searchQuery}" <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
            </span>
          )}
          <button onClick={clearAllFilters} style={{ fontSize: '0.72rem', color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }}>
            Clear All
          </button>
        </div>
      )}

      {/* Horizontal Toolbar: Filters & Sort Controls Bar */}
      <div className="catalog-toolbar">
        
        {/* Left Side: Product Counter & Quick Search */}
        <div className="catalog-toolbar-info">
          <span style={{ fontWeight: '600', color: '#475569' }}>
            Showing {sortedProducts.length > 0 ? startIndex + 1 : 0} - {endIndex} of {sortedProducts.length} products
          </span>
          {searchQuery && (
            <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Query: "{searchQuery}" <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
            </span>
          )}
        </div>

        {/* Center: Dropdown Inline Filters */}
        <div className="catalog-toolbar-selects">
          {/* Brand Selector */}
          <select 
            value={selectedBrand} 
            onChange={(e) => setSelectedBrand(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', outline: 'none', backgroundColor: '#ffffff' }}
          >
            <option value="All">All Brands</option>
            {brands.filter(b => b !== 'All').map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', outline: 'none', backgroundColor: '#ffffff' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Collections' : cat}</option>
            ))}
          </select>

          {/* Sort Selector */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', outline: 'none', backgroundColor: '#ffffff' }}
          >
            <option value="popular">Popularity & Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Biggest Savings</option>
          </select>
        </div>

        {/* Right Side: Per-Page, Grid/List view Switchers */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Display:</span>
            <select 
              value={displayPerPage}
              onChange={(e) => setDisplayPerPage(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '0.8rem', fontWeight: '700', outline: 'none', cursor: 'pointer' }}
            >
              <option value="20">20 per page (5 rows)</option>
              <option value="24">24 per page (6 rows)</option>
              <option value="40">40 per page (10 rows)</option>
              <option value="60">60 per page (15 rows)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }}>
            <button 
              onClick={() => setViewModeType('grid')} 
              style={{ color: viewModeType === 'grid' ? 'hsl(var(--primary))' : '#94a3b8', padding: '2px' }}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewModeType('list')} 
              style={{ color: viewModeType === 'list' ? 'hsl(var(--primary))' : '#94a3b8', padding: '2px' }}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Card Grid List */}
      <div>
        {sortedProducts.length === 0 ? (
          <div className="card text-center" style={{ padding: '5rem 2rem', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>No Products Found</div>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Try clearing your keywords or selecting a different collection category.</p>
            <button className="btn btn-primary" onClick={clearAllFilters}>Reset Filter Settings</button>
          </div>
        ) : (
          <div className={`catalog-products-grid ${viewModeType === 'list' ? 'list-view' : ''}`}>
            {paginatedProducts.map(p => {
              const discountValue = p.mrp - p.price;
              const hasDiscount = p.mrp > p.price;

              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  style={{
                    borderRight: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '1.5rem',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: viewModeType === 'grid' ? 'column' : 'row',
                    gap: viewModeType === 'grid' ? '0' : '1.5rem',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  className="card-hover-grid-item"
                >
                  {/* Red Save Badge or Custom Offer Tag */}
                  {(p.offerTag || hasDiscount) && (
                    <div className="product-card-save-badge" style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '2px',
                      textTransform: 'uppercase',
                      zIndex: 3
                    }}>
                      {p.offerTag ? p.offerTag : `Save Rs. ${discountValue.toLocaleString('en-IN')}.00`}
                    </div>
                  )}

                  {/* Image area */}
                  <div className="product-card-img-box" style={{
                    height: '200px',
                    width: viewModeType === 'grid' ? '100%' : '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="product-card-img"
                      style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} 
                    />
                  </div>

                  {/* Content details */}
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginTop: viewModeType === 'grid' ? '1.25rem' : '0' }}>
                    
                    {/* Brand */}
                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: '#94a3b8', 
                      textTransform: 'uppercase', 
                      fontWeight: '800', 
                      letterSpacing: '0.05em',
                      marginBottom: '0.25rem'
                    }}>
                      {p.brand || 'AEONCARE'}
                    </span>

                    {/* Title */}
                    <h3 className="product-card-title" style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: '600', 
                      color: '#1e293b', 
                      lineHeight: '1.4', 
                      minHeight: '2.5rem',
                      marginBottom: '0.5rem',
                      overflow: 'hidden'
                    }}>
                      {p.title}
                    </h3>

                    {/* Price and Strikeout MRP */}
                    <div className="product-card-price-box" style={{ 
                      display: 'flex', 
                      alignItems: 'baseline', 
                      gap: '0.5rem', 
                      flexWrap: 'wrap',
                      marginTop: 'auto',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <span className="product-card-price" style={{ 
                          color: '#ef4444', 
                          fontSize: '1.05rem', 
                          fontWeight: '800' 
                        }}>
                          Rs. {p.price.toLocaleString('en-IN')}.00
                        </span>
                        {hasDiscount && (
                          <span className="product-card-mrp" style={{ 
                            color: '#94a3b8', 
                            textDecoration: 'line-through', 
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            marginLeft: '6px'
                          }}>
                            Rs. {p.mrp.toLocaleString('en-IN')}.00
                          </span>
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setQuickViewProduct(p); }}
                        className="btn btn-outline hide-mobile"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: '700' }}
                      >
                        Quick View
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Control Bar */}
        {sortedProducts.length > perPage && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
              Page {currentPage} of {totalPages} ({sortedProducts.length} total items)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <button
                disabled={currentPage <= 1}
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 200, behavior: 'smooth' });
                }}
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: currentPage <= 1 ? 0.5 : 1, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
              >
                ‹ Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                .map((page, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && page - prev > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>}
                      <button
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 200, behavior: 'smooth' });
                        }}
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          border: '1px solid',
                          borderColor: currentPage === page ? 'hsl(var(--primary))' : '#cbd5e1',
                          backgroundColor: currentPage === page ? 'hsl(var(--primary))' : '#ffffff',
                          color: currentPage === page ? '#ffffff' : '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 200, behavior: 'smooth' });
                }}
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: currentPage >= totalPages ? 0.5 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal Popup */}
      {quickViewProduct && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem' }}
          onClick={() => setQuickViewProduct(null)}
        >
          <div 
            style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '720px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setQuickViewProduct(null)} 
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.25rem', fontWeight: 'bold', zIndex: 10 }}
            >
              <X size={22} />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', padding: '1rem' }}>
                <img src={quickViewProduct.image} alt={quickViewProduct.title} style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0d9488', textTransform: 'uppercase' }}>{quickViewProduct.brand || 'AEONCARE'} • {quickViewProduct.category}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', lineHeight: '1.3' }}>{quickViewProduct.title}</h3>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ef4444' }}>
                  ₹{quickViewProduct.price.toLocaleString('en-IN')}.00
                  {quickViewProduct.mrp > quickViewProduct.price && (
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '0.5rem', fontWeight: '500' }}>₹{quickViewProduct.mrp.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {quickViewProduct.description}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    onClick={() => {
                      addToCart({
                        id: quickViewProduct.id,
                        title: quickViewProduct.title,
                        price: quickViewProduct.price,
                        type: 'buy',
                        qty: 1,
                        image: quickViewProduct.image
                      });
                      setQuickViewProduct(null);
                    }}
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
                    onClick={() => {
                      setSelectedProductId(quickViewProduct.id);
                      setQuickViewProduct(null);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
