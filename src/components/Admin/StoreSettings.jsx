import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import RolesSettings from './RolesSettings';
import { 
  Globe, MapPin, Percent, DollarSign, Save, 
  CheckCircle2, Building, CreditCard, 
  ChevronRight, Settings, MessageSquare, Shield
} from 'lucide-react';

export default function StoreSettings() {
  const { storeSettings, updateStoreSettings } = useContext(AppContext);

  // Side Menu Active Tab State: 'payments' | 'general' | 'domain' | 'location' | 'taxes' | 'shipping' | 'whatsapp'
  const [activeSettingsTab, setActiveSettingsTab] = useState('payments');

  // Form states initialized from storeSettings
  const [storeName, setStoreName] = useState(storeSettings?.storeName || 'AeonCare');
  const [slogan, setSlogan] = useState(storeSettings?.slogan || 'Caring for your family, right at home.');
  const [storeEmail, setStoreEmail] = useState(storeSettings?.storeEmail || 'support@aeoncare.in');
  const [storePhone, setStorePhone] = useState(storeSettings?.storePhone || '+91 98401 23456');
  const [whatsappPhone, setWhatsappPhone] = useState(storeSettings?.whatsappPhone || '+919840123456');

  const [domain, setDomain] = useState(storeSettings?.domain || 'aeoncare.in');

  const [addressLine1, setAddressLine1] = useState(storeSettings?.addressLine1 || '114 First Floor, Mount Poonamallee High Rd');
  const [addressLine2, setAddressLine2] = useState(storeSettings?.addressLine2 || 'Porur');
  const [city, setCity] = useState(storeSettings?.city || 'Chennai');
  const [state, setState] = useState(storeSettings?.state || 'Tamil Nadu');
  const [pincode, setPincode] = useState(storeSettings?.pincode || '600089');
  const [country, setCountry] = useState(storeSettings?.country || 'India');

  const [taxRate, setTaxRate] = useState(storeSettings?.taxRate || 12);
  const [gstNumber, setGstNumber] = useState(storeSettings?.gstNumber || '33AAAAA0000A1Z5');
  const [taxMode, setTaxMode] = useState(storeSettings?.taxMode || 'inclusive');

  const [currencySymbol, setCurrencySymbol] = useState(storeSettings?.currencySymbol || '₹');
  const [currencyCode, setCurrencyCode] = useState(storeSettings?.currencyCode || 'INR');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(storeSettings?.freeShippingThreshold || 2000);

  // Payment Gateway States
  const [enableRazorpay, setEnableRazorpay] = useState(storeSettings?.enableRazorpay !== undefined ? storeSettings.enableRazorpay : true);
  const [razorpayKeyId, setRazorpayKeyId] = useState(storeSettings?.razorpayKeyId || 'rzp_test_98401234567890');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState(storeSettings?.razorpayKeySecret || 'secret_key_demo_razorpay');
  const [razorpayMode, setRazorpayMode] = useState(storeSettings?.razorpayMode || 'test');
  const [razorpayMerchantName, setRazorpayMerchantName] = useState(storeSettings?.razorpayMerchantName || 'AeonCare Healthcare Supply');

  const [enablePayPal, setEnablePayPal] = useState(storeSettings?.enablePayPal !== undefined ? storeSettings.enablePayPal : true);
  const [paypalClientId, setPaypalClientId] = useState(storeSettings?.paypalClientId || 'client_id_paypal_aeoncare_98401');
  const [paypalSecretKey, setPaypalSecretKey] = useState(storeSettings?.paypalSecretKey || 'secret_key_paypal_aeoncare_98401');
  const [paypalMode, setPaypalMode] = useState(storeSettings?.paypalMode || 'sandbox');
  const [paypalCurrency, setPaypalCurrency] = useState(storeSettings?.paypalCurrency || 'USD');

  const [enableCod, setEnableCod] = useState(storeSettings?.enableCod !== undefined ? storeSettings.enableCod : true);
  const [enableUpiDirect, setEnableUpiDirect] = useState(storeSettings?.enableUpiDirect !== undefined ? storeSettings.enableUpiDirect : true);
  const [upiId, setUpiId] = useState(storeSettings?.upiId || 'aeoncare@okicici');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    updateStoreSettings({
      storeName,
      slogan,
      storeEmail,
      storePhone,
      whatsappPhone,
      domain: domain.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      taxRate: Number(taxRate),
      gstNumber,
      taxMode,
      currencySymbol,
      currencyCode,
      freeShippingThreshold: Number(freeShippingThreshold),
      enableRazorpay,
      razorpayKeyId,
      razorpayKeySecret,
      razorpayMode,
      razorpayMerchantName,
      enablePayPal,
      paypalClientId,
      paypalSecretKey,
      paypalMode,
      paypalCurrency,
      enableCod,
      enableUpiDirect,
      upiId
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const sideMenuCategories = [
    { id: 'payments', label: 'Razorpay & PayPal', desc: 'Online Order Gateways', icon: CreditCard, badge: 'Active' },
    { id: 'whatsapp', label: 'WhatsApp & SMS Alerts', desc: 'Automated Customer Notifications', icon: MessageSquare, badge: 'Live' },
    { id: 'general', label: 'Branding & Contact', desc: 'Store Name, Email & Helpline', icon: Building },
    { id: 'domain', label: 'Custom Domain & SEO', desc: 'Domain Link & Canonical URL', icon: Globe },
    { id: 'location', label: 'Store Location', desc: 'Physical Address & City', icon: MapPin },
    { id: 'taxes', label: 'Taxes & GST', desc: 'GSTIN & Tax Pricing Mode', icon: Percent },
    { id: 'shipping', label: 'Currency & Shipping', desc: 'Defaults & Shipping Limits', icon: DollarSign },
    { id: 'roles', label: 'Roles & Staff Permissions', desc: 'Manage Staff Scopes & Access', icon: Shield, badge: 'Security' }
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
            <Settings size={24} style={{ color: '#2563eb' }} />
            Store Settings
          </h1>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Select a configuration category from the side menu to view and update store parameters.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleSaveSettings} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', padding: '0.65rem 1.4rem' }}>
          <Save size={16} /> Save All Settings
        </button>
      </div>

      {savedSuccess && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.85rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
          <CheckCircle2 size={18} /> Store settings updated & synced across domain, location, tax, and SEO components!
        </div>
      )}

      {/* Main Layout Grid: Side Menu (260px) + Content Pane */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* SIDE MENU PANEL */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: '20px'
        }}>
          <div style={{ padding: '0.5rem 0.75rem 0.6rem', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Settings Categories
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {sideMenuCategories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeSettingsTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveSettingsTab(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#2563eb' : '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease-in-out',
                    borderLeft: isActive ? '4px solid #2563eb' : '4px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={18} style={{ color: isActive ? '#2563eb' : '#64748b', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: isActive ? '800' : '600', lineHeight: '1.2' }}>
                        {cat.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: isActive ? '#3b82f6' : '#94a3b8', marginTop: '2px' }}>
                        {cat.desc}
                      </div>
                    </div>
                  </div>
                  {cat.badge ? (
                    <span style={{ fontSize: '0.65rem', backgroundColor: isActive ? '#2563eb' : '#e2e8f0', color: isActive ? '#ffffff' : '#475569', padding: '1px 6px', borderRadius: '10px', fontWeight: '700' }}>
                      {cat.badge}
                    </span>
                  ) : (
                    <ChevronRight size={14} style={{ color: isActive ? '#2563eb' : '#cbd5e1' }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT CONTENT PANE */}
        <div>

          {/* 1. ONLINE PAYMENT GATEWAYS */}
          {activeSettingsTab === 'payments' && (
            <div className="card animate-fade-in" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={20} style={{ color: '#2563eb' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                    Online Payment Gateways (Razorpay & PayPal Integration)
                  </h3>
                </div>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                  Checkout Gateways
                </span>
              </div>

              {/* RAZORPAY SECTION */}
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem', backgroundColor: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ backgroundColor: '#02042b', color: '#3395ff', fontWeight: '800', fontSize: '0.85rem', padding: '4px 10px', borderRadius: '4px' }}>
                      Razorpay
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>Razorpay Gateway (UPI, Cards, NetBanking, Wallets)</strong>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', color: enableRazorpay ? '#16a34a' : '#64748b' }}>
                    <input 
                      type="checkbox" 
                      checked={enableRazorpay} 
                      onChange={(e) => setEnableRazorpay(e.target.checked)} 
                      style={{ accentColor: '#2563eb', width: '16px', height: '16px' }}
                    />
                    {enableRazorpay ? 'Active on Checkout' : 'Disabled'}
                  </label>
                </div>

                {enableRazorpay && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: '700' }}>Razorpay Key ID</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={razorpayKeyId} 
                          onChange={(e) => setRazorpayKeyId(e.target.value)} 
                          placeholder="rzp_live_..." 
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: '700' }}>Razorpay Key Secret</label>
                        <input 
                          type="password" 
                          className="form-input" 
                          value={razorpayKeySecret} 
                          onChange={(e) => setRazorpayKeySecret(e.target.value)} 
                          placeholder="••••••••••••••••" 
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: '700' }}>Gateway Environment Mode</label>
                        <select 
                          className="form-input" 
                          value={razorpayMode} 
                          onChange={(e) => setRazorpayMode(e.target.value)}
                        >
                          <option value="test">Test / Sandbox Mode (Simulated Payments)</option>
                          <option value="live">Live Production Mode (Real Banking)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Merchant Name Displayed on Checkout Modal</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={razorpayMerchantName} 
                        onChange={(e) => setRazorpayMerchantName(e.target.value)} 
                        placeholder="e.g. AeonCare Healthcare Supply" 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PAYPAL SECTION */}
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem', backgroundColor: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ backgroundColor: '#003087', color: '#0079C1', fontWeight: '800', fontSize: '0.85rem', padding: '4px 10px', borderRadius: '4px' }}>
                      PayPal
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>PayPal Express Checkout (International Cards & PayPal)</strong>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', color: enablePayPal ? '#16a34a' : '#64748b' }}>
                    <input 
                      type="checkbox" 
                      checked={enablePayPal} 
                      onChange={(e) => setEnablePayPal(e.target.checked)} 
                      style={{ accentColor: '#2563eb', width: '16px', height: '16px' }}
                    />
                    {enablePayPal ? 'Active on Checkout' : 'Disabled'}
                  </label>
                </div>

                {enablePayPal && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: '700' }}>PayPal Client ID</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={paypalClientId} 
                          onChange={(e) => setPaypalClientId(e.target.value)} 
                          placeholder="client_id_..." 
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: '700' }}>PayPal Secret Key</label>
                        <input 
                          type="password" 
                          className="form-input" 
                          value={paypalSecretKey} 
                          onChange={(e) => setPaypalSecretKey(e.target.value)} 
                          placeholder="••••••••••••••••" 
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: '700' }}>PayPal Currency & Mode</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <select 
                            className="form-input" 
                            value={paypalMode} 
                            onChange={(e) => setPaypalMode(e.target.value)}
                          >
                            <option value="sandbox">Sandbox Mode</option>
                            <option value="live">Live Production</option>
                          </select>
                          <select 
                            className="form-input" 
                            value={paypalCurrency} 
                            onChange={(e) => setPaypalCurrency(e.target.value)}
                            style={{ width: '90px' }}
                          >
                            <option value="USD">USD ($)</option>
                            <option value="INR">INR (₹)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ADDITIONAL ONLINE PAYMENT OPTIONS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', backgroundColor: '#ffffff' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#1e293b' }}>Direct UPI Payments (GooglePay / PhonePe)</strong>
                    <input 
                      type="checkbox" 
                      checked={enableUpiDirect} 
                      onChange={(e) => setEnableUpiDirect(e.target.checked)}
                    />
                  </label>
                  {enableUpiDirect && (
                    <input 
                      type="text" 
                      className="form-input" 
                      value={upiId} 
                      onChange={(e) => setUpiId(e.target.value)} 
                      placeholder="e.g. aeoncare@okicici"
                      style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}
                    />
                  )}
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', backgroundColor: '#ffffff' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#1e293b', display: 'block' }}>Cash on Delivery (COD)</strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Allow customers to pay upon delivery at home</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={enableCod} 
                      onChange={(e) => setEnableCod(e.target.checked)}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* WHATSAPP & SMS CATEGORY */}
          {activeSettingsTab === 'whatsapp' && (
            <div className="card animate-fade-in" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <MessageSquare size={20} style={{ color: '#16a34a' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>WhatsApp & SMS Delivery Alerts</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>WhatsApp Sender Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={whatsappPhone} 
                    onChange={(e) => setWhatsappPhone(e.target.value)} 
                    placeholder="+919840123456"
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    Formatted with country code without spaces (used for 1-click WhatsApp alerts).
                  </span>
                </div>

                <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#166534', display: 'block', marginBottom: '0.25rem' }}>✓ Automated WhatsApp & SMS Notification System Active</strong>
                  <p style={{ fontSize: '0.8rem', color: '#15803d', margin: 0 }}>
                    When customer orders are created, fulfilled, or shipped, admins can click <strong>"📲 Send WhatsApp Customer Alert"</strong> in the Orders page to send instant tracking and dispatch messages directly to the customer's phone number!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. STORE BRANDING */}
          {activeSettingsTab === 'general' && (
            <div className="card animate-fade-in" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <Building size={20} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Store Branding & Contact</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Store / Brand Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={storeName} 
                    onChange={(e) => setStoreName(e.target.value)} 
                    placeholder="e.g. AeonCare"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Brand Slogan / Tagline</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={slogan} 
                    onChange={(e) => setSlogan(e.target.value)} 
                    placeholder="e.g. Caring for your family, right at home."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Support Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={storeEmail} 
                    onChange={(e) => setStoreEmail(e.target.value)} 
                    placeholder="support@aeoncare.in"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Customer Helpline Phone</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={storePhone} 
                    onChange={(e) => setStorePhone(e.target.value)} 
                    placeholder="+91 98401 23456"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. DOMAIN & SEO */}
          {activeSettingsTab === 'domain' && (
            <div className="card animate-fade-in" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <Globe size={20} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Custom Domain & SEO Link Settings</h3>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: '700' }}>Store Custom Domain</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ backgroundColor: '#f1f5f9', padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRight: 'none', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                    https://
                  </span>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={domain} 
                    onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/^https?:\/\//, ''))} 
                    placeholder="e.g. aeoncare.in"
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Used in Google search snippets, canonical URLs, and shareable product links.
                </span>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#334155' }}>
                <strong>Live Canonical URL Format:</strong> <code style={{ color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>https://{domain || 'aeoncare.in'}/products/example-product</code>
              </div>
            </div>
          )}

          {/* 4. LOCATION */}
          {activeSettingsTab === 'location' && (
            <div className="card animate-fade-in" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <MapPin size={20} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Physical Store Location & Business Address</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Address Line 1</label>
                  <input type="text" className="form-input" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Address Line 2 / Area</label>
                  <input type="text" className="form-input" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">City</label>
                  <input type="text" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">State</label>
                  <input type="text" className="form-input" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Pincode</label>
                  <input type="text" className="form-input" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Country</label>
                  <input type="text" className="form-input" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* 5. TAXES */}
          {activeSettingsTab === 'taxes' && (
            <div className="card animate-fade-in" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <Percent size={20} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Taxes & GST Configuration</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>GST / Tax Rate (%)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={taxRate} 
                    onChange={(e) => setTaxRate(e.target.value)} 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>GSTIN / Tax ID Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={gstNumber} 
                    onChange={(e) => setGstNumber(e.target.value)} 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Tax Pricing Mode</label>
                  <select 
                    className="form-input" 
                    value={taxMode} 
                    onChange={(e) => setTaxMode(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <option value="inclusive">All prices include tax (Inclusive)</option>
                    <option value="exclusive">Calculate tax at checkout (Exclusive)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 6. SHIPPING */}
          {activeSettingsTab === 'shipping' && (
            <div className="card animate-fade-in" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <DollarSign size={20} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Currency & Express Shipping Defaults</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Currency Symbol</label>
                  <input type="text" className="form-input" value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Currency Code</label>
                  <input type="text" className="form-input" value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Free Express Shipping Threshold ({currencySymbol})</label>
                  <input type="number" className="form-input" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* 7. ROLES & STAFF PERMISSIONS */}
          {activeSettingsTab === 'roles' && (
            <div className="animate-fade-in">
              <RolesSettings />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
