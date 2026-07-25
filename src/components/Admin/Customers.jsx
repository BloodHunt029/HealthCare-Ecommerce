import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { UserPlus, Search, PhoneCall, ShoppingCart, User, PlusCircle, Check } from 'lucide-react';

export default function Customers() {
  const { customers, setCustomers, products, createOrder } = useContext(AppContext);
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isCreatingManual, setIsCreatingManual] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Manual Customer Fields
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custLocation, setCustLocation] = useState('Chennai');

  // Manual Order/Phone Call Booking Fields
  const [selectedProductId, setSelectedProductId] = useState('');
  const [orderQty, setOrderQty] = useState(1);
  const [shipAddress, setShipAddress] = useState('');
  const [shipPincode, setShipPincode] = useState('');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Filter lists
  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchName = c.name.toLowerCase().includes(q);
    const matchEmail = c.email.toLowerCase().includes(q);
    const matchPhone = c.phone.includes(q);
    return matchName || matchEmail || matchPhone;
  });

  const handleCreateCustomerAndOrder = (e) => {
    e.preventDefault();
    if (!custName || !custPhone) return;

    // Create the customer first in local state
    const nextCustId = `c${customers.length + 1}`;
    const newCust = {
      id: nextCustId,
      name: custName,
      email: custEmail || `${custName.toLowerCase().replace(/ /g, '')}@aeoncare.in`,
      phone: custPhone,
      location: custLocation,
      ordersCount: 0,
      totalSpent: 0,
      tags: ['Phone client', 'Manual Creation']
    };

    setCustomers(prev => [...prev, newCust]);

    // If a product was selected, create a manual order immediately
    if (selectedProductId) {
      const prod = products.find(p => p.id === selectedProductId);
      if (prod) {
        const orderPayload = {
          customerName: custName,
          customerEmail: newCust.email,
          customerPhone: custPhone,
          items: [{
            id: prod.id,
            title: prod.title,
            price: prod.price,
            type: 'buy',
            qty: Number(orderQty),
            image: prod.image
          }],
          subtotal: prod.price * Number(orderQty),
          depositTotal: 0,
          discountAmount: 0,
          shippingFee: 150,
          total: (prod.price * Number(orderQty)) + 150,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          status: 'pending',
          shippingAddress: {
            name: custName,
            phone: custPhone,
            address: shipAddress || 'Phone request address details',
            city: custLocation,
            pincode: shipPincode || '600001'
          },
          orderType: 'buy',
          rentalTerms: null,
          gstDetails: null
        };
        createOrder(orderPayload);
      }
    }

    setSuccessMsg('✓ Customer created and manual order placed successfully!');
    setCustName('');
    setCustPhone('');
    setCustEmail('');
    setShipAddress('');
    setShipPincode('');
    setSelectedProductId('');
    setOrderQty(1);
    setIsCreatingManual(false);

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="animate-fade-in">
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Customers CRM</h1>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem' }}>View client total spent, segments, and record manual phone-in sales.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreatingManual(true)}>
          <UserPlus size={16} /> Register Phone Order
        </button>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: 'hsl(var(--success-bg))', color: 'hsl(var(--success))', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
          {successMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: (selectedCustomerId || isCreatingManual) ? '1fr 450px' : '1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Side Customer list grid */}
        <div className="card" style={{ padding: '1.25rem' }}>
          
          <div className="form-group" style={{ maxWidth: '400px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid hsl(var(--border))', color: 'hsl(var(--text-muted))' }}>
                  <th style={{ padding: '0.5rem' }}>Customer Name</th>
                  <th>Contact info</th>
                  <th>Location</th>
                  <th>Orders logged</th>
                  <th>Total Spent</th>
                  <th>Segment tags</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(c => (
                  <tr 
                    key={c.id} 
                    style={{ 
                      borderBottom: '1px solid hsl(var(--border))',
                      cursor: 'pointer',
                      backgroundColor: selectedCustomerId === c.id ? 'hsl(var(--secondary) / 0.3)' : 'transparent'
                    }}
                    onClick={() => { setSelectedCustomerId(c.id); setIsCreatingManual(false); }}
                  >
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: '700' }}>{c.name}</td>
                    <td>
                      <div>{c.email}</div>
                      <div style={{ color: 'hsl(var(--text-muted))', fontSize: '0.75rem' }}>{c.phone}</div>
                    </td>
                    <td>{c.location}</td>
                    <td style={{ fontWeight: '600' }}>{c.ordersCount} orders</td>
                    <td style={{ fontWeight: '700' }}>₹{c.totalSpent.toLocaleString('en-IN')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {c.tags.map((t, idx) => (
                          <span key={idx} className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{t}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Inspect</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side manual creation OR customer inspect panel */}
        {isCreatingManual && (
          <form onSubmit={handleCreateCustomerAndOrder} className="card animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <PhoneCall size={18} /> Register Call / Manual Order
              </h3>
              <button type="button" className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => setIsCreatingManual(false)}>Close</button>
            </div>

            <div className="form-group">
              <label className="form-label">Customer Name</label>
              <input type="text" className="form-input" required value={custName} onChange={(e) => setCustName(e.target.value)} placeholder="Enter full name" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" required value={custPhone} onChange={(e) => setCustPhone(e.target.value)} placeholder="e.g. 9840123456" />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" className="form-input" value={custLocation} onChange={(e) => setCustLocation(e.target.value)} placeholder="Chennai" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Optional)</label>
              <input type="email" className="form-input" value={custEmail} onChange={(e) => setCustEmail(e.target.value)} placeholder="name@domain.com" />
            </div>

            <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '1rem', marginTop: '1rem' }}>
              <h4 style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.75rem', color: 'hsl(var(--primary))' }}>Add Items (Instantly Place Purchase)</h4>
              
              <div className="form-group">
                <label className="form-label">Select Product</label>
                <select className="form-input" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                  <option value="">-- Choose Product Catalog --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title} - ₹{p.price}</option>
                  ))}
                </select>
              </div>

              {selectedProductId && (
                <div className="animate-fade-in">
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input type="number" className="form-input" min="1" value={orderQty} onChange={(e) => setOrderQty(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shipping Pincode</label>
                    <input type="text" className="form-input" maxLength="6" value={shipPincode} onChange={(e) => setShipPincode(e.target.value)} placeholder="e.g. 600020" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shipping Street Address</label>
                    <textarea className="form-input" value={shipAddress} onChange={(e) => setShipAddress(e.target.value)} placeholder="Enter street delivery details" style={{ minHeight: '60px', fontFamily: 'inherit' }}></textarea>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid hsl(var(--border))', paddingTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Manual Order</button>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsCreatingManual(false)}>Cancel</button>
            </div>
          </form>
        )}

        {selectedCustomer && !isCreatingManual && (
          <aside className="card animate-fade-in" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Inspect Customer Profile</h3>
              <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => setSelectedCustomerId('')}>Close</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.25rem' }}>
                {selectedCustomer.name.substring(0, 1)}
              </div>
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '1.1rem' }}>{selectedCustomer.name}</h4>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Client ID: {selectedCustomer.id}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <div><strong>Email:</strong> {selectedCustomer.email}</div>
              <div><strong>Phone:</strong> {selectedCustomer.phone}</div>
              <div><strong>Core Hub City:</strong> {selectedCustomer.location}</div>
              <div><strong>Total Spend:</strong> ₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</div>
              <div><strong>Completed Orders:</strong> {selectedCustomer.ordersCount} transactions</div>
            </div>

            <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '700', marginBottom: '0.5rem' }}>SEGMENTATION LABELS</div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {selectedCustomer.tags.map((t, i) => (
                  <span key={i} className="badge badge-primary">{t}</span>
                ))}
              </div>
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
