import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShieldCheck, Truck, RotateCcw, Heart, Award, ArrowRight, BookOpen, Layers, HelpCircle } from 'lucide-react';

export default function Home({ setActiveTab, setSelectedProductId, layoutOverride, isMobileViewport }) {
  const { layout: contextLayout, products, blogs, faqs } = useContext(AppContext);
  const effectiveLayout = layoutOverride || contextLayout;
  const isMobileView = Boolean(isMobileViewport || effectiveLayout?.isMobileViewport);

  const handleProductClick = (id) => {
    setSelectedProductId(id);
    setActiveTab('catalog');
  };

  // Dynamic Section Dimension Helper (Length / Width / Height / Padding)
  const getSectionStyles = (secKey, defaultPadY = 64, defaultWidth = 1280, defaultMinH = 0) => {
    let targetCfgKey = secKey;
    if (secKey === 'banner' || secKey === 'slideshow' || secKey === 'confidence_banner') {
      targetCfgKey = 'banner';
    } else if (secKey === 'featured' || secKey === 'featured_collection') {
      targetCfgKey = 'featured';
    }

    const sizes = effectiveLayout?.sectionSizes || {};
    const cfg = sizes[targetCfgKey] || sizes[secKey] || {};
    
    // Vertical padding height (responsive for mobile)
    const padYVal = cfg.paddingY !== undefined ? cfg.paddingY : (typeof defaultPadY === 'number' ? defaultPadY : 64);
    
    // Section minimum height
    const minHVal = cfg.minHeight !== undefined && cfg.minHeight > 0 ? `${cfg.minHeight}px` : (defaultMinH ? `${defaultMinH}px` : 'auto');

    // Container length / max width
    let maxWidthStr = '100%';
    if (cfg.isFullWidth) {
      maxWidthStr = '100%';
    } else if (cfg.width !== undefined) {
      maxWidthStr = typeof cfg.width === 'number' ? `${cfg.width}px` : cfg.width;
    } else if (defaultWidth) {
      maxWidthStr = `${defaultWidth}px`;
    }

    return {
      padding: `clamp(1rem, calc(${padYVal}px * 0.4 + 1vw), ${padYVal}px) clamp(0.75rem, 4vw, 1.5rem)`,
      minHeight: minHVal,
      maxWidth: maxWidthStr,
      rawPadY: padYVal,
      rawMinH: cfg.minHeight || defaultMinH || 0
    };
  };

  // Section Component Map
  const renderSection = (sectionName) => {
    switch (sectionName) {
      case 'hero':
        const heroStyles = getSectionStyles('hero', 64, 800);
        return (
          <section key="hero" className="animate-fade-in" style={{
            background: 'linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--secondary)) 100%)',
            padding: heroStyles.padding,
            minHeight: heroStyles.minHeight,
            textAlign: 'center',
            borderBottom: '1px solid hsl(var(--border))'
          }}>
            <div style={{ maxWidth: heroStyles.maxWidth, margin: '0 auto' }}>
              <div className="badge badge-primary animate-pulse-slow" style={{ marginBottom: '1.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                🩺 Trusted Home Patient Care & Medical Supply Partner
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'hsl(var(--text-main))', marginBottom: '1.5rem', lineHeight: '1.15' }}>
                {effectiveLayout.heroTitle}
              </h1>
              <p style={{ fontSize: '1.125rem', color: 'hsl(var(--text-muted))', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                {effectiveLayout.heroSubtitle}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-lg" onClick={() => setActiveTab('catalog')} style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
                  {effectiveLayout.heroCTA || 'Browse Catalog'} <ArrowRight size={18} />
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => setActiveTab('services')} style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
                  Request Home Setup
                </button>
              </div>
            </div>
          </section>
        );

      case 'trust':
        const trustStyles = getSectionStyles('trust', 32, 1280);
        return (
          <section key="trust" style={{ borderBottom: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', minHeight: trustStyles.minHeight }}>
            <div style={{ maxWidth: trustStyles.maxWidth, margin: '0 auto', padding: trustStyles.padding, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', padding: '0.75rem', borderRadius: '12px' }}>
                  <Truck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem' }}>Express Delivery</h3>
                  <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>Same-day shipping & setup for beds and heavy items in Chennai.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ backgroundColor: 'hsl(var(--accent) / 0.1)', color: 'hsl(var(--accent))', padding: '0.75rem', borderRadius: '12px' }}>
                  <RotateCcw size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem' }}>7-Day Easy Returns</h3>
                  <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>Hassle-free return collection if you are not fully satisfied with your purchase.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', padding: '0.75rem', borderRadius: '12px' }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem' }}>Verified Medical Grade</h3>
                  <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>All equipment is chemically sterilized, safety certified & patient ready.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', padding: '0.75rem', borderRadius: '12px' }}>
                  <Award size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem' }}>GST Compliant</h3>
                  <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>Submit company details at checkout to claim GST tax credits.</p>
                </div>
              </div>

            </div>
          </section>
        );

      case 'collections':
        const collectionsToDisplay = (effectiveLayout.collectionsList && effectiveLayout.collectionsList.length > 0) 
          ? effectiveLayout.collectionsList 
          : [
              { name: 'Hospital Bed', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200' },
              { name: 'WheelChair', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200' },
              { name: 'Commode WheelChair', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=200' },
              { name: 'Rehab and Ortho', image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=200' },
              { name: 'Diaper and Pads', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200' },
              { name: 'Walkers and Crutches', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200' }
            ];
        const collectionsStyles = getSectionStyles('collections', 64, 1280);

        return (
          <section key="collections" style={{ padding: collectionsStyles.padding, minHeight: collectionsStyles.minHeight }}>
            <div style={{ maxWidth: collectionsStyles.maxWidth, margin: '0 auto' }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(var(--text-main))' }}>Our collections</h2>
              <button 
                onClick={() => setActiveTab('catalog')} 
                style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: '700', borderBottom: '2px solid transparent' }}
                className="btn-ghost"
              >
                View all
              </button>
            </div>
            
            {/* Horizontal Row of circular categories */}
            <div 
              className="collections-row"
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                overflowX: 'auto',
                justifyContent: collectionsToDisplay.length > 5 ? 'flex-start' : (isMobileView ? 'flex-start' : 'center'),
                gap: isMobileView ? '1.25rem' : '1.75rem',
                padding: '0.5rem 0.25rem 1rem',
                marginBottom: '2rem',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none'
              }}
            >
              {collectionsToDisplay.map((col, i) => (
                <div 
                  key={i} 
                  className="collections-item"
                  style={{ 
                    textAlign: 'center', 
                    cursor: 'pointer', 
                    flex: '0 0 auto',
                    width: isMobileView ? '105px' : '140px'
                  }}
                  onClick={() => {
                    setActiveTab('catalog');
                    setTimeout(() => {
                      const event = new CustomEvent('selectCategory', { detail: col.name });
                      window.dispatchEvent(event);
                    }, 50);
                  }}
                >
                  <div 
                    className="collections-circle card-hover"
                    style={{ 
                      width: isMobileView ? '95px' : '135px', 
                      height: isMobileView ? '95px' : '135px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f8fafc', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      overflow: 'hidden', 
                      margin: '0 auto 0.5rem',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <img 
                      src={col.image} 
                      alt={col.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300';
                      }}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        padding: '4px'
                      }} 
                    />
                  </div>
                  <div style={{ fontSize: isMobileView ? '0.75rem' : '0.85rem', fontWeight: '700', color: 'hsl(var(--text-main))', lineHeight: '1.2', maxWidth: isMobileView ? '100px' : '125px', margin: '0 auto' }}>
                    {col.name}
                  </div>
                </div>
              ))}
            </div>
            </div>
          </section>
        );

      case 'banner':
      case 'slideshow':
      case 'confidence_banner':
        const bannerStyles = getSectionStyles('banner', 32, 1280);
        return (
          <section key={sectionName} style={{ borderBottom: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', minHeight: bannerStyles.minHeight }}>
            <div style={{ maxWidth: bannerStyles.maxWidth, margin: '0 auto', padding: bannerStyles.padding }}>
              {/* Confidence Promo Slider Banner */}
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundImage: `url(${effectiveLayout.bannerImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '360px',
                display: 'flex',
                alignItems: 'center',
                padding: '3rem',
                boxShadow: 'var(--shadow-lg)'
              }}>
                {/* Dark overlay gradient */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.1) 100%)',
                  zIndex: 1
                }}></div>

                {/* Text content */}
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '650px', color: 'white' }} className="animate-fade-in">
                  <h2 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    letterSpacing: '0.02em', 
                    marginBottom: '1rem', 
                    lineHeight: '1.2',
                    color: 'white'
                  }}>
                    {effectiveLayout.bannerTitle || 'Clinical Grade Medical Equipment Delivered to Your Door'}
                  </h2>
                  <p style={{ 
                    fontSize: '1.1rem', 
                    opacity: 0.9, 
                    lineHeight: '1.5', 
                    marginBottom: '2rem',
                    fontWeight: '500'
                  }}>
                    {effectiveLayout.bannerSubtitle || 'Buy or rent certified patient cots, wheelchairs, oxygen concentrators, and home-care consumables with 24/7 technical setup in Chennai.'}
                  </p>
                  <button 
                    className="btn btn-accent" 
                    onClick={() => setActiveTab('catalog')} 
                    style={{ padding: '0.75rem 1.5rem', fontWeight: '700' }}
                  >
                    Visit Showroom
                  </button>
                </div>

                {/* Slider Dots indicators */}
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '0.5rem',
                  zIndex: 2
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }}></span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.4 }}></span>
                </div>
              </div>
            </div>
          </section>
        );

      case 'featured':
        const featuredCollectionsData = [
          {
            id: 'home_care',
            badge: '🏥 Hospital Beds & Home Care',
            title: 'Home Care & Patient Bed Essentials',
            subtitle: 'Motorized hospital cots, pressure-relief medical mattresses, and senior home-care supplies.',
            category: 'Home Care',
            productsList: products.filter(p => p.category === 'Home Care').slice(0, 3)
          },
          {
            id: 'mobility_aid',
            badge: '🦽 Wheelchairs & Mobility',
            title: 'Mobility Aids & Transit Solutions',
            subtitle: 'Lightweight folding wheelchairs, commode chairs, rollators and walking assistance frames.',
            category: 'Mobility Aid',
            productsList: products.filter(p => p.category === 'Mobility Aid').slice(0, 3)
          },
          {
            id: 'medical_devices',
            badge: '🩺 Clinical Devices & Monitors',
            title: 'Medical Devices & Health Diagnostics',
            subtitle: 'Intellisense BP monitors, fingertip pulse oximeters, and medical oxygen concentrators.',
            category: 'Medical Devices',
            productsList: products.filter(p => p.category === 'Medical Devices').slice(0, 3)
          }
        ];
        const featuredStyles = getSectionStyles('featured', 64, 1280);

        return (
          <section key="featured" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: featuredStyles.padding, minHeight: featuredStyles.minHeight, backgroundColor: 'hsl(var(--text-muted-light) / 0.2)' }}>
            {featuredCollectionsData.map((collBlock, cIdx) => (
              <div key={collBlock.id} style={{ maxWidth: featuredStyles.maxWidth, margin: '0 auto', width: '100%' }}>
                
                {/* Collection Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ 
                      display: 'inline-block', 
                      backgroundColor: 'hsl(var(--primary) / 0.1)', 
                      color: 'hsl(var(--primary))', 
                      fontSize: '0.8rem', 
                      fontWeight: '800', 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      marginBottom: '0.5rem' 
                    }}>
                      {collBlock.badge}
                    </span>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.35rem', color: 'hsl(var(--text-main))' }}>
                      {collBlock.title}
                    </h2>
                    <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.95rem' }}>
                      {collBlock.subtitle}
                    </p>
                  </div>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => {
                      setActiveTab('catalog');
                      setTimeout(() => {
                        const event = new CustomEvent('selectCategory', { detail: collBlock.category });
                        window.dispatchEvent(event);
                      }, 50);
                    }}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    View All {collBlock.category} <ArrowRight size={16} />
                  </button>
                </div>

                {/* Product Grid for Collection */}
                <div className="grid-auto">
                  {collBlock.productsList.map(p => {
                    const discountPct = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                    return (
                      <div 
                        key={p.id} 
                        className="card card-hover" 
                        onClick={() => handleProductClick(p.id)}
                        style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.25rem', cursor: 'pointer' }}
                      >
                        <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }}>
                          <img src={p.image} alt={p.title} className="product-card-img" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                          {discountPct > 0 && (
                            <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'hsl(var(--accent))', color: 'white', fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                              SAVE {discountPct}%
                            </div>
                          )}
                          <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(255,255,255,0.9)', color: 'hsl(var(--primary))', fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                            {p.category}
                          </div>
                        </div>
                        
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{p.brand}</div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', color: 'hsl(var(--text-main))', flex: 1, lineHeight: '1.3' }}>
                            {p.title}
                          </h3>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'hsl(var(--text-main))' }}>₹{p.price.toLocaleString('en-IN')}</span>
                            {p.mrp > p.price && (
                              <span style={{ fontSize: '0.875rem', color: 'hsl(var(--text-muted))', textDecoration: 'line-through' }}>MRP ₹{p.mrp.toLocaleString('en-IN')}</span>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-primary" style={{ flex: 1 }}>
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {cIdx < featuredCollectionsData.length - 1 && (
                  <div style={{ width: '100%', height: '1px', backgroundColor: 'hsl(var(--border))', marginTop: '3rem' }}></div>
                )}

              </div>
            ))}
          </section>
        );

      case 'video':
        const getYouTubeId = (url) => {
          if (!url) return null;
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          const match = url.match(regExp);
          return (match && match[2].length === 11) ? match[2] : null;
        };
        const youtubeId = getYouTubeId(effectiveLayout.promoVideoUrl);
        if (!youtubeId) return null;
        const videoStyles = getSectionStyles('video', 48, 800);
        return (
          <section key="video" style={{ padding: videoStyles.padding, minHeight: videoStyles.minHeight, maxWidth: videoStyles.maxWidth, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: 'hsl(var(--text-main))' }}>Product Showcase & Care Instructions</h2>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>Watch detailed video manuals and step-by-step assembly guides for home care equipment.</p>
            </div>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 ratio
              height: 0,
              overflow: 'hidden',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: '#000000',
              border: '1px solid hsl(var(--border))'
            }}>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Product Showcase & Care Instructions"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              ></iframe>
            </div>
          </section>
        );

      case 'blog':
        if (!effectiveLayout.showBlogPreview && effectiveLayout.showBlogPreview !== undefined) return null;
        const blogStyles = getSectionStyles('blog', 64, 1280);
        return (
          <section key="blog" style={{ padding: blogStyles.padding, minHeight: blogStyles.minHeight }}>
            <div style={{ maxWidth: blogStyles.maxWidth, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Caregiver Guides & Health Tips</h2>
                <p style={{ color: 'hsl(var(--text-muted))' }}>Empowering families managing patient care and recovery at home.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {blogs.map(post => (
                  <div key={post.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="badge badge-secondary">{post.category}</span>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{post.date}</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.75rem', color: 'hsl(var(--text-main))' }}>{post.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(var(--text-muted))', flex: 1, marginBottom: '1.5rem' }}>{post.summary}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid hsl(var(--border))', paddingTop: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-main))', fontWeight: '600' }}>By {post.author}</span>
                      <button onClick={() => setActiveTab('blog')} style={{ color: 'hsl(var(--primary))', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Read Article <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'faq':
        const faqStyles = getSectionStyles('faq', 64, 850);
        return (
          <section key="faq" style={{ padding: faqStyles.padding, minHeight: faqStyles.minHeight, backgroundColor: 'hsl(var(--card))', borderTop: '1px solid hsl(var(--border))', borderBottom: '1px solid hsl(var(--border))' }}>
            <div style={{ maxWidth: faqStyles.maxWidth, margin: '0 auto', textAlign: 'center' }}>
              <span className="badge badge-accent" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Help Desk & FAQs</span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'hsl(var(--text-main))', letterSpacing: '-0.01em' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '1rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: '1.5' }}>
                Find instant answers to equipment rentals, delivery options, security deposits, and clinical sterilization protocols.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                {faqs.slice(0, 4).map(faq => (
                  <div 
                    key={faq.id} 
                    style={{ 
                      borderRadius: '12px', 
                      border: '1px solid hsl(var(--border))', 
                      backgroundColor: 'hsl(var(--background))', 
                      padding: '1.25rem 1.5rem',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'hsl(var(--text-main))', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
                        <HelpCircle size={18} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} /> 
                        {faq.question}
                      </h3>
                      <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '12px', backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', fontWeight: '700' }}>
                        {faq.category}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', margin: 0, lineHeight: '1.6', paddingLeft: '1.75rem' }}>
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                <button 
                  className="btn btn-primary btn-lg" 
                  onClick={() => setActiveTab('faq')}
                  style={{ padding: '0.75rem 2rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Explore All FAQs & Help Desk <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key="cta" style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-h) 80% 20%) 100%)',
            color: 'white',
            padding: '4rem 1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Need Consultation Choosing Equipment?</h2>
              <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '2rem' }}>
                Unsure if a manual or electric hospital bed is right? Speak to our home care advisor. We will assess physical requirements and suggest correct options.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="tel:+919840123456" className="btn btn-accent" style={{ padding: '0.8rem 2rem' }}>
                  Call Support Advisor
                </a>
                <button className="btn btn-outline" onClick={() => setActiveTab('services')} style={{ border: '1px solid white', color: 'white', padding: '0.8rem 2rem' }}>
                  Request Home Visit
                </button>
              </div>
            </div>
          </section>
        );

      case 'image_banner':
        return (
          <section key="image_banner" className="animate-fade-in" style={{
            position: 'relative',
            backgroundImage: `url(${effectiveLayout.imageBannerImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1.5rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1 }}></div>
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1rem', color: 'white', letterSpacing: '0.02em' }}>
                {effectiveLayout.imageBannerTitle || 'PREMIUM CLINICAL SOLUTIONS FOR HOME CARE'}
              </h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '2rem' }}>
                {effectiveLayout.imageBannerSubtitle || 'Engineered for therapeutic comfort. Explore orthopedic braces, diagnostic kits, and patient-ready surgical supplies.'}
              </p>
              <button className="btn btn-accent btn-lg" onClick={() => setActiveTab('catalog')} style={{ padding: '0.75rem 2rem' }}>
                Explore Products
              </button>
            </div>
          </section>
        );

      case 'collection_with_image': {
        const targetCategory = effectiveLayout.colWithImageCategory || 'Mobility Aid';
        const filteredProds = products.filter(p => p.category === targetCategory).slice(0, 2);
        const colImgStyles = getSectionStyles('collection_with_image', 64, 1280);
        return (
          <section key="collection_with_image" style={{ padding: colImgStyles.padding, minHeight: colImgStyles.minHeight, maxWidth: colImgStyles.maxWidth, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', height: '400px' }}>
                <img 
                  src={effectiveLayout.colWithImageImage || 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600'} 
                  alt="Collection spotlight" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.85rem', color: 'hsl(var(--primary))' }}>
                  Spotlight Category
                </div>
              </div>
              <div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1rem', color: 'hsl(var(--text-main))', lineHeight: '1.2' }}>
                  {effectiveLayout.colWithImageTitle || 'Specialized Rehabilitation Products'}
                </h2>
                <p style={{ color: 'hsl(var(--text-muted))', fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                  View top rated equipment under <strong>{targetCategory}</strong> curated by our medical panel for patient care safety and high recovery compliance.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {filteredProds.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => handleProductClick(p.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.75rem', cursor: 'pointer' }}
                    >
                      <img src={p.image} alt={p.title} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid hsl(var(--border))' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>{p.title}</h4>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'hsl(var(--primary))' }}>₹{p.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-outline" onClick={() => setActiveTab('catalog')}>
                  View Full Category
                </button>
              </div>
            </div>
          </section>
        );
      }

      case 'logo_list':
        const defaultLogos = effectiveLayout.logoList || [];
        return (
          <section key="logo_list" style={{ backgroundColor: 'hsl(var(--secondary) / 0.15)', padding: '2.5rem 1.5rem', borderTop: '1px solid hsl(var(--border))', borderBottom: '1px solid hsl(var(--border))' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '1.5rem' }}>
                AeonCare Clinical Distribution Partners & Certified Brands
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', opacity: 0.7 }}>
                {defaultLogos.map((url, i) => (
                  <img key={i} src={url} alt={`Partner brand ${i+1}`} style={{ height: '40px', objectFit: 'contain', filter: 'grayscale(100%)' }} />
                ))}
              </div>
            </div>
          </section>
        );

      case 'rich_text':
        return (
          <section key="rich_text" style={{ padding: '4rem 1.5rem', backgroundColor: 'hsl(var(--card))', borderBottom: '1px solid hsl(var(--border))', textAlign: 'center' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: 'hsl(var(--text-main))' }}>
                {effectiveLayout.richTextHeading || 'Patient safety is our primary focus.'}
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'hsl(var(--text-muted))', lineHeight: '1.7', margin: 0 }}>
                {effectiveLayout.richTextBody || 'All our diagnostic monitors, wheelchairs, and recovery beds undergo clinical grade sterilization processes before dispatch.'}
              </p>
            </div>
          </section>
        );

      default:
        // Dynamic fallback for any future custom section created in Online Store Editor
        const customStyles = getSectionStyles(sectionName, 48, 1280);
        const formattedTitle = sectionName.charAt(0).toUpperCase() + sectionName.slice(1).replace(/[-_]/g, ' ');
        return (
          <section key={sectionName} style={{ padding: customStyles.padding, minHeight: customStyles.minHeight, borderBottom: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}>
            <div style={{ maxWidth: customStyles.maxWidth, margin: '0 auto', textAlign: 'center' }}>
              <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>{formattedTitle}</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem', color: 'hsl(var(--text-main))' }}>
                {effectiveLayout[`${sectionName}_title`] || `${formattedTitle} Section`}
              </h2>
              <p style={{ color: 'hsl(var(--text-muted))', maxWidth: '650px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {effectiveLayout[`${sectionName}_body`] || `Explore our high quality clinical healthcare solutions and equipment offerings.`}
              </p>
            </div>
          </section>
        );
    }
  };

  const visibleSections = (effectiveLayout.sectionsOrder || []).filter(sec => !(effectiveLayout.hiddenSections || []).includes(sec));

  return (
    <div style={{ flex: 1 }}>
      {visibleSections.map(section => renderSection(section))}
    </div>
  );
}
