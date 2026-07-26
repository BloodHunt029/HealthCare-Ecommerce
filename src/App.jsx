import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Storefront/Navbar';
import Home from './components/Storefront/Home';
import Catalog from './components/Storefront/Catalog';
import PDP from './components/Storefront/PDP';
import { CartDrawer, Checkout } from './components/Storefront/CartCheckout';
import Services from './components/Storefront/Services';
import BlogFAQ from './components/Storefront/BlogFAQ';
import UserPortal from './components/Storefront/UserPortal';
import SEOManager from './components/Storefront/SEOManager';

// Admin Imports
import Dashboard from './components/Admin/Dashboard';
import Orders from './components/Admin/Orders';
import Products from './components/Admin/Products';
import Customers from './components/Admin/Customers';
import OnlineStore from './components/Admin/OnlineStore';
import MarketingAnalytics from './components/Admin/MarketingAnalytics';
import Discounts from './components/Admin/Discounts';
import RolesSettings, { RoleAccessWrapper } from './components/Admin/RolesSettings';
import StoreSettings from './components/Admin/StoreSettings';
import ContentCMS from './components/Admin/ContentCMS';
import MarketsManager from './components/Admin/MarketsManager';
import AdminLogin from './components/Admin/AdminLogin';

import { 
  ShieldCheck, LayoutDashboard, ShoppingBag, FolderHeart, 
  Users, TicketPercent, Globe, Award, HelpCircle, ShieldAlert,
  MessageSquare, BookOpen, ArrowLeft, Settings, LogOut, Plus
} from 'lucide-react';

