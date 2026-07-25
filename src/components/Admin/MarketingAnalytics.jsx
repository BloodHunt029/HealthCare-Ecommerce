import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Target, TrendingUp, Users, Percent, Plus, Share2, Clipboard, 
  ShieldCheck, Mail, Eye, Compass, BarChart3, ArrowUpDown, Play, 
  Activity, CheckCircle2, RefreshCw, MousePointer, PlusCircle, X
} from 'lucide-react';

export default function MarketingAnalytics() {
  const { analytics, setAnalytics, leads, updateLeadStatus, trackPageView } = useContext(AppContext);
  
  // States for UTM link builder & Pixels
  const [utmSource, setUtmSource] = useState('Google');
  const [utmCampaign, setUtmCampaign] = useState('MONSOON_RENTALS');
  const [generatedLink, setGeneratedLink] = useState('');
  
  const [fbPixel, setFbPixel] = useState(analytics.pixelConfig.facebookPixelId);
  const [googleTag, setGoogleTag] = useState(analytics.pixelConfig.googleAdsTagId);
  const [success, setSuccess] = useState('');

  // States for Page-wise Sessions search & filter
  const [pageSearch, setPageSearch] = useState('');
  const [sortBy, setSortBy] = useState('views'); // views | bounce | conversion

  // New Page Modal Form State
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageRoute, setNewPageRoute] = useState('');

  const pageSessions = analytics.pageSessions || [
    { id: 'home', name: 'Home Page', path: '/', views: 245, uniqueVisitors: 198, avgTime: '2m 15s', bounceRate: '32%', conversionRate: '3.2%' },
    { id: 'catalog', name: 'Shop Catalog', path: '/catalog', views: 182, uniqueVisitors: 154, avgTime: '3m 40s', bounceRate: '28%', conversionRate: '5.1%' },
    { id: 'pdp', name: 'Product Details (PDP)', path: '/product/:id', views: 145, uniqueVisitors: 120, avgTime: '4m 10s', bounceRate: '24%', conversionRate: '8.4%' },
    { id: 'services', name: 'Care Services & Setup', path: '/services', views: 95, uniqueVisitors: 82, avgTime: '1m 50s', bounceRate: '41%', conversionRate: '2.5%' },
    { id: 'blog', name: 'Blog & FAQs', path: '/blog', views: 68, uniqueVisitors: 55, avgTime: '2m 30s', bounceRate: '38%', conversionRate: '1.2%' },
    { id: 'userPortal', name: 'My Account / Orders', path: '/account', views: 42, uniqueVisitors: 31, avgTime: '1m 20s', bounceRate: '15%', conversionRate: '12.0%' },
    { id: 'checkout', name: 'Checkout Page', path: '/checkout', views: 35, uniqueVisitors: 32, avgTime: '3m 05s', bounceRate: '12%', conversionRate: '68.5%' }
  ];

  const totalPageviews = pageSessions.reduce((sum, p) => sum + p.views, 0);

  const generateUtmLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const query = `?utm_source=${utmSource.trim()}&utm_campaign=${utmCampaign.trim()}`;
    const full = baseUrl + query;
    setGeneratedLink(full);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setSuccess('📋 Generated trackable UTM URL copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSavePixels = (e) => {
    e.preventDefault();
    setAnalytics(prev => ({
      ...prev,
      pixelConfig: { facebookPixelId: fbPixel, googleAdsTagId: googleTag }
    }));
    setSuccess('✅ Facebook & Google Analytics Pixel tags configured successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSimulateHit = (pageId) => {
    if (trackPageView) {
      const pageItem = pageSessions.find(p => p.id === pageId);
      trackPageView(pageId, pageItem?.name, pageItem?.path);
      setSuccess(`⚡ Simulated +1 session view hit on ${pageItem?.name || pageId}!`);
      setTimeout(() => setSuccess(''), 2500);
    }
  };

  const handleAddNewPage = (e) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    const cleanId = newPageTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const cleanPath = newPageRoute.trim() 
      ? (newPageRoute.startsWith('/') ? newPageRoute : '/' + newPageRoute) 
      : `/${cleanId}`;
    
    if (trackPageView) {
      trackPageView(cleanId, newPageTitle.trim(), cleanPath);
      setSuccess(`✅ New page "${newPageTitle.trim()}" (${cleanPath}) registered and added to session tracking!`);
      setTimeout(() => setSuccess(''), 3500);
    }
    setNewPageTitle('');
    setNewPageRoute('');
    setIsAddPageModalOpen(false);
  };

  // Funnel maths
  const fn = analytics.funnel;
  const viewPct = Math.round((fn.productViews / fn.sessions) * 100);
  const cartPct = Math.round((fn.addToCart / fn.productViews) * 100);
  const checkPct = Math.round((fn.checkoutStarted / fn.addToCart) * 100);
  const buyPct = Math.round((fn.purchases / fn.checkoutStarted) * 100);

  // Filter & Sort Page Sessions
  const filteredPages = pageSessions
    .filter(p => p.name.toLowerCase().includes(pageSearch.toLowerCase()) || p.path.toLowerCase().includes(pageSearch.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'bounce') return parseFloat(a.bounceRate) - parseFloat(b.bounceRate);
      if (sortBy === 'conversion') return parseFloat(b.conversionRate) - parseFloat(a.conversionRate);
      return 0;
    });

  const topPage = [...pageSessions].sort((a, b) => b.views - a.views)[0];

  return (
    <div className="animate-fade-in">
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Marketing & Page-wise Sessions Analytics</h1>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem' }}>
            Real-time traffic telemetry, page-wise session metrics, UTM campaign attribution, and lead tracking.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Activity size={14} className="animate-pulse" /> Live Telemetry Active
          </span>
        </div>
      </div>

      {success && (
        <div style={{ backgroundColor: 'hsl(var(--success-bg))', color: 'hsl(var(--success))', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {success}
        </div>
      )}

      {/* ================= PAGE-WISE SESSIONS SUMMARY METRICS ================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        
        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'white' }}>
          <div style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', padding: '0.75rem', borderRadius: '12px' }}>
            <Eye size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '700', display: 'block', textTransform: 'uppercase' }}>TOTAL PAGEVIEWS</span>
            <strong style={{ fontSize: '1.4rem', color: 'hsl(var(--text-main))' }}>{totalPageviews.toLocaleString()}</strong>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'white' }}>
          <div style={{ backgroundColor: 'hsl(var(--success-bg))', color: 'hsl(var(--success))', padding: '0.75rem', borderRadius: '12px' }}>
            <Compass size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '700', display: 'block', textTransform: 'uppercase' }}>TOP TRAFFIC PAGE</span>
            <strong style={{ fontSize: '1.1rem', color: 'hsl(var(--text-main))' }}>{topPage ? topPage.name : 'Home'}</strong>
            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'block' }}>{topPage ? `${topPage.views} Sessions` : ''}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'white' }}>
          <div style={{ backgroundColor: 'hsl(var(--warning-bg))', color: 'hsl(var(--warning))', padding: '0.75rem', borderRadius: '12px' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '700', display: 'block', textTransform: 'uppercase' }}>TRACKED ROUTES</span>
            <strong style={{ fontSize: '1.4rem', color: 'hsl(var(--text-main))' }}>{pageSessions.length} Pages</strong>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'white' }}>
          <div style={{ backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--secondary-foreground))', padding: '0.75rem', borderRadius: '12px' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '700', display: 'block', textTransform: 'uppercase' }}>AVG BOUNCE RATE</span>
            <strong style={{ fontSize: '1.4rem', color: 'hsl(var(--text-main))' }}>27.1%</strong>
          </div>
        </div>

      </div>

      {/* ================= PAGE-WISE SESSIONS DETAILED SECTION ================= */}
      <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={20} style={{ color: 'hsl(var(--primary))' }} /> Page-wise Sessions & Route Breakdown
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', margin: 0 }}>
              Audit incoming user sessions, engagement time, bounce rate, and conversion rates across individual storefront routes. Newly created pages automatically auto-register here.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={() => setIsAddPageModalOpen(true)}
            >
              <PlusCircle size={16} /> Register New Page
            </button>

            <input 
              type="text" 
              placeholder="Search by page name or path..." 
              className="form-input"
              value={pageSearch}
              onChange={(e) => setPageSearch(e.target.value)}
              style={{ width: '200px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            />

            <select 
              className="form-input" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '160px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="views">Sort by: Sessions (High to Low)</option>
              <option value="bounce">Sort by: Lowest Bounce Rate</option>
              <option value="conversion">Sort by: Highest Conversion</option>
            </select>
          </div>
        </div>

        {/* Page-wise Sessions Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid hsl(var(--border))', color: 'hsl(var(--text-muted))', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Page Name & Path</th>
                <th>Sessions / Views</th>
                <th>Traffic Share</th>
                <th>Unique Visitors</th>
                <th>Avg. Duration</th>
                <th>Bounce Rate</th>
                <th>Conversion Rate</th>
                <th style={{ textAlign: 'center' }}>Simulate Hit</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map(page => {
                const pct = totalPageviews > 0 ? Math.round((page.views / totalPageviews) * 100) : 0;
                return (
                  <tr key={page.id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: '700', color: 'hsl(var(--text-main))', fontSize: '0.9rem' }}>{page.name}</div>
                      <span style={{ 
                        display: 'inline-block', 
                        backgroundColor: '#f1f5f9', 
                        color: 'hsl(var(--primary))', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontSize: '0.7rem', 
                        fontFamily: 'monospace',
                        fontWeight: '600',
                        marginTop: '2px'
                      }}>
                        {page.path}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '800', fontSize: '1rem', color: 'hsl(var(--text-main))' }}>
                        {page.views.toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>sessions</span>
                    </td>
                    <td style={{ minWidth: '140px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '2px' }}>
                        <span>{pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'hsl(var(--border))', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.max(4, pct)}%`, height: '100%', backgroundColor: 'hsl(var(--primary))' }}></div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600' }}>{page.uniqueVisitors.toLocaleString()}</span>
                    </td>
                    <td>
                      <span style={{ color: 'hsl(var(--text-muted))', fontWeight: '500' }}>{page.avgTime}</span>
                    </td>
                    <td>
                      <span className={`badge ${parseFloat(page.bounceRate) < 30 ? 'badge-success' : 'badge-warning'}`}>
                        {page.bounceRate}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-primary" style={{ fontWeight: '700' }}>
                        {page.conversionRate}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        onClick={() => handleSimulateHit(page.id)}
                        title="Simulate user visiting this page"
                      >
                        <MousePointer size={12} /> +1 Visit
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredPages.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--text-muted))' }}>
                    No pages found matching "{pageSearch}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= REGISTER NEW PAGE MODAL POP-UP ================= */}
      {isAddPageModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          zIndex: 99999 
        }}
        onClick={() => setIsAddPageModalOpen(false)}
        >
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            width: '450px', 
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' 
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <PlusCircle size={20} style={{ color: 'hsl(var(--primary))' }} /> Register New Custom Page Route
              </h3>
              <button onClick={() => setIsAddPageModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddNewPage}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '700' }}>Page Title / Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Special Promotions, Equipment Rental Policy" 
                  value={newPageTitle} 
                  onChange={(e) => setNewPageTitle(e.target.value)} 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '700' }}>URL Route Path (Optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. /promotions, /rental-policy" 
                  value={newPageRoute} 
                  onChange={(e) => setNewPageRoute(e.target.value)} 
                />
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '4px', display: 'block' }}>
                  If left empty, a route path will be formatted automatically from the title.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsAddPageModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Register Page</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid segments for UTM & Funnel & Pixels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* UTM Campaign generator */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Target size={20} /> UTM Link Builder Campaign Generator
          </h3>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.8rem', marginBottom: '1.25rem' }}>Generate tracking links to attribute sales and clicks to social posts or ad banners.</p>
          
          <div className="form-group">
            <label className="form-label">UTM Source (Publisher)</label>
            <input type="text" className="form-input" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} placeholder="e.g. Facebook, Newsletter" />
          </div>

          <div className="form-group">
            <label className="form-label">UTM Campaign Identifier</label>
            <input type="text" className="form-input" value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} placeholder="e.g. FALL_EQUIP_RENT" />
          </div>

          <button type="button" className="btn btn-secondary" style={{ width: '100%', marginBottom: '1rem' }} onClick={generateUtmLink}>
            Generate Trackable URL
          </button>

          {generatedLink && (
            <div className="animate-fade-in" style={{ backgroundColor: 'hsl(var(--text-muted-light))', padding: '0.75rem', borderRadius: '6px', fontSize: '0.75rem', wordBreak: 'break-all' }}>
              <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>URL Result:</div>
              <code style={{ display: 'block', marginBottom: '0.5rem', color: 'hsl(var(--primary))' }}>{generatedLink}</code>
              <button type="button" className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} onClick={handleCopyLink}>
                <Clipboard size={12} /> Copy URL Link
              </button>
            </div>
          )}
        </div>

        {/* Sessions Funnel view */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={20} /> Conversion Funnel Diagnostics
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600' }}>
                <span>1. Total Active Sessions</span>
                <strong>{fn.sessions}</strong>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'hsl(var(--border))', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'hsl(var(--primary))' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600' }}>
                <span>2. Product Details Viewed</span>
                <strong>{fn.productViews} <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 'normal' }}>({viewPct}%)</span></strong>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'hsl(var(--border))', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${viewPct}%`, height: '100%', backgroundColor: 'hsl(var(--primary))' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600' }}>
                <span>3. Added item to Cart</span>
                <strong>{fn.addToCart} <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 'normal' }}>({cartPct}%)</span></strong>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'hsl(var(--border))', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((fn.addToCart/fn.sessions)*100)}%`, height: '100%', backgroundColor: 'hsl(var(--primary))' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600' }}>
                <span>4. Checkout Form Initiated</span>
                <strong>{fn.checkoutStarted} <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 'normal' }}>({checkPct}%)</span></strong>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'hsl(var(--border))', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((fn.checkoutStarted/fn.sessions)*100)}%`, height: '100%', backgroundColor: 'hsl(var(--primary))' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600' }}>
                <span>5. Completed Purchases</span>
                <strong>{fn.purchases} <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 'normal' }}>({buyPct}%)</span></strong>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'hsl(var(--border))', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((fn.purchases/fn.sessions)*100)}%`, height: '100%', backgroundColor: 'hsl(var(--accent))' }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* Pixel IDs form */}
        <form onSubmit={handleSavePixels} className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Users size={20} /> Social Tracking Pixel Sync
          </h3>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.8rem', marginBottom: '1.25rem' }}>Configure tracking keys to sync purchase and rental conversions directly to Google Ads and Meta platforms.</p>
          
          <div className="form-group">
            <label className="form-label">Facebook Meta Pixel ID</label>
            <input type="text" className="form-input" value={fbPixel} onChange={(e) => setFbPixel(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Google Ads Conversion Tag</label>
            <input type="text" className="form-input" value={googleTag} onChange={(e) => setGoogleTag(e.target.value)} />
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }}>Update Tracking Keys</button>
        </form>

      </div>

      {/* Campaigns traffic list summary */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>Active Campaign Performance</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid hsl(var(--border))', color: 'hsl(var(--text-muted))' }}>
              <th style={{ padding: '0.5rem' }}>Campaign ID</th>
              <th>Tracked Clicks</th>
              <th>Attributed Orders</th>
              <th>Total Revenue Generated</th>
              <th>Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {analytics.campaigns.map(camp => {
              const rate = camp.clicks > 0 ? ((camp.orders / camp.clicks) * 100).toFixed(1) : '0';
              return (
                <tr key={camp.name} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: '700', color: 'hsl(var(--primary))' }}>{camp.name}</td>
                  <td>{camp.clicks} clicks</td>
                  <td>{camp.orders} orders</td>
                  <td style={{ fontWeight: '700' }}>₹{camp.revenue.toLocaleString('en-IN')}</td>
                  <td><span className="badge badge-success">{rate}%</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Services leads booking list */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>Customer Care Leads Pipeline</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid hsl(var(--border))', color: 'hsl(var(--text-muted))' }}>
              <th style={{ padding: '0.5rem' }}>Date</th>
              <th>Customer</th>
              <th>Pincode</th>
              <th>Requested Care Need</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                <td style={{ padding: '0.75rem 0.5rem' }}>{lead.date}</td>
                <td>
                  <div style={{ fontWeight: '700' }}>{lead.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{lead.phone}</div>
                </td>
                <td>{lead.pincode}</td>
                <td style={{ maxWidth: '300px', wordBreak: 'break-all' }}>{lead.need}</td>
                <td>
                  <span className={`badge ${lead.status === 'new' ? 'badge-warning' : 'badge-warning'}`}>
                    {lead.status}
                  </span>
                </td>
                <td>
                  <select 
                    className="form-input" 
                    value={lead.status} 
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    style={{ padding: '0.25rem', fontSize: '0.8rem', width: '120px' }}
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
