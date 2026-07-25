import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Globe, DollarSign, Plus, Edit3, Trash2, CheckCircle2, 
  MapPin, Truck, Percent, ShieldCheck, ArrowRightLeft, 
  Settings, ChevronRight, X, Sparkles
} from 'lucide-react';

export default function MarketsManager() {
  const { storeSettings, updateStoreSettings } = useContext(AppContext);

  const [marketsList, setMarketsList] = useState([
    {
      id: 'm1',
      name: 'India Domestic Market',
      isPrimary: true,
      status: 'Active',
      regions: ['Tamil Nadu', 'Karnataka', 'Kerala', 'Maharashtra', 'Delhi NCR', 'Pan-India'],
      currency: 'INR (₹)',
      currencySymbol: '₹',
      exchangeRate: 1.0,
      taxMode: 'GST Inclusive (12%)',
      domain: 'aeoncare.in',
      shippingMethod: 'Express Technician Setup (Chennai) + Cargo Courier',
      ordersCount: 1420
    },
    {
      id: 'm2',
      name: 'International & GCC Export Region',
      isPrimary: false,
      status: 'Active',
      regions: ['United States', 'United Arab Emirates', 'United Kingdom', 'Singapore', 'Global'],
      currency: 'USD ($)',
      currencySymbol: '$',
      exchangeRate: 83.00,
      taxMode: 'Export Duty Exempt',
      domain: 'global.aeoncare.in',
      shippingMethod: 'DHL / FedEx International Priority Express',
      ordersCount: 185
    },
    {
      id: 'm3',
      name: 'Chennai Metro Immediate Zone',
      isPrimary: false,
      status: 'Active',
      regions: ['Chennai City', 'Porur', 'Velachery', 'Anna Nagar', 'OMR Corridor'],
      currency: 'INR (₹)',
      currencySymbol: '₹',
      exchangeRate: 1.0,
      taxMode: 'GST Inclusive (12%)',
      domain: 'chennai.aeoncare.in',
      shippingMethod: '4-Hour Same Day Doorstep Setup',
      ordersCount: 890
    }
  ]);

  // Converter Tool State
  const [convertAmountInr, setConvertAmountInr] = useState(10000);
  const [selectedTargetCurrency, setSelectedTargetCurrency] = useState('USD');

  // New Market Modal State
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);

  const [marketName, setMarketName] = useState('');
  const [marketRegions, setMarketRegions] = useState('');
  const [marketCurrency, setMarketCurrency] = useState('USD ($)');
  const [marketExchangeRate, setMarketExchangeRate] = useState(83.00);
  const [marketTaxMode, setMarketTaxMode] = useState('GST Inclusive (12%)');
  const [marketDomain, setMarketDomain] = useState('');
  const [marketShipping, setMarketShipping] = useState('');

  const handleOpenNewMarketModal = () => {
    setEditingMarket(null);
    setMarketName('');
    setMarketRegions('Sri Lanka, Maldives, SEA');
    setMarketCurrency('USD ($)');
    setMarketExchangeRate(83.00);
    setMarketTaxMode('Export Duty Exempt');
    setMarketDomain('sea.aeoncare.in');
    setMarketShipping('Regional Cargo Maritime');
    setShowMarketModal(true);
  };

  const handleOpenEditMarketModal = (market) => {
    setEditingMarket(market);
    setMarketName(market.name);
    setMarketRegions(market.regions.join(', '));
    setMarketCurrency(market.currency);
    setMarketExchangeRate(market.exchangeRate);
    setMarketTaxMode(market.taxMode);
    setMarketDomain(market.domain);
    setMarketShipping(market.shippingMethod);
    setShowMarketModal(true);
  };

  const handleSaveMarket = (e) => {
    e.preventDefault();
    if (!marketName) return;

    const formattedRegions = marketRegions.split(',').map(r => r.trim()).filter(Boolean);

    if (editingMarket) {
      setMarketsList(prev => prev.map(m => m.id === editingMarket.id ? {
        ...m,
        name: marketName,
        regions: formattedRegions,
        currency: marketCurrency,
        exchangeRate: Number(marketExchangeRate),
        taxMode: marketTaxMode,
        domain: marketDomain,
        shippingMethod: marketShipping
      } : m));
    } else {
      const newMarket = {
        id: `m-${Date.now()}`,
        name: marketName,
        isPrimary: false,
        status: 'Active',
        regions: formattedRegions,
        currency: marketCurrency,
        currencySymbol: marketCurrency.includes('$') ? '$' : '₹',
        exchangeRate: Number(marketExchangeRate),
        taxMode: marketTaxMode,
        domain: marketDomain || `${marketName.toLowerCase().replace(/\s+/g, '')}.aeoncare.in`,
        shippingMethod: marketShipping || 'Standard Logistics',
        ordersCount: 0
      };
      setMarketsList([...marketsList, newMarket]);
    }

    setShowMarketModal(false);
  };

  const toggleMarketStatus = (id) => {
    setMarketsList(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m));
  };

  const handleDeleteMarket = (id) => {
    if (marketsList.find(m => m.id === id)?.isPrimary) {
      alert('Primary market cannot be deleted.');
      return;
    }
    setMarketsList(prev => prev.filter(m => m.id !== id));
  };

  // Convert calculation
  const calculatedUsd = (convertAmountInr / 83.00).toFixed(2);
  const calculatedEur = (convertAmountInr / 90.50).toFixed(2);
  const calculatedAed = (convertAmountInr / 22.60).toFixed(2);

  return (
    <div className="animate-fade-in" style={{ padding: '0 0.5rem 3rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Globe size={24} style={{ color: '#0d9488' }} /> Markets & Currencies Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
            Configure localized Chennai metro delivery zones vs. international export markets, exchange rate multipliers, and GST tax rules.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenNewMarketModal} style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Market Region
        </button>
      </div>

      {/* Top Currency Converter Tool Widget */}
      <div className="card" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <ArrowRightLeft size={18} style={{ color: '#16a34a' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#166534', margin: 0 }}>
            Real-Time Currency Exchange Converter Tool
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d', display: 'block', marginBottom: '4px' }}>Base Amount (INR ₹)</label>
            <input 
              type="number" 
              className="form-input" 
              value={convertAmountInr} 
              onChange={(e) => setConvertAmountInr(Number(e.target.value))}
              style={{ backgroundColor: '#ffffff', fontWeight: '800', color: '#166534' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>US DOLLAR (USD $)</div>
              <strong style={{ fontSize: '1.1rem', color: '#166534' }}>${calculatedUsd}</strong>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>EURO (EUR €)</div>
              <strong style={{ fontSize: '1.1rem', color: '#166534' }}>€{calculatedEur}</strong>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>UAE DIRHAM (AED)</div>
              <strong style={{ fontSize: '1.1rem', color: '#166534' }}>{calculatedAed} AED</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Markets Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {marketsList.map(market => (
          <div key={market.id} className="card animate-fade-in" style={{ padding: '1.5rem', border: market.isPrimary ? '2px solid #0d9488' : '1px solid #e2e8f0', borderRadius: '12px' }}>
            
            {/* Top Title & Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Globe size={22} style={{ color: market.isPrimary ? '#0d9488' : '#3b82f6' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{market.name}</h3>
                    {market.isPrimary && (
                      <span style={{ fontSize: '0.7rem', backgroundColor: '#0d9488', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: '800' }}>
                        PRIMARY MARKET
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Canonical Subdomain: <strong>{market.domain}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', color: market.status === 'Active' ? '#16a34a' : '#64748b' }}>
                  <input 
                    type="checkbox" 
                    checked={market.status === 'Active'} 
                    onChange={() => toggleMarketStatus(market.id)}
                    style={{ accentColor: '#0d9488', width: '16px', height: '16px' }}
                  />
                  {market.status}
                </label>

                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => handleOpenEditMarketModal(market)}
                  style={{ fontSize: '0.75rem', fontWeight: '700' }}
                >
                  <Edit3 size={14} /> Configure
                </button>

                {!market.isPrimary && (
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDeleteMarket(market.id)}
                    style={{ color: '#ef4444', padding: '0.25rem 0.4rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', marginBottom: '4px', textTransform: 'uppercase' }}>Target Geographic Regions</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {market.regions.map((reg, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#1e293b', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                      {reg}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', marginBottom: '4px', textTransform: 'uppercase' }}>Currency & Rate</strong>
                <div style={{ fontWeight: '700', color: '#1e293b' }}>{market.currency}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Rate Multiplier: 1 USD = ₹{market.exchangeRate} INR</div>
              </div>

              <div>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', marginBottom: '4px', textTransform: 'uppercase' }}>Tax & Customs Policy</strong>
                <div style={{ fontWeight: '700', color: '#0f766e' }}>{market.taxMode}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Automated B2B GST Calculation</div>
              </div>

              <div>
                <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', marginBottom: '4px', textTransform: 'uppercase' }}>Fulfillment & Shipping</strong>
                <div style={{ fontWeight: '700', color: '#1e293b' }}>{market.shippingMethod}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Orders: <strong>{market.ordersCount}</strong></div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* NEW / EDIT MARKET MODAL */}
      {showMarketModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
          zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ backgroundColor: '#ffffff', maxWidth: '540px', width: '100%', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={20} style={{ color: '#0d9488' }} /> {editingMarket ? `Configure Market: ${editingMarket.name}` : 'Create New Market Region'}
              </h3>
              <button type="button" onClick={() => setShowMarketModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveMarket} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>Market Name *</label>
                <input type="text" className="form-input" required placeholder="e.g. Gulf GCC Region" value={marketName} onChange={(e) => setMarketName(e.target.value)} />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>Included Countries / States (Comma Separated)</label>
                <input type="text" className="form-input" placeholder="e.g. UAE, Saudi Arabia, Qatar, Oman" value={marketRegions} onChange={(e) => setMarketRegions(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Base Currency</label>
                  <select className="form-input" value={marketCurrency} onChange={(e) => setMarketCurrency(e.target.value)}>
                    <option value="INR (₹)">Indian Rupee (INR ₹)</option>
                    <option value="USD ($)">US Dollar (USD $)</option>
                    <option value="EUR (€)">Euro (EUR €)</option>
                    <option value="AED">UAE Dirham (AED)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Exchange Rate (vs 1 USD)</label>
                  <input type="number" step="0.01" className="form-input" value={marketExchangeRate} onChange={(e) => setMarketExchangeRate(e.target.value)} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>Tax & Customs Policy</label>
                <select className="form-input" value={marketTaxMode} onChange={(e) => setMarketTaxMode(e.target.value)}>
                  <option value="GST Inclusive (12%)">GST Inclusive (12% Domestic India)</option>
                  <option value="Export Duty Exempt">Export Duty Exempt (International)</option>
                  <option value="Import Customs Added at Checkout">Import Customs Added at Checkout</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>Shipping Channel</label>
                <input type="text" className="form-input" placeholder="e.g. DHL / FedEx International Priority" value={marketShipping} onChange={(e) => setMarketShipping(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowMarketModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: '700' }}>Save Market Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
