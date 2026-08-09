import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Plus, Edit2, Trash2, Search, Eye, Save, ArrowLeft, Upload, Download, FileText, CheckCircle,
  Settings, HelpCircle, Check, Sparkles, Bold, Italic, Underline, 
  Link, Image, Code, List, Table
} from 'lucide-react';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, importProducts, storeSettings, layout } = useContext(AppContext);
  
  // Navigation & list filters
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Compile exact active collections from layout collectionsList
  const availableCollections = Array.from(new Set([
    ...(layout?.collectionsList || []).map(c => c.name).filter(Boolean)
  ]));

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
  const [offerTag, setOfferTag] = useState('');
  
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
    setOfferTag(prod.offerTag || '');
    
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
    setOfferTag('');
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
      offerTag: offerTag ? offerTag.trim() : '',
      
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

  // CSV Import Modal & Parsing state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importedParsedRows, setImportedParsedRows] = useState([]);
  const [importStatusMsg, setImportStatusMsg] = useState('');

  // Official Shopify CSV Template Column Headers
  const SHOPIFY_CSV_HEADERS = [
    'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Type', 'Tags', 'Published',
    'Option1 Name', 'Option1 Value', 'Option1 Linked To', 'Option2 Name', 'Option2 Value', 'Option2 Linked To',
    'Option3 Name', 'Option3 Value', 'Option3 Linked To', 'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker',
    'Variant Inventory Qty', 'Variant Inventory Policy', 'Variant Fulfillment Service', 'Variant Price', 'Variant Compare At Price',
    'Variant Requires Shipping', 'Variant Taxable', 'Unit Price Total Measure', 'Unit Price Total Measure Unit',
    'Unit Price Base Measure', 'Unit Price Base Measure Unit', 'Variant Barcode', 'Image Src', 'Image Position',
    'Image Alt Text', 'Gift Card', 'SEO Title', 'SEO Description', 'Google Shopping / Google Product Category',
    'Google Shopping / Gender', 'Google Shopping / Age Group', 'Google Shopping / MPN', 'Google Shopping / Condition',
    'Google Shopping / Custom Product', 'Google Shopping / Custom Label 0', 'Google Shopping / Custom Label 1',
    'Google Shopping / Custom Label 2', 'Google Shopping / Custom Label 3', 'Google Shopping / Custom Label 4',
    'Google: Custom Product (product.metafields.mm-google-shopping.custom_product)',
    'Product rating count (product.metafields.reviews.rating_count)',
    'Absorbency level (product.metafields.shopify.absorbency-level)',
    'Accessory size (product.metafields.shopify.accessory-size)',
    'Age group (product.metafields.shopify.age-group)',
    'Attachment type (product.metafields.shopify.attachment-type)',
    'Bedding size (product.metafields.shopify.bedding-size)',
    'Body area (product.metafields.shopify.body-area)',
    'Closure type (product.metafields.shopify.closure-type)',
    'Color (product.metafields.shopify.color-pattern)',
    'Compatible patient profile (product.metafields.shopify.compatible-patient-profile)',
    'Control type (product.metafields.shopify.control-type)',
    'Diaper size (product.metafields.shopify.diaper-size)',
    'Diaper type (product.metafields.shopify.diaper-type)',
    'Display technology (product.metafields.shopify.display-technology)',
    'Disposable glove features (product.metafields.shopify.disposable-glove-features)',
    'Evaporation technology (product.metafields.shopify.evaporation-technology)',
    'Fabric (product.metafields.shopify.fabric)',
    'Furniture/Fixture material (product.metafields.shopify.furniture-fixture-material)',
    'Handwear material (product.metafields.shopify.handwear-material)',
    'Material (product.metafields.shopify.material)',
    'Mobility/Accessibility equipment features (product.metafields.shopify.mobility-accessibility-equipment-features)',
    'Mounting type (product.metafields.shopify.mounting-type)',
    'Nebulizer design (product.metafields.shopify.nebulizer-design)',
    'Nebulizer technology (product.metafields.shopify.nebulizer-technology)',
    'Power source (product.metafields.shopify.power-source)',
    'Size (product.metafields.shopify.size)',
    'Stair lifts control type (product.metafields.shopify.stair-lifts-control-type)',
    'Staircase type (product.metafields.shopify.staircase-type)',
    'Support/Brace material (product.metafields.shopify.support-brace-material)',
    'Target gender (product.metafields.shopify.target-gender)',
    'Temperature measurement (product.metafields.shopify.temperature-measurement)',
    'Test sample (product.metafields.shopify.test-sample)',
    'Transfer boards surface type (product.metafields.shopify.transfer-boards-surface-type)',
    'Treatment objective (product.metafields.shopify.treatment-objective)',
    'Usage type (product.metafields.shopify.usage-type)',
    'Wheelchair type (product.metafields.shopify.wheelchair-type)',
    'Variant Image', 'Variant Weight Unit', 'Variant Tax Code', 'Cost per item', 'Status'
  ];

  const escapeCsvVal = (val) => {
    if (val === null || val === undefined) return '""';
    const cleanStr = String(val).replace(/"/g, '""');
    return `"${cleanStr}"`;
  };

  // Export active catalog to Shopify CSV template
  const handleExportProductsCsv = () => {
    let csvStr = SHOPIFY_CSV_HEADERS.map(escapeCsvVal).join(',') + '\r\n';

    products.forEach(p => {
      const row = new Array(SHOPIFY_CSV_HEADERS.length).fill('""');
      row[0] = escapeCsvVal(p.handle || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      row[1] = escapeCsvVal(p.title || '');
      row[2] = escapeCsvVal(p.description || '');
      row[3] = escapeCsvVal(p.brand || 'AEONCARE');
      row[4] = escapeCsvVal(p.category || 'Home Care');
      row[5] = escapeCsvVal(p.category || 'Home Care');
      row[6] = escapeCsvVal(p.tags || 'medical');
      row[7] = escapeCsvVal(p.status === 'Draft' ? 'FALSE' : 'TRUE');
      row[8] = escapeCsvVal('Title');
      row[9] = escapeCsvVal('Default Title');
      row[17] = escapeCsvVal(p.sku || `AC${Math.floor(1000 + Math.random() * 9000)}`);
      row[20] = escapeCsvVal(p.stock !== undefined ? p.stock : 10);
      row[23] = escapeCsvVal(p.price || 0);
      row[24] = escapeCsvVal(p.mrp || 0);
      row[31] = escapeCsvVal(p.barcode || '');
      row[32] = escapeCsvVal(Array.isArray(p.images) ? p.images[0] : (p.image || ''));
      row[89] = escapeCsvVal(p.costPrice || 0);
      row[90] = escapeCsvVal(p.status ? p.status.toLowerCase() : 'active');

      csvStr += row.join(',') + '\r\n';
    });

    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `products_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download empty/sample Shopify CSV template
  const handleDownloadSampleCsv = () => {
    let csvStr = SHOPIFY_CSV_HEADERS.map(escapeCsvVal).join(',') + '\r\n';

    // Sample Row 1
    const row1 = new Array(SHOPIFY_CSV_HEADERS.length).fill('""');
    row1[0] = escapeCsvVal('oxygen-concentrator-5l');
    row1[1] = escapeCsvVal('Oxygen Concentrator 5L');
    row1[2] = escapeCsvVal('<p>Medical grade 5L continuous oxygen concentrator.</p>');
    row1[3] = escapeCsvVal('AEONCARE');
    row1[4] = escapeCsvVal('Medical Devices');
    row1[5] = escapeCsvVal('Medical Devices');
    row1[6] = escapeCsvVal('oxygen, respiratory');
    row1[7] = escapeCsvVal('TRUE');
    row1[8] = escapeCsvVal('Title');
    row1[9] = escapeCsvVal('Default Title');
    row1[17] = escapeCsvVal('OX-CONC-5L');
    row1[20] = escapeCsvVal('15');
    row1[23] = escapeCsvVal('34999');
    row1[24] = escapeCsvVal('45000');
    row1[31] = escapeCsvVal('8901234567890');
    row1[32] = escapeCsvVal('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600');
    row1[89] = escapeCsvVal('28000');
    row1[90] = escapeCsvVal('active');
    csvStr += row1.join(',') + '\r\n';

    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `shopify_products_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Robust CSV parser supporting quotes and newlines
  const parseCsvText = (text) => {
    const lines = [];
    let curLine = [];
    let curVal = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          curVal += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        curLine.push(curVal.trim());
        curVal = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        curLine.push(curVal.trim());
        if (curLine.some(c => c !== '')) lines.push(curLine);
        curLine = [];
        curVal = '';
      } else {
        curVal += char;
      }
    }
    if (curVal || curLine.length > 0) {
      curLine.push(curVal.trim());
      if (curLine.some(c => c !== '')) lines.push(curLine);
    }
    return lines;
  };

  // Handle uploaded CSV file parsing
  const handleSelectCsvFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportFile(file);
    setImportStatusMsg('Parsing CSV rows...');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const rawText = evt.target.result;
        const rows = parseCsvText(rawText);
        if (rows.length < 2) {
          setImportStatusMsg('CSV file is empty or missing data rows.');
          setImportedParsedRows([]);
          return;
        }

        const headers = rows[0].map(h => h.toLowerCase().trim());
        const findColIdx = (possibleNames) => {
          for (const name of possibleNames) {
            const idx = headers.findIndex(h => h === name.toLowerCase());
            if (idx !== -1) return idx;
          }
          return -1;
        };

        const handleIdx = findColIdx(['handle']);
        const titleIdx = findColIdx(['title']);
        const bodyIdx = findColIdx(['body (html)', 'description', 'body']);
        const vendorIdx = findColIdx(['vendor', 'brand']);
        const catIdx = findColIdx(['product category', 'type', 'category']);
        const skuIdx = findColIdx(['variant sku', 'sku']);
        const qtyIdx = findColIdx(['variant inventory qty', 'inventory qty', 'stock']);
        const priceIdx = findColIdx(['variant price', 'price']);
        const mrpIdx = findColIdx(['variant compare at price', 'compare at price', 'mrp']);
        const barcodeIdx = findColIdx(['variant barcode', 'barcode']);
        const imgIdx = findColIdx(['image src', 'image', 'variant image']);
        const costIdx = findColIdx(['cost per item', 'cost']);
        const statusIdx = findColIdx(['status']);

        const parsedProducts = [];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          const rawTitle = titleIdx !== -1 ? r[titleIdx] : '';
          if (!rawTitle) continue;

          const rawHandle = handleIdx !== -1 ? r[handleIdx] : rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const rawPrice = priceIdx !== -1 ? parseFloat(r[priceIdx]) || 0 : 0;
          const rawMrp = mrpIdx !== -1 ? parseFloat(r[mrpIdx]) || Math.round(rawPrice * 1.2) : Math.round(rawPrice * 1.2);
          const rawCost = costIdx !== -1 ? parseFloat(r[costIdx]) || 0 : 0;
          const rawQty = qtyIdx !== -1 ? parseInt(r[qtyIdx], 10) || 10 : 10;
          const rawImage = imgIdx !== -1 && r[imgIdx] ? r[imgIdx] : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600';
          const rawCategory = catIdx !== -1 && r[catIdx] ? r[catIdx] : 'Home Care';
          const rawVendor = vendorIdx !== -1 && r[vendorIdx] ? r[vendorIdx] : 'AEONCARE';
          const rawSku = skuIdx !== -1 && r[skuIdx] ? r[skuIdx] : `AC${Math.floor(1000 + Math.random() * 9000)}`;
          const rawBarcode = barcodeIdx !== -1 ? r[barcodeIdx] : '';
          const rawDesc = bodyIdx !== -1 ? r[bodyIdx] : `<p>${rawTitle}</p>`;
          const rawStatus = statusIdx !== -1 && r[statusIdx]?.toLowerCase() === 'draft' ? 'Draft' : 'Active';

          parsedProducts.push({
            title: rawTitle,
            handle: rawHandle,
            description: rawDesc,
            price: rawPrice,
            mrp: rawMrp,
            costPrice: rawCost,
            category: rawCategory,
            brand: rawVendor,
            sku: rawSku,
            barcode: rawBarcode,
            stock: rawQty,
            status: rawStatus,
            images: [rawImage],
            image: rawImage,
            rating: 4.8,
            reviewsCount: 12,
            allowBackorder: true,
            specificationsText: '• High clinical grade durability\n• Certified patient safety'
          });
        }

        setImportedParsedRows(parsedProducts);
        setImportStatusMsg(`Successfully parsed ${parsedProducts.length} product(s) from CSV.`);
      } catch (err) {
        console.error(err);
        setImportStatusMsg('Error parsing CSV file format.');
      }
    };
    reader.readAsText(file);
  };

  // Confirm and Execute Import into AppContext & Firestore
  const handleExecuteImport = () => {
    if (importedParsedRows.length === 0) return;
    
    const count = importedParsedRows.length;
    importProducts(importedParsedRows);

    alert(`Success! Imported ${count} products into your catalog.`);
    setIsImportModalOpen(false);
    setImportFile(null);
    setImportedParsedRows([]);
    setImportStatusMsg('');
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>Products</h1>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>Manage catalog items, barcodes, CSV import/export, and specifications.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button 
                className="btn btn-outline" 
                onClick={handleDownloadSampleCsv} 
                title="Download Shopify sample CSV template"
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download size={14} /> Sample CSV
              </button>
              <button 
                className="btn btn-outline" 
                onClick={handleExportProductsCsv}
                title="Export catalog products to CSV"
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Upload size={14} style={{ transform: 'rotate(180deg)' }} /> Export CSV
              </button>
              <button 
                className="btn btn-outline" 
                onClick={() => setIsImportModalOpen(true)}
                title="Import products from CSV template"
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Upload size={14} /> Import CSV
              </button>
              <button className="btn btn-primary" onClick={handleStartAdd} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={16} /> Add Product
              </button>
            </div>
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
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button 
                type="button"
                className="btn btn-outline" 
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', backgroundColor: '#3b82f6', color: 'white', borderColor: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openLivePreviewModal'));
                }}
              >
                <Eye size={14} /> Live Store Preview
              </button>
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

              {/* Pricing & Offer details card */}
              <div className="card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>Pricing & Promotional Offer</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: '700' }}>Selling Price (₹)</label>
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
                    <label className="form-label" style={{ fontWeight: '700' }}>Compare-at MRP (₹)</label>
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

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: '700' }}>Discount Offer (%)</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="e.g. 20"
                        value={Number(mrp) > 0 && Number(price) > 0 ? Math.max(0, Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100)) : ''} 
                        onChange={(e) => {
                          const pct = Number(e.target.value) || 0;
                          const baseMrp = Number(mrp) || Number(price) || 0;
                          if (baseMrp > 0) {
                            const newPrice = Math.round(baseMrp - (baseMrp * pct / 100));
                            setPrice(newPrice);
                          }
                        }} 
                        style={{ paddingRight: '1.75rem' }} 
                      />
                      <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>%</span>
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Custom Offer Badge / Promotional Tag</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. SPECIAL FESTIVE OFFER - FLAT 25% OFF | FREE DOORSTEP SETUP"
                    value={offerTag} 
                    onChange={(e) => setOfferTag(e.target.value)} 
                  />
                  {Number(mrp) > Number(price) && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>🔥 Customer Saves ₹{(Number(mrp) - Number(price)).toLocaleString('en-IN')} ({Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100)}% OFF)</span>
                    </div>
                  )}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Collections / Category</label>
                    <button 
                      type="button"
                      onClick={() => {
                        const customCat = prompt("Enter new Collection / Category name:");
                        if (customCat && customCat.trim()) {
                          setCategory(customCat.trim());
                        }
                      }}
                      style={{ fontSize: '0.72rem', color: '#2563eb', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '700' }}
                    >
                      + Create New
                    </button>
                  </div>
                  <select 
                    className="form-input" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    {!availableCollections.includes(category) && category && (
                      <option value={category}>{category}</option>
                    )}
                    {availableCollections.map(colName => (
                      <option key={colName} value={colName}>{colName}</option>
                    ))}
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

      {/* Import Products CSV Modal */}
      {isImportModalOpen && (
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
          <div className="card" style={{ maxWidth: '620px', width: '100%', backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>Import Products by CSV</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Upload products using the official Shopify CSV export/import format</span>
              </div>
              <button className="btn btn-ghost" onClick={() => setIsImportModalOpen(false)} style={{ padding: '4px 8px', fontSize: '1rem' }}>✕</button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', marginBottom: '1.25rem' }}>
              <FileText size={36} style={{ color: '#64748b', margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                {importFile ? importFile.name : 'Select or drag your CSV file here'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '1rem' }}>
                Supports standard Shopify CSV column headers (Handle, Title, Body, Vendor, Category, Price, SKU, Barcode, Image Src, Stock).
              </div>

              <input 
                type="file" 
                accept=".csv" 
                onChange={handleSelectCsvFile}
                style={{ display: 'none' }}
                id="csvFileInput"
              />
              <label 
                htmlFor="csvFileInput" 
                className="btn btn-outline" 
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
              >
                <Upload size={14} /> Browse CSV File
              </label>
            </div>

            {importStatusMsg && (
              <div style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: '6px', 
                fontSize: '0.78rem', 
                fontWeight: '600', 
                marginBottom: '1.25rem',
                backgroundColor: importedParsedRows.length > 0 ? '#f0fdf4' : '#fff1f2',
                color: importedParsedRows.length > 0 ? '#166534' : '#9f1239',
                border: importedParsedRows.length > 0 ? '1px solid #bbf7d0' : '1px solid #fecdd3',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {importedParsedRows.length > 0 && <CheckCircle size={16} />}
                {importStatusMsg}
              </div>
            )}

            {importedParsedRows.length > 0 && (
              <div style={{ maxHeight: '160px', overflowY: 'auto', marginBottom: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                    <tr>
                      <th style={{ padding: '6px 10px' }}>Title</th>
                      <th style={{ padding: '6px 10px' }}>Category</th>
                      <th style={{ padding: '6px 10px' }}>SKU</th>
                      <th style={{ padding: '6px 10px' }}>Price</th>
                      <th style={{ padding: '6px 10px' }}>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importedParsedRows.slice(0, 5).map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px 10px', fontWeight: '700' }}>{p.title}</td>
                        <td style={{ padding: '6px 10px' }}>{p.category}</td>
                        <td style={{ padding: '6px 10px' }}>{p.sku}</td>
                        <td style={{ padding: '6px 10px' }}>₹{p.price}</td>
                        <td style={{ padding: '6px 10px' }}>{p.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importedParsedRows.length > 5 && (
                  <div style={{ padding: '6px 10px', fontSize: '0.7rem', color: '#64748b', textAlign: 'center', backgroundColor: '#fafafa' }}>
                    ... and {importedParsedRows.length - 5} more product(s)
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                className="btn btn-ghost" 
                onClick={handleDownloadSampleCsv} 
                style={{ fontSize: '0.75rem', color: '#2563eb', padding: 0 }}
              >
                Download Sample CSV Template
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-outline" onClick={() => setIsImportModalOpen(false)}>Cancel</button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleExecuteImport}
                  disabled={importedParsedRows.length === 0}
                  style={{ opacity: importedParsedRows.length === 0 ? 0.5 : 1 }}
                >
                  Import {importedParsedRows.length} Product(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
