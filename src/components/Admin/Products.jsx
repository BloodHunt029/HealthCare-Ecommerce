import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Plus, Edit2, Trash2, Search, Eye, Save, ArrowLeft, Upload, 
  Settings, HelpCircle, Check, Sparkles, Bold, Italic, Underline, 
  Link, Image, Code, List, Table
} from 'lucide-react';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, storeSettings } = useContext(AppContext);
  
  // Navigation & list filters
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Shopify-style state fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Home Care');
  const [brand, setBrand] = useState('AEONCARE');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [allowBackorder, setAllowBackorder] = useState(false);
  const [specificationsText, setSpecificationsText] = useState('');

  const [price, setPrice] = useState(0);
  const [mrp, setMrp] = useState(0);
  
  // Multiple images state array
  const [images, setImages] = useState([]);
  
  const [stock, setStock] = useState(10);
  const [lowStockThreshold, setLowStockThreshold] = useState(3);
  
  // Rentable & specs details
  const [isRentable, setIsRentable] = useState(false);
  const [rentDaily, setRentDaily] = useState(0);
  const [rentWeekly, setRentWeekly] = useState(0);
  const [rentMonthly, setRentMonthly] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);

  // SEO metadata fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoSlug, setSeoSlug] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  // Right sidebar fields
  const [status, setStatus] = useState('Active'); // Active | Draft | Archived
  const [vendor, setVendor] = useState('AEONCARE');
  const [productType, setProductType] = useState('None');
  const [tags, setTags] = useState('beds, medical, homecare');
  const [weight, setWeight] = useState('15.0');
  const [weightUnit, setWeightUnit] = useState('kg');

  // Image Selector Modal
  const [showImageModal, setShowImageModal] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Load editor details
  const handleStartEdit = (prod) => {
    setSelectedProductId(prod.id);
    setIsAddingNew(false);
    
    setTitle(prod.title);
    setDescription(prod.description || '');
    setCategory(prod.category);
    setBrand(prod.brand || 'AEONCARE');
    setSku(prod.sku || `AC${prod.id ? String(prod.id).replace(/\D/g, '') || '9983' : '9983'}`);
    setBarcode(prod.barcode || '');
    setAllowBackorder(Boolean(prod.allowBackorder));

    // Convert specs object array or text to copy-pasteable format
    setSpecificationsText(
      prod.specificationsText || 
      (Array.isArray(prod.specifications) ? prod.specifications.map(s => `• ${s.name}: ${s.value}`).join('\n') : String(prod.specifications || ''))
    );

    setPrice(prod.price);
    setMrp(prod.mrp || prod.price);
    
    // Load multiple images or fallback to single image array
    const loadedImgs = Array.isArray(prod.images) && prod.images.length > 0 
      ? prod.images 
      : (prod.image ? [prod.image] : []);
    setImages(loadedImgs);

    setStock(prod.stock);
    setLowStockThreshold(prod.lowStockThreshold || 3);
    
    setIsRentable(prod.isRentable || false);
    setRentDaily(prod.rentRates?.daily || 0);
    setRentWeekly(prod.rentRates?.weekly || 0);
    setRentMonthly(prod.rentRates?.monthly || 0);
    setSecurityDeposit(prod.securityDeposit || 0);

    setSeoTitle(prod.seo?.title || prod.title);
    setSeoDesc(prod.seo?.description || (prod.description ? prod.description.substring(0, 150) : ''));
    setSeoSlug(prod.seo?.slug || prod.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''));
    setImageAlt(prod.seo?.imageAlt || prod.title);

    setStatus(prod.stock > 0 || prod.allowBackorder ? 'Active' : 'Draft');
    setVendor(prod.brand || 'AEONCARE');
    setProductType(prod.productType || 'None');
  };

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setSelectedProductId('');

    setTitle('');
    setDescription('');
    setCategory('Home Care');
    setBrand('AEONCARE');
    setSku(`AC${Math.floor(1000 + Math.random() * 9000)}`);
    setBarcode('');
    setAllowBackorder(false);
    setSpecificationsText('• High clinical grade durability\n• Certified patient safety\n• Easy maintenance & setup');

    setPrice(0);
    setMrp(0);
    setImages(['https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600']);
    setStock(10);
    setLowStockThreshold(3);
    
    setIsRentable(false);
    setRentDaily(0);
    setRentWeekly(0);
    setRentMonthly(0);
    setSecurityDeposit(0);

    setSeoTitle('');
    setSeoDesc('');
    setSeoSlug('');
    setImageAlt('');

    setStatus('Active');
    setVendor('AEONCARE');
    setProductType('None');
    setTags('beds, medical');
    setWeight('10.0');
  };

  // Multiple media upload supporting multiple files
  const handleJpgMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    const newImageUrls = [];
    let count = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        newImageUrls.push(evt.target.result);
        count++;
        if (count === files.length) {
          setImages(prev => [...prev, ...newImageUrls]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveProduct = (e) => {
    if (e) e.preventDefault();
    if (!title || price <= 0) {
      alert('Please fill out Title and valid Sale Price!');
      return;
    }

    const payload = {
      title,
      description,
      category,
      brand,
      sku: sku || `AC${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: barcode || '',
      allowBackorder: Boolean(allowBackorder),
      specificationsText: specificationsText || '',
      specifications: specificationsText 
        ? specificationsText.split('\n').filter(l => l.trim()).map(line => {
            const clean = line.replace(/^[•\-\*]\s*/, '');
            const parts = clean.split(':');
            if (parts.length > 1) {
              return { name: parts[0].trim(), value: parts.slice(1).join(':').trim() };
            }
            return { name: 'Feature', value: clean };
          })
        : [{ name: 'Standard Grade', value: 'Approved Clinical Use' }],
      productType: productType || 'None',
      price: Number(price),
      mrp: Number(mrp) || Number(price),
      
      // Save primary image and complete images array
      image: images[0] || 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600',
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600'],
      
      status: status || 'Active',
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      isRentable,
      rentRates: isRentable ? { daily: Number(rentDaily), weekly: Number(rentWeekly), monthly: Number(rentMonthly) } : { daily: 0, weekly: 0, monthly: 0 },
      securityDeposit: isRentable ? Number(securityDeposit) : 0,
      seo: {
        title: seoTitle || title,
        description: seoDesc || (description ? description.substring(0, 150) : ''),
        slug: seoSlug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
        imageAlt: imageAlt || title
      }
    };

    if (isAddingNew) {
      addProduct(payload);
      setIsAddingNew(false);
    } else {
      updateProduct({ ...payload, id: selectedProduct.id, reviews: selectedProduct?.reviews, qa: selectedProduct?.qa });
      setSelectedProductId('');
    }

    alert('Product catalog saved successfully!');
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!seoSlug || seoSlug === title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')) {
      setSeoSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''));
    }
  };

  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      const matchBarcode = p.barcode?.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchSku && !matchBarcode) return false;
    }
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '0.5rem 0' }}>
      
      {!(selectedProductId || isAddingNew) ? (
        /* ================= INVENTORY LIST VIEW ================= */
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>Products</h1>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>Manage catalog items, barcodes, backorders, and specifications.</p>
            </div>
            <button className="btn btn-primary" onClick={handleStartAdd}>
              <Plus size={16} /> Add Product
            </button>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search products by title, brand, SKU, or barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.25rem' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
              </div>
              <select className="form-input" style={{ width: '200px' }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Home Care">Home Care</option>
                <option value="Mobility Aid">Mobility Aid</option>
                <option value="Medical Devices">Medical Devices</option>
                <option value="Surgicals & PPE">Surgicals & PPE</option>
              </select>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid hsl(var(--border))', paddingBottom: '0.5rem', color: 'hsl(var(--text-muted))' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Product Title</th>
                    <th>Status</th>
                    <th>SKU & Barcode</th>
                    <th>Category & Type</th>
                    <th>Stock / Backorder</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid hsl(var(--border))', transition: 'all 0.15s' }}>
                      <td style={{ padding: '0.75rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={p.image} alt={p.title} style={{ width: '40px', height: '40px', objectFit: 'contain', border: '1px solid hsl(var(--border))', borderRadius: '4px', backgroundColor: 'white' }} />
                        <div>
                          <strong style={{ display: 'block', color: 'hsl(var(--text-main))' }}>{p.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Brand: {p.brand}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          display: 'inline-block',
                          backgroundColor: (p.status || 'Active') === 'Active' ? '#dcfce7' : ((p.status || 'Active') === 'Draft' ? '#f1f5f9' : '#fee2e2'),
                          color: (p.status || 'Active') === 'Active' ? '#15803d' : ((p.status || 'Active') === 'Draft' ? '#475569' : '#b91c1c'),
                          border: (p.status || 'Active') === 'Active' ? '1px solid #bbf7d0' : ((p.status || 'Active') === 'Draft' ? '1px solid #cbd5e1' : '1px solid #fca5a5')
                        }}>
                          {p.status || 'Active'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.75rem' }}>
                          <span style={{ fontWeight: '600', color: '#475569', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                            {p.sku || `AC${p.id}`}
                          </span>
                        </div>
                        {p.barcode && (
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                            Code: {p.barcode}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem' }}>{p.category}</div>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Type: {p.productType || 'None'}</span>
                      </td>
                      <td>
                        <span style={{ 
                          fontWeight: '700', 
                          color: p.stock <= p.lowStockThreshold 
                            ? (p.allowBackorder ? 'hsl(var(--primary))' : 'hsl(var(--destructive))') 
                            : 'hsl(var(--success))'
                        }}>
                          {p.stock} units
                          {p.allowBackorder && <span style={{ display: 'block', fontSize: '0.7rem', color: '#2563eb' }}>[Backorders Allowed]</span>}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: 'hsl(var(--text-main))' }}>₹{p.price.toLocaleString('en-IN')}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', color: 'hsl(var(--primary))' }} onClick={() => handleStartEdit(p)} title="Edit details">
                            <Edit2 size={14} /> Edit
                          </button>
                          <button className="btn btn-ghost" style={{ padding: '0.25rem', color: 'hsl(var(--destructive))' }} onClick={() => { if(window.confirm('Delete product?')) deleteProduct(p.id); }} title="Remove listing">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* ================= SHOPIFY-STYLE ADD / EDIT PRODUCT WORKSPACE ================= */
        <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Top Bar Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => { setSelectedProductId(''); setIsAddingNew(false); }} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={18} />
              </button>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>
                {isAddingNew ? 'Add product' : `Edit product`}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" onClick={() => { setSelectedProductId(''); setIsAddingNew(false); }}>Discard</button>
              <button className="btn btn-primary" onClick={handleSaveProduct}>Save</button>
            </div>
          </div>

          {/* Editor Grid layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* LEFT COLUMN (WIDER CONTENT CARDS) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Title & Description Card */}
              <div className="card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Product Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Electric Hospital Bed (5 Function)" 
                    value={title} 
                    onChange={handleTitleChange} 
                    required 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Description (Overview Paragraphs)</label>
                  <textarea 
                    className="form-input" 
                    style={{ 
                      minHeight: '100px', 
                      fontFamily: 'inherit',
                      lineHeight: '1.5'
                    }} 
                    placeholder="Copy & paste product overview paragraphs here..."
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Specifications & Feature Points Copy-Paste Card */}
              <div className="card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label className="form-label" style={{ fontWeight: '700', marginBottom: '0.25rem' }}>
                  Specifications & Features (Copy-Paste Points)
                </label>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  Easily copy and paste bullet points, feature lists, or key-value specifications line by line.
                </p>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: '130px', fontFamily: 'inherit', lineHeight: '1.6' }} 
                  placeholder="• High Clinical Grade Steel Frame&#10;• Weight Capacity: 180 kg&#10;• Electric Backrest & Knee Elevation&#10;• Sterilized & Hospital Ready"
                  value={specificationsText} 
                  onChange={(e) => setSpecificationsText(e.target.value)}
                ></textarea>
              </div>

              {/* Media upload card (Supports Multiple Images) */}
              <div className="card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontWeight: '700', marginBottom: 0 }}>
                    Media Gallery ({images.length} image{images.length !== 1 && 's'})
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>First image is the primary cover image</span>
                </div>
                
                <div style={{ 
                  border: '1.5px dashed #cbd5e1', 
                  borderRadius: '8px', 
                  padding: '1.5rem', 
                  textAlign: 'center', 
                  backgroundColor: '#f8fafc',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Upload size={24} style={{ color: '#94a3b8' }} />
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <label 
                        style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid #cbd5e1', padding: '5px 14px', borderRadius: '4px', backgroundColor: '#ffffff' }}
                      >
                        Upload new images
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*,.jpg,.jpeg,.png,.webp" 
                          onChange={handleJpgMediaUpload} 
                          style={{ display: 'none' }} 
                        />
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setShowImageModal(true)}
                        style={{ border: '1px solid #cbd5e1', background: '#ffffff', color: '#2563eb', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: '5px 14px', borderRadius: '4px' }}
                      >
                        Select existing
                      </button>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Select multiple files to upload together</span>
                  </div>
                </div>

                {/* Display All Uploaded/Selected Images */}
                {images.length > 0 && (
                  <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {images.map((imgUrl, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          position: 'relative', 
                          width: '90px', 
                          height: '90px', 
                          border: idx === 0 ? '2px solid #2563eb' : '1px solid #cbd5e1', 
                          borderRadius: '8px', 
                          overflow: 'hidden',
                          backgroundColor: '#ffffff',
                          padding: '4px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                      >
                        <img src={imgUrl} alt={`Product asset ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        {idx === 0 && (
                          <span style={{ position: 'absolute', bottom: 3, left: 3, backgroundColor: '#2563eb', color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '1px 5px', borderRadius: '3px' }}>
                            Primary
                          </span>
                        )}
                        <button 
                          type="button"
                          onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))} 
                          style={{ 
                            position: 'absolute', 
                            top: 3, right: 3, 
                            backgroundColor: 'rgba(15, 23, 42, 0.75)', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '50%', 
                            width: '18px', height: '18px', 
                            fontSize: '11px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            cursor: 'pointer' 
                          }}
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing details card */}
              <div className="card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>Pricing</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Price</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#64748b' }}>₹</span>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        style={{ paddingLeft: '1.5rem' }} 
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Compare-at price (MRP)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#64748b' }}>₹</span>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={mrp} 
                        onChange={(e) => setMrp(e.target.value)} 
                        style={{ paddingLeft: '1.5rem' }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory details card */}
              <div className="card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Inventory & Backorder Settings</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: '700' }}>SKU (Stock Keeping Unit)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={sku} 
                      onChange={(e) => setSku(e.target.value)} 
                      placeholder="e.g. AC9983"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: '700' }}>Barcode (ISBN / UPC / GTIN)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={barcode} 
                      onChange={(e) => setBarcode(e.target.value)} 
                      placeholder="e.g. 890123456789"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: '700' }}>Low Stock Alert Limit</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={lowStockThreshold} 
                      onChange={(e) => setLowStockThreshold(e.target.value)} 
                    />
                  </div>
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.75rem', marginBottom: '1.25rem', backgroundColor: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155' }}>
                      Available Quantity in Stock:
                    </span>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={stock} 
                      onChange={(e) => setStock(e.target.value)} 
                      style={{ width: '100px', padding: '4px 8px', textAlign: 'center', fontWeight: '700' }} 
                    />
                  </div>
                </div>

                {/* Sell when out of stock checkbox option */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', padding: '0.85rem 1rem', border: '1px solid #bfdbfe', borderRadius: '6px', backgroundColor: '#eff6ff' }}>
                  <input 
                    type="checkbox" 
                    id="allowBackorderCheck"
                    checked={allowBackorder} 
                    onChange={(e) => setAllowBackorder(e.target.checked)} 
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer', marginTop: '2px' }}
                  />
                  <div>
                    <label htmlFor="allowBackorderCheck" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e3a8a', cursor: 'pointer' }}>
                      Continue selling when out of stock (Allow Backorders)
                    </label>
                    <p style={{ fontSize: '0.75rem', color: '#3b82f6', margin: '2px 0 0' }}>
                      Enables customers to purchase this item even if quantity is 0.
                    </p>
                  </div>
                </div>

              </div>

              {/* Search engine listing card */}
              <div className="card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>Search engine listing</h3>
                
                <div style={{ marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#5f6368', fontSize: '11px', marginBottom: '2px' }}>
                    https://{storeSettings?.domain || 'store.com'}/products/{seoSlug || 'product-handle'}
                  </div>
                  <h5 style={{ color: '#1a0dab', fontSize: '15px', fontWeight: 'normal', margin: 0 }}>
                    {seoTitle || title || 'Product Title Preview'}
                  </h5>
                  <p style={{ color: '#4d5156', margin: '4px 0 0', fontSize: '12px', lineHeight: '1.4' }}>
                    {seoDesc || (description ? description.substring(0, 140) : 'Write description to preview SERP search listing details.')}
                  </p>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className="form-label">Page title</label>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{seoTitle.length} of 70 characters used</span>
                  </div>
                  <input type="text" className="form-input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={70} />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className="form-label">Meta description</label>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{seoDesc.length} of 320 characters used</span>
                  </div>
                  <textarea 
                    className="form-input" 
                    style={{ minHeight: '70px', fontFamily: 'inherit' }} 
                    value={seoDesc} 
                    onChange={(e) => setSeoDesc(e.target.value)} 
                    maxLength={320}
                    placeholder="Write a concise description for Google search result snippets..."
                  ></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">URL handle</label>
                  <input type="text" className="form-input" value={seoSlug} onChange={(e) => setSeoSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''))} />
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (SIDEBAR CONTROLS) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Product Status */}
              <div className="card" style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label className="form-label" style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Status</label>
                <select 
                  className="form-input" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ fontSize: '0.85rem', fontWeight: '600' }}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Product Organization card */}
              <div className="card" style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Product organization</h4>
                
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '700' }}>Product Type</label>
                  <select 
                    className="form-input" 
                    value={productType} 
                    onChange={(e) => setProductType(e.target.value)}
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                  >
                    <option value="None">None</option>
                    <option value="Physical product">Physical product</option>
                    <option value="Hospital Beds">Hospital Beds</option>
                    <option value="Mobility Aids">Mobility Aids</option>
                    <option value="Clinical Monitors">Clinical Monitors</option>
                    <option value="Consumable PPE">Consumable PPE</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Vendor / Brand</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={vendor} 
                    onChange={(e) => { setVendor(e.target.value); setBrand(e.target.value); }} 
                    placeholder="AEONCARE"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Collections / Category</label>
                  <select 
                    className="form-input" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <option value="Home Care">Home Care</option>
                    <option value="Mobility Aid">Mobility Aid</option>
                    <option value="Medical Devices">Medical Devices</option>
                    <option value="Surgicals & PPE">Surgicals & PPE</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tags</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)} 
                    placeholder="comma separated values"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Select Image from Library Modal */}
      {showImageModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="card" style={{ maxWidth: '680px', width: '100%', maxHeight: '80vh', overflowY: 'auto', backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Select Image from Existing Library</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Click any thumbnail to add it to product media</span>
              </div>
              <button className="btn btn-ghost" onClick={() => setShowImageModal(false)} style={{ padding: '4px 8px', fontSize: '1rem' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
              {Array.from(new Set(products.flatMap(p => p.images || [p.image]))).filter(Boolean).map((imgUrl, i) => {
                const isSelected = images.includes(imgUrl);
                return (
                  <div 
                    key={i}
                    onClick={() => {
                      if (!isSelected) {
                        setImages(prev => [...prev, imgUrl]);
                      } else {
                        setImages(prev => prev.filter(img => img !== imgUrl));
                      }
                    }}
                    style={{
                      height: '110px',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      padding: '4px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      transition: 'all 0.15s'
                    }}
                  >
                    <img src={imgUrl} alt={`Product asset ${i + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    {isSelected && (
                      <div style={{ position: 'absolute', top: 3, right: 3, backgroundColor: '#2563eb', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={() => setShowImageModal(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