function AppContent() {
  const { layout, storeSettings, userRole, orders, trackPageView } = useContext(AppContext);
  
  // Navigation states (detect /admin route from URL)
  const [viewMode, setViewModeState] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/admin')) {
      return 'admin';
    }
    return 'storefront';
  });

  const setViewMode = (mode) => {
    setViewModeState(mode);
    if (typeof window !== 'undefined') {
      const targetPath = mode === 'admin' ? '/admin' : '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  // Sync route on browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.toLowerCase().startsWith('/admin')) {
        setViewModeState('admin');
      } else {
        setViewModeState('storefront');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Admin Authentication Session State
  const [adminAuthSession, setAdminAuthSession] = useState(() => {
    try {
      const saved = localStorage.getItem('aeon_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleAdminSignOut = () => {
    localStorage.removeItem('aeon_admin_session');
    setAdminAuthSession(null);
  };

  const [activeTab, setActiveTab] = useState('home'); // home | catalog | services | blog | userPortal | checkout
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard'); // dashboard | orders | products | customers | marketing | discounts | storefront | roles
  
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(true);

  // Track page views dynamically (works for existing & newly created pages)
  React.useEffect(() => {
    if (viewMode === 'storefront') {
      if (activeTab === 'catalog' && selectedProductId) {
        trackPageView?.('pdp', 'Product Details (PDP)', `/product/${selectedProductId}`);
      } else {
        const tabInfo = layout.navigationTabs?.find(t => t.id === activeTab);
        const pageName = tabInfo ? tabInfo.label : (activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' Page');
        const pagePath = `/${activeTab.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        trackPageView?.(activeTab, pageName, pagePath);
      }
    }
  }, [activeTab, selectedProductId, viewMode, layout.navigationTabs]);

  // Apply theme classes from layout
  const themeClass = `app-container theme-${layout.themeColors}`;

  const toggleCartOpen = () => setIsCartOpen(!isCartOpen);

  return (
    <div className={themeClass}>
      
      {viewMode === 'storefront' ? (
        /* ================= STOREFRONT MODE ================= */
        <>
          <SEOManager activeTab={activeTab} selectedProductId={selectedProductId} />
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            setViewMode={setViewMode} 
            toggleCartOpen={toggleCartOpen} 
          />
          
          <CartDrawer 
            isOpen={isCartOpen} 
            toggleCartOpen={toggleCartOpen} 
            setActiveTab={setActiveTab}
            setSelectedProductId={setSelectedProductId}
          />

          <main style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {activeTab === 'home' && (
              <Home 
                setActiveTab={setActiveTab} 
                setSelectedProductId={setSelectedProductId} 
              />
            )}
            
            {activeTab === 'catalog' && (
              selectedProductId ? (
                <PDP 
                  productId={selectedProductId} 
                  setSelectedProductId={setSelectedProductId} 
                  setActiveTab={setActiveTab} 
                />
              ) : (
                <Catalog 
                  selectedProductId={selectedProductId} 
                  setSelectedProductId={setSelectedProductId} 
                />
              )
            )}

            {activeTab === 'services' && <Services />}
            
            {activeTab === 'blog' && <BlogFAQ mode="blog" />}
            
            {activeTab === 'faq' && <BlogFAQ mode="faq" />}
            
            {activeTab === 'userPortal' && (
              <UserPortal 
                setSelectedProductId={setSelectedProductId}
                setActiveTab={setActiveTab}
                toggleCartOpen={toggleCartOpen}
              />
            )}

            {activeTab === 'checkout' && <Checkout setActiveTab={setActiveTab} />}
          </main>

          {/* WhatsApp floating widget */}
          <div 
            className="sticky-whatsapp-btn" 
            title="Chat on WhatsApp"
            onClick={() => window.open('https://wa.me/919840123456?text=Hello%20AeonCare,%20I%20have%20an%20equipment%20inquiry.', '_blank')}
          >
            <MessageSquare size={28} fill="white" stroke="none" />
          </div>

          {/* Storefront Footer */}
          {!layout?.hiddenSections?.includes('footer') && (
            <footer style={{ 
              backgroundColor: '#0f172a', 
              color: '#94a3b8', 
              padding: `${layout.sectionSizes?.footer?.paddingY !== undefined ? layout.sectionSizes.footer.paddingY : 48}px 1.5rem`, 
              borderTop: '1px solid hsl(var(--border))' 
            }}>
              <div style={{ 
                maxWidth: layout.sectionSizes?.footer?.isFullWidth ? '100%' : `${layout.sectionSizes?.footer?.width || 1280}px`, 
                margin: '0 auto', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '2rem' 
              }}>
                <div>
                  <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>{layout?.logoText || storeSettings?.storeName || 'AeonCare'}</h4>
                  <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>{layout?.footerText || storeSettings?.slogan || 'Trusted home patient care support, mobility aids, clinical diagnostic devices sales and supply hub in Chennai.'}</p>
                </div>
                <div>
                  <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>{layout?.footerSupportTitle || 'Support Hub'}</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <li><a href="#tel" onClick={() => setActiveTab('blog')}>FAQ Helpdesk</a></li>
                    <li><a href="#tel" onClick={() => setActiveTab('services')}>Request Home Setup</a></li>
                    <li><a href="#tel">Refund Policy</a></li>
                    <li><a href="#tel">Terms & Conditions</a></li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>{layout?.footerContactTitle || 'Contact Info'}</h4>
                  <p style={{ fontSize: '0.85rem', lineHeight: '1.6', whitespace: 'pre-line' }}>
                    {layout?.footerContactAddress || (storeSettings?.addressLine1 ? `${storeSettings.storeName}\n${storeSettings.addressLine1}, ${storeSettings.addressLine2 ? storeSettings.addressLine2 + ', ' : ''}${storeSettings.city}, ${storeSettings.state} - ${storeSettings.pincode}` : 'Aeon Healthcare Pvt Ltd, Besant Nagar, Chennai, TN 600090')}<br/>
                    Helpline: {layout?.footerContactPhone || storeSettings?.storePhone || '+91 98401 23456'}<br/>
                    Email: {layout?.footerContactEmail || storeSettings?.storeEmail || 'support@aeoncare.in'}
                  </p>
                </div>
              </div>
              <div style={{ maxWidth: layout.sectionSizes?.footer?.isFullWidth ? '100%' : `${layout.sectionSizes?.footer?.width || 1280}px`, margin: '2rem auto 0', borderTop: '1px solid #1e293b', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem' }}>
                <span>{layout.footerCopyrightText || '© 2026 AeonCare. Partner of AeonCare.in. India CDSCO labeling compliant. All rights reserved.'}</span>
                <a 
                  href="/admin" 
                  onClick={(e) => { e.preventDefault(); setViewMode('admin'); }} 
                  style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s ease', cursor: 'pointer' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#94a3b8'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#475569'}
                >
                  Staff Portal
                </a>
              </div>
            </footer>
          )}
        </>
      ) : (
        /* ================= ADMIN BACK-OFFICE MODE ================= */
        !adminAuthSession ? (
          <>
            <div className="system-banner" style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #475569' }}>
              <div className="mode-indicator">
                <span style={{ display: 'inline-block', backgroundColor: 'hsl(var(--primary))', color: 'white', borderRadius: '4px', padding: '2px 4px', fontWeight: 'bold', fontSize: '0.7rem' }}>ADMIN AUTH</span>
                <span>AeonCare Control Panel Staff Login</span>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}
                onClick={() => setViewMode('storefront')}
              >
                ← Return to Storefront
              </button>
            </div>
            <AdminLogin onLoginSuccess={(session) => setAdminAuthSession(session)} />
          </>
        ) : (
          <>
            {/* Admin Mode Top Header */}
            <div className="system-banner" style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #475569' }}>
              <div className="mode-indicator">
                <span style={{ display: 'inline-block', backgroundColor: 'hsl(var(--primary))', color: 'white', borderRadius: '4px', padding: '2px 4px', fontWeight: 'bold', fontSize: '0.7rem' }}>ADMIN</span>
                <span>AeonCare Control Panel</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1', fontSize: '0.78rem' }}>
                  Signed in: <strong style={{ color: '#60a5fa' }}>{adminAuthSession.email}</strong> ({userRole})
                </span>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  onClick={handleAdminSignOut}
                  title="Sign out of Admin Session"
                >
                  <LogOut size={12} /> Sign Out
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}
                  onClick={() => setViewMode('storefront')}
                >
                  ← Return to Storefront
                </button>
              </div>
            </div>

          <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar animate-fade-in">
              <div style={{ padding: '0 0.5rem 1rem', borderBottom: '1px solid hsl(var(--border))', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={20} style={{ color: 'hsl(var(--primary))' }} />
                <span style={{ fontWeight: '800', fontSize: '1rem' }}>AeonAdmin Suite</span>
              </div>

              {/* Home */}
              <button
                className={`admin-sidebar-link ${activeAdminTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('dashboard')}
              >
                <LayoutDashboard size={18} />
                <span>Home</span>
              </button>

              {/* Orders with Badge count */}
              <button
                className={`admin-sidebar-link ${activeAdminTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('orders')}
                style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShoppingBag size={18} />
                  <span>Orders</span>
                </div>
                <span style={{ 
                  backgroundColor: '#cbd5e1', 
                  color: '#1e293b', 
                  fontSize: '0.7rem', 
                  padding: '2px 6px', 
                  borderRadius: '10px', 
                  fontWeight: '700' 
                }}>
                  {orders ? orders.length + 37 : 39}
                </span>
              </button>

              {/* Products Item with Sub-Menus */}
              <button
                className={`admin-sidebar-link ${['products', 'collections', 'purchase_orders', 'transfers', 'gift_cards'].includes(activeAdminTab) ? 'active' : ''}`}
                onClick={() => {
                  setIsProductsMenuOpen(!isProductsMenuOpen);
                  setActiveAdminTab('products');
                }}
                style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FolderHeart size={18} />
                  <span>Products</span>
                </div>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                  {isProductsMenuOpen ? '▼' : '▶'}
                </span>
              </button>

              {/* Products Submenus Indented */}
              {isProductsMenuOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', paddingLeft: '1.5rem', marginTop: '0.2rem', marginBottom: '0.4rem' }}>
                  {[
                    { id: 'collections', label: 'Collections' },
                    { id: 'products', label: 'Inventory' },
                    { id: 'purchase_orders', label: 'Purchase orders' },
                    { id: 'transfers', label: 'Transfers' },
                    { id: 'gift_cards', label: 'Gift cards' }
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveAdminTab(sub.id)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: activeAdminTab === sub.id ? '700' : '500',
                        color: activeAdminTab === sub.id ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                        textAlign: 'left',
                        borderRadius: '4px',
                        backgroundColor: activeAdminTab === sub.id ? 'hsl(var(--secondary) / 0.5)' : 'transparent',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      • {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Customers */}
              <button
                className={`admin-sidebar-link ${activeAdminTab === 'customers' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('customers')}
              >
                <Users size={18} />
                <span>Customers</span>
              </button>

              {/* Growth */}
              <button
                className={`admin-sidebar-link ${activeAdminTab === 'marketing' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('marketing')}
              >
                <Globe size={18} />
                <span>Growth</span>
              </button>

              {/* Discounts */}
              <button
                className={`admin-sidebar-link ${activeAdminTab === 'discounts' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('discounts')}
              >
                <TicketPercent size={18} />
                <span>Discounts</span>
              </button>

              {/* Content */}
              <button
                className={`admin-sidebar-link ${activeAdminTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('content')}
              >
                <BookOpen size={18} />
                <span>Content</span>
              </button>

              {/* Markets */}
              <button
                className={`admin-sidebar-link ${activeAdminTab === 'markets' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('markets')}
              >
                <Globe size={18} />
                <span>Markets</span>
              </button>

              {/* Analytics */}
              <button
                className={`admin-sidebar-link ${activeAdminTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('analytics')}
              >
                <LayoutDashboard size={18} />
                <span>Analytics</span>
              </button>

              {/* Sales Channels Segment Header */}
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'hsl(var(--text-muted))', 
                fontWeight: '700', 
                padding: '0.75rem 0.5rem 0.25rem',
                textTransform: 'uppercase',
                borderTop: '1px solid hsl(var(--border))',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>Sales channels</span>
                <span>›</span>
              </div>

              {/* Online Store */}
              <button
                className={`admin-sidebar-link ${activeAdminTab === 'storefront' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('storefront')}
              >
                <Award size={18} />
                <span>Online Store</span>
              </button>

              {/* Store Settings */}
              <button
                className={`admin-sidebar-link ${activeAdminTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('settings')}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </aside>

            {/* Inner Content Grid */}
            <main className="admin-content">
                  {activeAdminTab === 'dashboard' && <Dashboard setActiveAdminTab={setActiveAdminTab} />}
                  
                  {activeAdminTab === 'orders' && (
                    <RoleAccessWrapper allowedRoles={['Super Admin', 'Order/Support Agent']} currentRole={userRole}>
                      <Orders />
                    </RoleAccessWrapper>
                  )}

                  {activeAdminTab === 'products' && (
                    <RoleAccessWrapper allowedRoles={['Super Admin', 'Store/Catalog Manager']} currentRole={userRole}>
                      <Products />
                    </RoleAccessWrapper>
                  )}

                  {activeAdminTab === 'collections' && (
                    <RoleAccessWrapper allowedRoles={['Super Admin', 'Store/Catalog Manager']} currentRole={userRole}>
                      <CollectionsManager />
                    </RoleAccessWrapper>
                  )}

                  {activeAdminTab === 'purchase_orders' && (
                    <RoleAccessWrapper allowedRoles={['Super Admin', 'Store/Catalog Manager']} currentRole={userRole}>
                      <MockAdminPanel title="Purchase Orders" desc="Record purchase orders, verify supplier inventories, and track inbound medical stock receipts." />
                    </RoleAccessWrapper>
                  )}

                  {activeAdminTab === 'transfers' && (
                    <RoleAccessWrapper allowedRoles={['Super Admin', 'Store/Catalog Manager']} currentRole={userRole}>
                      <MockAdminPanel title="Inventory Transfers" desc="Track medical equipment shipments and stock movements between warehouse centers and local Chennai showrooms." />
                    </RoleAccessWrapper>
                  )}

                  {activeAdminTab === 'gift_cards' && (
                    <RoleAccessWrapper allowedRoles={['Super Admin', 'Marketing Manager']} currentRole={userRole}>
                      <MockAdminPanel title="Gift Cards & Credits" desc="Issue, inspect, and configure medical patient wellness gift vouchers and credit logs." />
                    </RoleAccessWrapper>
                  )}

                  {activeAdminTab === 'customers' && (
                    <RoleAccessWrapper allowedRoles={['Super Admin', 'Order/Support Agent']} currentRole={userRole}>
                      <Customers />
                    </RoleAccessWrapper>
                  )}

                  {(activeAdminTab === 'analytics' || activeAdminTab === 'marketing') && (
                    <RoleAccessWrapper allowedRoles={['Super Admin', 'Marketing Manager']} currentRole={userRole}>
                      <MarketingAnalytics />
                    </RoleAccessWrapper>
                  )}

                  {activeAdminTab === 'discounts' && (
                    <RoleAccessWrapper allowedRoles={['Super Admin', 'Marketing Manager']} currentRole={userRole}>
                      <Discounts />
                    </RoleAccessWrapper>
                  )}

                  {activeAdminTab === 'content' && (
                    <RoleAccessWrapper allowedRoles={['Super Admin', 'Store/Catalog Manager', 'Content Editor']} currentRole={userRole}>
                      <ContentCMS />
                    </RoleAccessWrapper>
                  )}

                  {activeAdminTab === 'markets' && (
                    <RoleAccessWrapper allowedRoles={['Super Admin']} currentRole={userRole}>
                      <MarketsManager />
                    </RoleAccessWrapper>
                  )}

                  {activeAdminTab === 'storefront' && (
                    <RoleAccessWrapper allowedRoles={['Super Admin', 'Store/Catalog Manager', 'Content Editor']} currentRole={userRole}>
                      <OnlineStore />
                    </RoleAccessWrapper>
                  )}


                  {activeAdminTab === 'settings' && (
                    <RoleAccessWrapper allowedRoles={['Super Admin']} currentRole={userRole}>
                      <StoreSettings />
                    </RoleAccessWrapper>
                  )}
            </main>
          </div>
        </>
      )
    )}

    </div>
  );
}

function CollectionsManager() {
  const { layout, updateLayout, products, setProducts, updateProduct } = useContext(AppContext);
  const collections = layout.collectionsList || [];
  
  const [editingIndex, setEditingIndex] = useState(null);
  const [editColName, setEditColName] = useState('');
  const [editColImage, setEditColImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [tempSelectedIds, setTempSelectedIds] = useState([]);

  // JPG File Uploader inside Collection editor
  const handleJpgCollectionUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'image/jpeg' && !file.name.toLowerCase().endsWith('.jpg') && !file.name.toLowerCase().endsWith('.jpeg')) {
      alert('Only JPG/JPEG files are allowed!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setEditColImage(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleStartEdit = (idx) => {
    setEditingIndex(idx);
    setEditColName(collections[idx]?.name || '');
    setEditColImage(collections[idx]?.image || '');
  };

  const handleCreateCollection = () => {
    const newName = `New Collection ${collections.length + 1}`;
    const newCol = { 
      name: newName, 
      slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), 
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200' 
    };
    const updated = [...collections, newCol];
    updateLayout({ collectionsList: updated });
    const newIdx = updated.length - 1;
    setEditingIndex(newIdx);
    setEditColName(newCol.name);
    setEditColImage(newCol.image);
  };

  const handleDeleteCollection = (idxToDelete) => {
    const colToDeleteName = collections[idxToDelete]?.name;
    if (window.confirm(`Are you sure you want to delete collection "${colToDeleteName}"?`)) {
      const updated = collections.filter((_, i) => i !== idxToDelete);
      updateLayout({ collectionsList: updated });
      setEditingIndex(null);
    }
  };

  const handleSaveCollectionDetails = () => {
    const targetName = editColName.trim() || collections[editingIndex]?.name || 'Collection';
    const updatedColls = [...collections];
    updatedColls[editingIndex] = { 
      ...updatedColls[editingIndex],
      name: targetName, 
      slug: targetName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      image: editColImage 
    };
    updateLayout({ collectionsList: updatedColls });
    alert('Collection details saved successfully!');
  };

  const handleOpenProductSelector = () => {
    const targetName = editColName.trim() || collections[editingIndex]?.name || '';
    const currentProductIds = products
      .filter(p => p.category && p.category.toLowerCase().trim() === targetName.toLowerCase().trim())
      .map(p => p.id);
    setTempSelectedIds(currentProductIds);
    setModalSearch('');
    setIsModalOpen(true);
  };

  const handleApplyProductsToCollection = () => {
    const targetName = editColName.trim() || collections[editingIndex]?.name || 'Collection';
    
    // Save collection details first
    const updatedColls = [...collections];
    updatedColls[editingIndex] = { 
      ...updatedColls[editingIndex],
      name: targetName, 
      slug: targetName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      image: editColImage 
    };
    updateLayout({ collectionsList: updatedColls });

    // Single pass batch update to update products list cleanly
    const updatedProducts = products.map(p => {
      const isSelected = tempSelectedIds.includes(p.id);
      const currentlyInCol = p.category && p.category.toLowerCase().trim() === targetName.toLowerCase().trim();

      if (isSelected && !currentlyInCol) {
        return { ...p, category: targetName };
      } else if (!isSelected && currentlyInCol) {
        return { ...p, category: 'Home Care' };
      }
      return p;
    });

    setProducts(updatedProducts);
    setIsModalOpen(false);
    alert(`Successfully linked ${tempSelectedIds.length} product(s) to collection "${targetName}"!`);
  };

  const toggleModalProduct = (id) => {
    setTempSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="animate-fade-in">
      {editingIndex === null ? (
        /* ================= COLLECTIONS OVERVIEW ================= */
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>Collections</h1>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem' }}>Organize store products into collections featured on the storefront.</p>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={handleCreateCollection}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={16} /> Create collection
            </button>
          </div>

          <div className="grid-auto">
            {collections.map((col, idx) => {
              const matchedProducts = products.filter(p => p.category.toLowerCase() === col.name.toLowerCase());
              return (
                <div key={idx} className="card card-hover" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', backgroundColor: 'white' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <img src={col.image} alt={col.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'hsl(var(--text-main))', marginBottom: '0.25rem' }}>{col.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '600' }}>{matchedProducts.length} items linked in catalog</span>
                  </div>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} 
                    onClick={() => handleStartEdit(idx)}
                  >
                    Edit Collection
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* ================= COLLECTIONS DETAILED EDITOR PANEL ================= */
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Header Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => setEditingIndex(null)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={18} />
              </button>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>
                Collection details
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => handleDeleteCollection(editingIndex)}
                style={{ color: '#ef4444', borderColor: '#fecdd3' }}
              >
                Delete collection
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSaveCollectionDetails}
              >
                Save details
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Left Content Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Core Details */}
              <div className="card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '700' }}>Collection Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editColName}
                    onChange={(e) => setEditColName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Cover Image (Only JPG)</label>
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg"
                    onChange={handleJpgCollectionUpload}
                    style={{ fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}
                  />
                  {editColImage && (
                    <img src={editColImage} alt="Cover Preview" style={{ width: '80px', height: '80px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '6px', marginTop: '0.75rem' }} />
                  )}
                </div>
              </div>

              {/* Products in this Collection */}
              <div className="card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>Collection Products</h3>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                    onClick={handleOpenProductSelector}
                  >
                    Select products to include
                  </button>
                </div>

                {/* List currently selected products */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {products
                    .filter(p => p.category && p.category.toLowerCase().trim() === (editColName.trim() || collections[editingIndex]?.name || '').toLowerCase().trim())
                    .map(p => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <img src={p.image} alt={p.title} style={{ width: '36px', height: '36px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>{p.title}</span>
                      </div>
                    ))}
                  {products.filter(p => p.category && p.category.toLowerCase().trim() === (editColName.trim() || collections[editingIndex]?.name || '').toLowerCase().trim()).length === 0 && (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>No products linked to this collection yet.</span>
                  )}
                </div>
              </div>

              {/* Search Engine Listing Card for Collection (Identical to Product Page SEO) */}
              <div className="card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>Search engine listing</h3>
                
                {/* SERP Snippet Preview */}
                <div style={{ marginBottom: '1.25rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#5f6368', fontSize: '11px', marginBottom: '2px' }}>
                    https://aeoncare.in/collections/{collections[editingIndex].slug || collections[editingIndex].name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')}
                  </div>
                  <h5 style={{ color: '#1a0dab', fontSize: '15px', fontWeight: 'normal', margin: 0 }}>
                    {collections[editingIndex].metaTitle || `${collections[editingIndex].name} Collection - Buy Online | AeonCare`}
                  </h5>
                  <p style={{ color: '#4d5156', margin: '4px 0 0', fontSize: '12px', lineHeight: '1.4' }}>
                    {collections[editingIndex].metaDescription || `Explore top-rated ${collections[editingIndex].name} medical supplies, clinical equipment, and patient care essentials with doorstep setup in Chennai.`}
                  </p>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className="form-label">Page title</label>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{(collections[editingIndex].metaTitle || '').length} of 70 characters used</span>
                  </div>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder={`${collections[editingIndex].name} Collection - Buy Online | AeonCare`}
                    value={collections[editingIndex].metaTitle || ''} 
                    onChange={(e) => {
                      const updated = [...collections];
                      updated[editingIndex].metaTitle = e.target.value;
                      updateLayout({ collectionsList: updated });
                    }} 
                    maxLength={70}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className="form-label">Meta description</label>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{(collections[editingIndex].metaDescription || '').length} of 320 characters used</span>
                  </div>
                  <textarea 
                    className="form-input" 
                    style={{ minHeight: '65px', fontFamily: 'inherit' }}
                    placeholder={`Explore top-rated ${collections[editingIndex].name} medical supplies with doorstep setup.`}
                    value={collections[editingIndex].metaDescription || ''} 
                    onChange={(e) => {
                      const updated = [...collections];
                      updated[editingIndex].metaDescription = e.target.value;
                      updateLayout({ collectionsList: updated });
                    }} 
                    maxLength={320}
                  ></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">URL handle</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder={collections[editingIndex].name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')}
                    value={collections[editingIndex].slug || ''} 
                    onChange={(e) => {
                      const updated = [...collections];
                      updated[editingIndex].slug = e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
                      updateLayout({ collectionsList: updated });
                    }} 
                  />
                </div>
              </div>

            </div>

            {/* Right details summary */}
            <div className="card" style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>Status</h4>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>Active on Storefront</div>
            </div>

          </div>

          {/* ================= "SELECT PRODUCTS TO INCLUDE" MODAL POP-UP (IMAGE 3) ================= */}
          {isModalOpen && (
            <div style={{ 
              position: 'fixed', 
              top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: 'rgba(0, 0, 0, 0.45)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 9999 
            }}
            onClick={() => setIsModalOpen(false)}
            >
              <div style={{ 
                width: '600px', 
                maxHeight: '80vh', 
                backgroundColor: '#ffffff', 
                borderRadius: '12px', 
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden' 
              }}
              onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Select products to include</h3>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#94a3b8', fontWeight: 'bold' }}
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Search Filter bar */}
                <div style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '0.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <input 
                    type="text" 
                    placeholder="Search products" 
                    className="form-input" 
                    value={modalSearch} 
                    onChange={(e) => setModalSearch(e.target.value)}
                    style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} 
                  />
                  <select style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.4rem', fontSize: '0.8rem', fontWeight: '600' }}>
                    <option>Search by All</option>
                  </select>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => alert('Filter queries are pre-sorted.')}>+ Add filter</button>
                </div>

                {/* Modal Scrollable Checklist */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
                  {products
                    .filter(p => p.title.toLowerCase().includes(modalSearch.toLowerCase()))
                    .map(p => {
                      const isChecked = tempSelectedIds.includes(p.id);
                      return (
                        <div 
                          key={p.id} 
                          onClick={() => toggleModalProduct(p.id)}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem', 
                            padding: '0.6rem 0.5rem', 
                            borderBottom: '1px solid #f1f5f9', 
                            cursor: 'pointer',
                            backgroundColor: isChecked ? '#f8fafc' : 'transparent' 
                          }}
                        >
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => {}} // toggled by row click
                            style={{ width: '16px', height: '16px', accentColor: '#2563eb', pointerEvents: 'none' }} 
                          />
                          <img src={p.image} alt={p.title} style={{ width: '40px', height: '40px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: 'white' }} />
                          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <span style={{ fontSize: '0.825rem', fontWeight: '600', color: '#1e293b' }}>{p.title}</span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Category: {p.category}</span>
                          </div>
                          {p.stock === 0 && (
                            <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Archived</span>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* Modal Footer */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', backgroundColor: '#f8fafc' }}>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 1.25rem' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button className="btn btn-primary" style={{ padding: '0.4rem 1.25rem' }} onClick={handleApplyProductsToCollection}>Add</button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

function MockAdminPanel({ title, desc }) {
  return (
    <div className="card text-center animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '3rem auto' }}>
      <div style={{ backgroundColor: 'hsl(var(--secondary))', color: 'hsl(var(--secondary-foreground))', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <LayoutDashboard size={28} />
      </div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>{title} Dashboard</h2>
      <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginBottom: '1.5rem', lineHeight: '1.5' }}>
        {desc}
      </p>
      <div className="badge badge-primary">Phase 2 Candidate</div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught runtime error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          color: '#1e293b',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🩺</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>AeonCare Health Storefront</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '500px', marginBottom: '1rem', lineHeight: '1.5' }}>
            We encountered a cached layout error. Clicking reset will restore standard store defaults and reload the page cleanly.
          </p>

          {this.state.error?.message && (
            <div style={{ fontSize: '0.75rem', color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.5rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
              Error: {this.state.error.message}
            </div>
          )}

          <button 
            onClick={this.handleReset}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
            }}
          >
            🔄 Reset App Cache & Reload Store
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
