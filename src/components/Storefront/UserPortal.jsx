import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShoppingBag, MapPin, Heart, History, RefreshCw, Plus, Trash2, Edit3, CheckCircle2, X } from 'lucide-react';

export default function UserPortal({ setSelectedProductId, setActiveTab, toggleCartOpen }) {
  const { 
    orders, addToCart, products, 
    userAddresses, addUserAddress, updateUserAddress, deleteUserAddress, 
    wishlist, toggleWishlist 
  } = useContext(AppContext);

  const [activeSubTab, setActiveSubTab] = useState('orders'); // orders | addresses | wishlist
  const [successMsg, setSuccessMsg] = useState('');

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('Chennai');
  const [addrPincode, setAddrPincode] = useState('600089');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Consumable reorder function
  const handleReorder = (item) => {
    const originalProd = products.find(p => p.id === item.id) || item;
    
    addToCart({
      id: originalProd.id,
      title: originalProd.title,
      price: originalProd.price,
      type: 'buy',
      qty: item.qty || 1,
      image: originalProd.image
    });

    setSuccessMsg('🛒 Item added to cart! Opening cart drawer.');
    setTimeout(() => {
      setSuccessMsg('');
      toggleCartOpen();
    }, 800);
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrName('Sanjay Kumar');
    setAddrPhone('+91 98401 23456');
    setAddrStreet('');
    setAddrCity('Chennai');
    setAddrPincode('600089');
    setAddrIsDefault(userAddresses.length === 0);
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddrName(addr.name);
    setAddrPhone(addr.phone);
    setAddrStreet(addr.address);
    setAddrCity(addr.city);
    setAddrPincode(addr.pincode);
    setAddrIsDefault(addr.isDefault);
    setShowAddressModal(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addrName || !addrPhone || !addrStreet) return;

    if (editingAddressId) {
      updateUserAddress({
        id: editingAddressId,
        name: addrName,
        phone: addrPhone,
        address: addrStreet,
        city: addrCity,
        pincode: addrPincode,
        isDefault: addrIsDefault
      });
    } else {
      addUserAddress({
        name: addrName,
        phone: addrPhone,
        address: addrStreet,
        city: addrCity,
        pincode: addrPincode,
        isDefault: addrIsDefault
      });
    }

    setShowAddressModal(false);
    setSuccessMsg('✅ Address saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', flex: 1 }} className="animate-fade-in">
      
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side User Navigation */}
        <aside className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid hsl(var(--border))', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>My Account</h3>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Sanjay Kumar</span>
          </div>

          {[
            { id: 'orders', label: 'Order History', icon: <History size={16} /> },
            { id: 'addresses', label: `Saved Addresses (${userAddresses.length})`, icon: <MapPin size={16} /> },
            { id: 'wishlist', label: `My Wishlist (${wishlist.length})`, icon: <Heart size={16} /> }
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
                <p style={{ color: 'hsl(var(--text-muted))' }}>No past orders found.</p>
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
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                              <img src={item.image} alt={item.title} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} />
                              <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', margin: 0 }}>{item.title}</h4>
                                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
                                  Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>

                            {/* Consumable Quick Reorder */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => handleReorder(item)}>
                                <RefreshCw size={12} /> Fast Reorder
                              </button>
                              <strong style={{ fontSize: '0.9rem' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</strong>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid hsl(var(--border))', marginTop: '1rem', paddingTop: '0.75rem', fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Saved Delivery Addresses</h2>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }} onClick={handleOpenAddAddress}>
                  <Plus size={16} /> Add New Address
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {userAddresses.map(addr => (
                  <div key={addr.id} className="card" style={{ padding: '1.25rem', position: 'relative' }}>
                    {addr.isDefault && (
                      <span className="badge badge-primary" style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.7rem' }}>Default</span>
                    )}
                    <strong style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.95rem' }}>{addr.name}</strong>
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', lineHeight: '1.5', margin: 0 }}>
                      {addr.address}<br />
                      {addr.city} - {addr.pincode}<br />
                      Phone: {addr.phone}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid hsl(var(--border))', paddingTop: '0.75rem' }}>
                      <button className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }} onClick={() => handleOpenEditAddress(addr)}>
                        <Edit3 size={12} /> Edit
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: 'hsl(var(--destructive))', display: 'flex', alignItems: 'center', gap: '0.2rem' }} onClick={() => deleteUserAddress(addr.id)}>
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'wishlist' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>My Wishlist ({wishlistProducts.length})</h2>
              {wishlistProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'hsl(var(--text-muted))' }}>
                  <Heart size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                  <p style={{ margin: 0, fontWeight: '700' }}>Your wishlist is empty.</p>
                  <span style={{ fontSize: '0.85rem' }}>Save products while browsing to view them here later.</span>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  {wishlistProducts.map(p => (
                    <div 
                      key={p.id} 
                      className="card card-hover" 
                      style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                      <div>
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          style={{ width: '100%', height: '140px', objectFit: 'contain', cursor: 'pointer', marginBottom: '0.75rem' }} 
                          onClick={() => { setSelectedProductId(p.id); setActiveTab('catalog'); }}
                        />
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '1.3' }}>{p.title}</h4>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'hsl(var(--primary))', marginBottom: '0.75rem' }}>₹{p.price.toLocaleString('en-IN')}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                          onClick={() => {
                            addToCart({ id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 });
                            setSuccessMsg('🛒 Moved to Cart!');
                            setTimeout(() => setSuccessMsg(''), 3000);
                          }}
                        >
                          <ShoppingBag size={14} /> Add to Cart
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.4rem', color: 'hsl(var(--destructive))', borderColor: 'hsl(var(--border))' }}
                          onClick={() => toggleWishlist(p.id)}
                          title="Remove from Wishlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Address Form Modal */}
      {showAddressModal && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="animate-fade-in card" style={{ width: '100%', maxWidth: '440px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{editingAddressId ? 'Edit Delivery Address' : 'Add New Address'}</h3>
              <button type="button" onClick={() => setShowAddressModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.2rem' }}>Recipient Full Name *</label>
                <input type="text" required value={addrName} onChange={e => setAddrName(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid hsl(var(--border))', fontSize: '0.85rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.2rem' }}>Mobile Number *</label>
                <input type="tel" required value={addrPhone} onChange={e => setAddrPhone(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid hsl(var(--border))', fontSize: '0.85rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.2rem' }}>Street Address *</label>
                <textarea required rows={2} value={addrStreet} onChange={e => setAddrStreet(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid hsl(var(--border))', fontSize: '0.85rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.2rem' }}>City</label>
                  <input type="text" value={addrCity} onChange={e => setAddrCity(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid hsl(var(--border))', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.2rem' }}>Pincode</label>
                  <input type="text" value={addrPincode} onChange={e => setAddrPincode(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid hsl(var(--border))', fontSize: '0.85rem' }} />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={addrIsDefault} onChange={e => setAddrIsDefault(e.target.checked)} /> Set as default delivery address
              </label>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem', fontWeight: '800', marginTop: '0.5rem' }}>Save Address</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

