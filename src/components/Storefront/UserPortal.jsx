import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShoppingBag, MapPin, Heart, History, RefreshCw } from 'lucide-react';

export default function UserPortal({ setSelectedProductId, setActiveTab, toggleCartOpen }) {
  const { orders, addToCart, products } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('orders'); // orders | addresses | wishlist
  const [successMsg, setSuccessMsg] = useState('');

  // Wishlist simulations
  const mockWishlist = products.slice(1, 3);

  // Consumable reorder function
  const handleReorder = (item) => {
    const originalProd = products.find(p => p.id === item.id);
    if (!originalProd) return;
    
    addToCart({
      id: originalProd.id,
      title: originalProd.title,
      price: originalProd.price,
      type: 'buy',
      qty: 1,
      image: originalProd.image
    });

    setSuccessMsg('🛒 Item added to cart! Opening checkout.');
    setTimeout(() => {
      setSuccessMsg('');
      toggleCartOpen();
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', flex: 1 }} className="animate-fade-in">
      
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side User Navigation */}
        <aside className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid hsl(var(--border))', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800' }}>My Account</h3>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Sanjay Kumar</span>
          </div>

          {[
            { id: 'orders', label: 'Order History', icon: <History size={16} /> },
            { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={16} /> },
            { id: 'wishlist', label: 'My Wishlist', icon: <Heart size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                textAlign: 'left',
                color: activeSubTab === tab.id ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                backgroundColor: activeSubTab === tab.id ? 'hsl(var(--secondary))' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Right Side Content Drawer */}
        <div>
          {successMsg && (
            <div style={{ backgroundColor: 'hsl(var(--success-bg))', color: 'hsl(var(--success))', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: '600', fontSize: '0.9rem' }}>
              {successMsg}
            </div>
          )}

          {activeSubTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Your Orders</h2>
              {orders.length === 0 ? (
                <p style={{ color: 'hsl(var(--text-muted))' }}>No orders found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {orders.map(order => (
                    <div key={order.id} className="card" style={{ padding: '1.25rem' }}>
                      
                      {/* Header row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: 'hsl(var(--text-main))' }}>Order #{order.id}</div>
                          <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Placed on {order.date}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className={`badge ${order.status === 'fulfilled' ? 'badge-success' : 'badge-warning'}`} style={{ marginRight: '6px' }}>
                            {order.status}
                          </span>
                          <span className="badge badge-primary">{order.paymentStatus}</span>
                        </div>
                      </div>

                      {/* Items row */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <img src={item.image} alt={item.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                              <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '700' }}>{item.title}</h4>
                                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
                                  Qty: {item.qty}
                                </span>
                              </div>
                            </div>

                            {/* Consumable Quick Reorder */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              {(item.title.includes('Diapers') || item.title.includes('Mask') || item.title.includes('Gloves')) && (
                                <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => handleReorder(item)}>
                                  <RefreshCw size={12} /> Reorder Consumable
                                </button>
                              )}
                              <strong style={{ fontSize: '0.9rem' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</strong>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total row */}
                      <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between', borderTop: '1px solid hsl(var(--border))', marginTop: '1rem', paddingTop: '0.75rem', fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>
                        <span>Total Items Paid:</span>
                        <strong style={{ color: 'hsl(var(--text-main))', fontSize: '1rem' }}>₹{order.total.toLocaleString('en-IN')}</strong>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'addresses' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Saved Addresses</h2>
              <div className="card" style={{ maxWidth: '400px' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Sanjay Kumar</strong>
                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', lineHeight: '1.5' }}>
                  Flat A3, Ocean View Apts, Besant Nagar<br />
                  Chennai, Tamil Nadu - 600090<br />
                  Phone: 9840123456
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid hsl(var(--border))', paddingTop: '0.75rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Edit Address</button>
                  <button className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'hsl(var(--destructive))' }}>Remove</button>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'wishlist' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>My Wishlist</h2>
              <div className="grid-auto">
                {mockWishlist.map(p => (
                  <div 
                    key={p.id} 
                    className="card card-hover" 
                    onClick={() => { setSelectedProductId(p.id); setActiveTab('catalog'); }}
                    style={{ padding: '1rem', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                  >
                    <img src={p.image} alt={p.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }} />
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '700', margin: '0.75rem 0 0.25rem' }}>{p.title}</h4>
                    <span style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.75rem' }}>₹{p.price}</span>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '0.4rem', fontSize: '0.8rem', marginTop: 'auto' }}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
