import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Star, ShieldAlert, Truck, ChevronRight, HelpCircle, Phone, ArrowLeft, Search, ShoppingBag } from 'lucide-react';

export default function PDP({ productId, setSelectedProductId, setActiveTab }) {
  const { products, addToCart } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  
  // States
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [activeTabTab, setActiveTabTab] = useState('specs'); // specs | reviews | qa
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [localReviews, setLocalReviews] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  // Interactive Lens Zoom and Gallery states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Fetch product on load
  useEffect(() => {
    const found = products.find(p => p.id === productId);
    if (found) {
      setProduct(found);
      setLocalReviews(found.reviews || []);
      if (found.category === 'Home Care' && found.title.includes('Diapers')) {
        setSelectedVariant('Large (L)');
      } else {
        setSelectedVariant('');
      }
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [productId, products]);

  // Listen for custom selection event from suggestions
  useEffect(() => {
    const handleSelect = (e) => {
      const found = products.find(p => p.id === e.detail);
      if (found) {
        setProduct(found);
        setLocalReviews(found.reviews || []);
        setSelectedProductId(e.detail);
        setActiveImageIndex(0);
      }
    };
    window.addEventListener('selectProduct', handleSelect);
    return () => window.removeEventListener('selectProduct', handleSelect);
  }, [products, setSelectedProductId]);

  if (!product) {
    return (
      <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <p>Loading product details...</p>
        <button className="btn btn-primary" onClick={() => setSelectedProductId(null)}>Back to Catalog</button>
      </div>
    );
  }

  // Calculate pricing based on options
  const activePrice = product.price;

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      title: product.title,
      price: activePrice,
      type: 'buy',
      qty: quantity,
      image: product.image,
      variant: selectedVariant || null,
      rentDuration: null,
      securityDeposit: 0
    };

    addToCart(cartItem);
    setSuccessMsg('✅ Added to Cart! Continue shopping or open cart to checkout.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;
    const newRev = {
      name: reviewName,
      rating: Number(reviewRating),
      comment: reviewText,
      date: new Date().toISOString().split('T')[0]
    };
    setLocalReviews(prev => [newRev, ...prev]);
    setReviewName('');
    setReviewText('');
    setSuccessMsg('⭐ Review posted successfully! Thank you for your feedback.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Magnifier Zoom Handlers
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const discountPct = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const avgRating = localReviews.length > 0 
    ? (localReviews.reduce((sum, r) => sum + r.rating, 0) / localReviews.length).toFixed(1) 
    : '4.5';

  // Product Gallery Thumbnails
  const galleryImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', flex: 1 }} className="animate-fade-in">
      
      {/* Back to catalog breadcrumb */}
      <button 
        onClick={() => setSelectedProductId(null)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: 'hsl(var(--primary))', marginBottom: '1.5rem', fontSize: '0.875rem' }}
        className="btn btn-ghost"
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      {/* Main product box */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        
        {/* Left Column: Image Gallery + Cursor Zoom */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            
            {/* Gallery Thumbnails */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '60px', flexShrink: 0 }}>
              {galleryImages.map((imgUrl, i) => (
                <div 
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: activeImageIndex === i ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img 
                    src={imgUrl} 
                    alt={`Thumbnail ${i + 1}`} 
                    style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} 
                  />
                </div>
              ))}
            </div>

            {/* Main Interactive Zoom Box */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                flex: 1,
                height: '400px',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: 'white',
                position: 'relative',
                cursor: 'zoom-in',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src={galleryImages[activeImageIndex] || product.image} 
                alt={product.title} 
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain',
                  transition: isZoomed ? 'transform 0.08s ease-out' : 'transform 0.25s ease-out',
                  transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                }} 
              />
            </div>

          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
            <Search size={14} /> Roll over image to zoom in
          </div>

          <div style={{ border: '1px solid hsl(var(--border))', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'hsl(var(--text-muted-light) / 0.3)' }}>
            <ShieldAlert size={20} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
            <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
              <strong>Certified Sterilization:</strong> AeonCare assets undergo full hospital-grade chemical washing & diagnostic load testing prior to shipping.
            </div>
          </div>

        </div>

        {/* Right Column: Purchasing details */}
        <div>
          <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {product.brand} • {product.category}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.25rem' }}>{product.title}</h1>

          {/* Pricing Box */}
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid hsl(var(--primary))', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: 'hsl(var(--text-main))' }}>₹{product.price.toLocaleString('en-IN')}</span>
                {product.mrp > product.price && (
                  <span style={{ color: 'hsl(var(--text-muted))', textDecoration: 'line-through' }}>MRP ₹{product.mrp.toLocaleString('en-IN')}</span>
                )}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'hsl(var(--success))', fontWeight: '600', marginTop: '0.25rem' }}>
                {discountPct > 0 ? `You Save ₹${(product.mrp - product.price).toLocaleString('en-IN')} (${discountPct}% Off)` : 'Best price guaranteed'}
              </div>
            </div>
          </div>

          {/* Variants Selector */}
          {product.category === 'Home Care' && product.title.includes('Diapers') && (
            <div className="form-group">
              <span className="form-label">Select Diaper Size:</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Medium (M) - 30-45"', 'Large (L) - 40-55"', 'Extra Large (XL)'].map(sz => (
                  <button 
                    key={sz} 
                    className={`btn ${selectedVariant.includes(sz.substring(0,6)) ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    onClick={() => setSelectedVariant(sz)}
                  >
                    {sz.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Checker & Stock availability */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <div>
              Status: {product.stock > 0 ? (
                <span style={{ color: 'hsl(var(--success))', fontWeight: '700' }}>In Stock ({product.stock} left)</span>
              ) : product.allowBackorder ? (
                <span style={{ color: 'hsl(var(--primary))', fontWeight: '700' }}>Available on Backorder</span>
              ) : (
                <span style={{ color: 'hsl(var(--destructive))', fontWeight: '700' }}>Out of Stock</span>
              )}
            </div>
            <div style={{ color: 'hsl(var(--text-muted))', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Truck size={14} /> 1-2 Days Shipping Chennai
            </div>
          </div>

          {/* CTA Row */}
          {successMsg && (
            <div style={{ backgroundColor: 'hsl(var(--success-bg))', color: 'hsl(var(--success))', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600', fontSize: '0.9rem' }}>
              {successMsg}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden' }}>
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ padding: '0.5rem 1rem', borderRight: '1px solid hsl(var(--border))', fontWeight: '700' }}
                className="btn-ghost"
              >
                -
              </button>
              <span style={{ padding: '0.5rem 1rem', minWidth: '40px', textAlign: 'center', fontWeight: '700' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                style={{ padding: '0.5rem 1rem', borderLeft: '1px solid hsl(var(--border))', fontWeight: '700' }}
                className="btn-ghost"
              >
                +
              </button>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ flex: 1, padding: '0.75rem 1.5rem' }} 
              disabled={product.stock === 0 && !product.allowBackorder}
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} /> {product.stock === 0 && product.allowBackorder ? 'Order on Backorder' : 'Add to Cart'}
            </button>
          </div>

          {/* Help Block */}
          <div className="card" style={{ padding: '1rem', backgroundColor: 'hsl(var(--secondary) / 0.3)', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={18} style={{ color: 'hsl(var(--primary))' }} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>Need consultation or order via phone?</div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Speak to local customer assistant in Chennai.</div>
              </div>
            </div>
            <a href="tel:+919840123456" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Call Advisor</a>
          </div>

        </div>
      </div>

      {/* Tabs segment: Specifications, QA */}
      <div style={{ borderBottom: '1px solid hsl(var(--border))', display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'specs', label: 'Specifications & Features' },
          { id: 'qa', label: 'Q&As' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTabTab(tab.id)}
            style={{
              padding: '0.75rem 0.25rem',
              fontWeight: '600',
              fontSize: '0.95rem',
              color: activeTabTab === tab.id ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
              borderBottom: activeTabTab === tab.id ? '2px solid hsl(var(--primary))' : '2px solid transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div style={{ marginBottom: '3rem' }}>
        {activeTabTab === 'specs' && (
          <div className="animate-fade-in" style={{ maxWidth: '750px' }}>
            {product.specificationsText ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {product.specificationsText.split('\n').filter(l => l.trim()).map((line, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.92rem', color: '#1e293b' }}>
                    <span style={{ color: 'hsl(var(--primary))', fontWeight: 'bold', fontSize: '1rem' }}>•</span>
                    <span>{line.replace(/^[•\-\*]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            ) : Array.isArray(product.specifications) && product.specifications.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                      <td style={{ padding: '0.75rem 0', color: 'hsl(var(--text-muted))', fontWeight: '600', width: '40%' }}>{spec.name}</td>
                      <td style={{ padding: '0.75rem 0', fontWeight: '500' }}>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>No specific feature points listed for this product.</p>
            )}
          </div>
        )}

        {activeTabTab === 'qa' && (
          <div className="animate-fade-in">
            {product.qa && product.qa.length > 0 ? (
              product.qa.map((item, i) => (
                <div key={i} style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <HelpCircle size={16} style={{ color: 'hsl(var(--primary))' }} /> {item.question}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', paddingLeft: '1.5rem' }}>
                    {item.answer}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>No questions have been asked about this product yet. Have a question? Call our team!</p>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
