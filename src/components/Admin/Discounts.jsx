import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, Tag, ToggleLeft, ToggleRight, Trash, Save } from 'lucide-react';

export default function Discounts() {
  const { discounts, addDiscount, toggleDiscountActive } = useContext(AppContext);
  
  // States
  const [isAdding, setIsAdding] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState('percentage'); // percentage | fixed | freeship
  const [value, setValue] = useState(0);
  const [minOrder, setMinOrder] = useState(1000);
  const [limit, setLimit] = useState(100);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code) return;
    
    addDiscount({
      code: code.toUpperCase().trim(),
      type,
      value: Number(value),
      minOrder: Number(minOrder),
      limit: Number(limit),
      isActive: true
    });

    setCode('');
    setValue(0);
    setMinOrder(1000);
    setLimit(100);
    setIsAdding(false);
    alert('Discount Coupon Code created successfully and is now active!');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Discounts & Campaigns</h1>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem' }}>Create coupon codes, set checkout eligibility rules, and track usage rates.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={16} /> Create Discount Code
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isAdding ? '1fr 380px' : '1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Side Coupons list table */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.25rem' }}>Active Coupon Rules</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid hsl(var(--border))', color: 'hsl(var(--text-muted))' }}>
                <th style={{ padding: '0.5rem' }}>Promo Code</th>
                <th>Discount Details</th>
                <th>Eligibility Rule</th>
                <th>Uses Log</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map(disc => (
                <tr key={disc.id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: '800', color: 'hsl(var(--primary))' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Tag size={14} /> {disc.code}
                    </div>
                  </td>
                  <td>
                    {disc.type === 'percentage' ? `${disc.value}% off items` :
                     disc.type === 'fixed' ? `₹${disc.value} outright discount` : 'Free Express shipping'}
                  </td>
                  <td>Min. Order: ₹{disc.minOrder}</td>
                  <td>{disc.usageCount} / {disc.limit} usages</td>
                  <td>
                    <button 
                      type="button" 
                      onClick={() => toggleDiscountActive(disc.id)}
                      style={{ color: disc.isActive ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}
                    >
                      {disc.isActive ? (
                        <>
                          <ToggleRight size={24} /> <span>Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={24} /> <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Side form */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="card animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>New Promo Code</h3>
              <button type="button" className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => setIsAdding(false)}>Close</button>
            </div>

            <div className="form-group">
              <label className="form-label">Coupon Code (Uppercase)</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={code} 
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} 
                placeholder="e.g. SAVE20" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Type</label>
              <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="percentage">Percentage Discount (%)</option>
                <option value="fixed">Fixed Flat Discount (₹)</option>
                <option value="freeship">Free Shipping</option>
              </select>
            </div>

            {type !== 'freeship' && (
              <div className="form-group">
                <label className="form-label">Discount Value</label>
                <input type="number" className="form-input" required min="1" value={value} onChange={(e) => setValue(e.target.value)} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Min. Order (₹)</label>
                <input type="number" className="form-input" required value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Usage Limit</label>
                <input type="number" className="form-input" required value={limit} onChange={(e) => setLimit(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid hsl(var(--border))', paddingTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Save size={14} /> Save Coupon
              </button>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
