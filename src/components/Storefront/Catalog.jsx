import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, Star, ShoppingCart, X, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

export default function Catalog({ selectedProductId, setSelectedProductId, initialSearchVal }) {
  const { products, addToCart } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewModeType, setViewModeType] = useState('grid'); // grid | list
  const [displayPerPage, setDisplayPerPage] = useState('24');

  // Handle incoming searches or category selections from other pages
  useEffect(() => {
    const handleSelectCategory = (e) => {
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

  const categories = ['All', 'Home Care', 'Mobility Aid', 'Medical Devices', 'Surgicals & PPE'];
  const brands = ['All', 'CareQuip', 'Vissco', 'Accu-Chek', 'Seni', 'Dyna', 'AEONCARE'];

  // Category Description Maps matching AeonCare DTC theme
  const categoryDescriptions = {
    'All': 'Discover our comprehensive catalog of premium medical and home-care products. Explore mobility solutions, diagnostics monitors, hospital cots and daily patient hygiene support.',
    'Home Care': 'Discover a wide range of hospital beds for home and medical use at Aeoncare.in. Explore adjustable, electric, and manual beds designed for maximum comfort, safety, and care. Fast delivery and trusted support.',
    'Mobility Aid': 'Find lightweight folding transit wheelchairs, commode wheelchairs, and walking frames engineered for elderly mobility assistance and post-hospital discharge care.',
    'Medical Devices': 'Track patient blood pressure, body temperatures, and heart metrics with certified Intellisense upper-arm cuffs, infrared thermometers, and pulse diagnostic devices.',
    'Surgicals & PPE': 'Acquire certified high-filtration face masks, disposable latex/nitrile gloves, isolation gowns, and clinical disinfectants for home care sanitation.'
  };

  // Filter logic
  const filteredProducts = products.filter(p => {
    // Category filter
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    
    // Brand filter
    if (selectedBrand !== 'All' && p.brand.toUpperCase() !== selectedBrand.toUpperCase()) return false;
    
    // Price filter
    if (priceFilter !== 'All') {
      if (priceFilter === 'under2k' && p.price >= 2000) return false;
      if (priceFilter === '2k-10k' && (p.price < 2000 || p.price > 10000)) return false;
      if (priceFilter === 'over10k' && p.price <= 10000) return false;
    }

    // Search query
    if (searchQuery.trim().length > 0) {
      const target = searchQuery.toLowerCase();
      const titleMatch = p.title.toLowerCase().includes(target);
      const descMatch = p.description.toLowerCase().includes(target);
      const brandMatch = p.brand.toLowerCase().includes(target);
      const tagMatch = p.tags.some(t => t.toLowerCase().includes(target));
      if (!titleMatch && !descMatch && !brandMatch && !tagMatch) return false;
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

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setPriceFilter('All');
    setSelectedBrand('All');
    setSearchQuery('');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem', flex: 1 }} className="animate-fade-in">
      
      {/* Category Heading & Description at the Top */}
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.75rem' }}>
          {selectedCategory === 'All' ? 'Healthcare Equipment Store' : selectedCategory}
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '900px' }}>
          {categoryDescriptions[selectedCategory] || categoryDescriptions['All']}
        </p>
      </div>

      {/* Horizontal Toolbar: Filters & Sort Controls Bar */}
      <div style={{ 
        borderTop: '1px solid #e2e8f0', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '0.75rem 0.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
        backgroundColor: '#ffffff'
      }}>
        
        {/* Left Side: Product Counter & Quick Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
            Showing 1 - {sortedProducts.length} of {sortedProducts.length} products
          </span>
          {searchQuery && (
            <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Query: "{searchQuery}" <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
            </span>
          )}
        </div>

        {/* Center: Dropdown Inline Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Brand Selector */}
          <select 
            value={selectedBrand} 
            onChange={(e) => setSelectedBrand(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', outline: 'none' }}
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
            style={{ padding: '0.4rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', outline: 'none' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Collections' : cat}</option>
            ))}
          </select>
        </div>

        {/* Right Side: Sort, Per-Page, Grid/List view Switchers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Display:</span>
            <select 
              value={displayPerPage}
              onChange={(e) => setDisplayPerPage(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '0.8rem', fontWeight: '700', outline: 'none', cursor: 'pointer' }}
            >
              <option value="24">24 per page</option>
              <option value="48">48 per page</option>
              <option value="96">96 per page</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '0.8rem', fontWeight: '700', outline: 'none', cursor: 'pointer' }}
            >
              <option value="popular">Popularity & Relevance</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="discount">Biggest Savings</option>
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewModeType === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : '1fr',
            gap: 0,
            borderTop: '1px solid #e2e8f0',
            borderLeft: '1px solid #e2e8f0',
            backgroundColor: '#ffffff'
          }}>
            {sortedProducts.map(p => {
              const discountValue = p.mrp - p.price;
              const hasDiscount = p.mrp > p.price;
              const isBedItem = p.title.toLowerCase().includes('bed') || p.title.toLowerCase().includes('cot') || p.title.toLowerCase().includes('mattress');

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
                  {/* Red Save Badge */}
                  {hasDiscount && (
                    <div style={{
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
                      Save Rs. {discountValue.toLocaleString('en-IN')}.00
                    </div>
                  )}

                  {/* Image area */}
                  <div style={{
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
                    <h3 style={{ 
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
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'baseline', 
                      gap: '0.5rem', 
                      flexWrap: 'wrap',
                      marginTop: 'auto' 
                    }}>
                      <span style={{ 
                        color: '#ef4444', 
                        fontSize: '1.05rem', 
                        fontWeight: '800' 
                      }}>
                        Rs. {p.price.toLocaleString('en-IN')}.00
                      </span>
                      {hasDiscount && (
                        <span style={{ 
                          color: '#94a3b8', 
                          textDecoration: 'line-through', 
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          Rs. {p.mrp.toLocaleString('en-IN')}.00
                        </span>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
