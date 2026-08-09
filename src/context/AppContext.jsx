import React, { createContext, useState, useEffect, useRef } from 'react';
import { db, doc, setDoc, onSnapshot, collection, deleteDoc } from '../config/firebase';
import importedProductsData from '../data/importedProducts.json';
import { CheckCircle2, AlertTriangle, X, Info, HelpCircle } from 'lucide-react';

export const AppContext = createContext();

// Dynamic Sample Data
const initialProducts = [
  ...(Array.isArray(importedProductsData) ? importedProductsData : []),
  {
    id: 'p1',
    title: 'Premium Electric Hospital Bed (5 Function)',
    description: 'Fully motorized clinical hospital bed designed for patient comfort and caregiver convenience. Adjust head elevation, knee rest height, total bed height, trendelenburg, and reverse trendelenburg positions using a simple hand remote control. Built with robust steel framing, durable ABS paneling, and collapsable guard rails.',
    category: 'Home Care',
    price: 48500,
    mrp: 65000,
    image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isRentable: true,
    rentRates: { daily: 300, weekly: 1800, monthly: 5500 },
    securityDeposit: 10000,
    specifications: [
      { name: 'Overall Size', value: '2150mm L x 960mm W x 480-720mm H' },
      { name: 'Weight Capacity', value: '250 kg' },
      { name: 'Actuators', value: '4 Linear Actuators' },
      { name: 'Castors', value: '125mm Silent Castors with Central Locking' },
      { name: 'Backup Power', value: 'In-built battery backup included' }
    ],
    stock: 8,
    lowStockThreshold: 3,
    brand: 'CareQuip',
    tags: ['hospital beds', 'electric', 'home care', 'patient bed'],
    reviews: [
      { name: 'Sanjay Kumar', rating: 5, comment: 'Bought this for my father post-surgery. The motors are silent and the adjustment controls are very smooth.', date: '2026-06-15' },
      { name: 'Meera Sen', rating: 4, comment: 'High quality construction. Same-day delivery and setup done in Chennai was highly helpful.', date: '2026-07-02' }
    ],
    qa: [
      { question: 'Does the bed come with a mattress?', answer: 'Yes, a high-density 4-inch medical mattress is included with both purchase and rentals.' },
      { question: 'Is setup support provided at home?', answer: 'Yes, our expert engineers perform in-house assembly and demonstrate all controls on delivery (free setup for Chennai).' }
    ],
    seo: {
      title: 'Buy/Rent Premium Electric Hospital Bed (5 Function) - AeonCare',
      description: 'Rent or buy a 5-function electric medical hospital bed for home care in India. Remote controlled head, foot, height adjust. Fast setup in Chennai.',
      slug: 'electric-hospital-bed-5-function'
    }
  },
  {
    id: 'p2',
    title: 'Ergonomic Lightweight Folding Wheelchair',
    description: 'Aircraft-grade lightweight aluminum frame folding wheelchair. Cushioned breathable double seat pads, attendant brakes, swing-away footrests, and puncture-proof solid rear tires. Ideal for elders and mobility-impaired individuals seeking easy indoor and outdoor transit.',
    category: 'Mobility Aid',
    price: 12400,
    mrp: 18000,
    image: 'https://images.unsplash.com/photo-1540827299061-002d235882b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isRentable: true,
    rentRates: { daily: 150, weekly: 800, monthly: 2400 },
    securityDeposit: 3000,
    specifications: [
      { name: 'Seat Width', value: '18 inches (46 cm)' },
      { name: 'Total Weight', value: '11.5 kg (Ultra light)' },
      { name: 'Frame Material', value: 'Anodized Aircraft Aluminum' },
      { name: 'Brakes', value: 'Dual Attendant Brakes + Wheel Locks' }
    ],
    stock: 15,
    lowStockThreshold: 4,
    brand: 'AeonFit',
    tags: ['wheelchair', 'mobility', 'folding', 'lightweight'],
    reviews: [
      { name: 'Ramesh V.', rating: 5, comment: 'Extremely lightweight. Easily fits in the car trunk for doctor visits.', date: '2026-06-28' }
    ],
    qa: [
      { question: 'What is the maximum weight capacity?', answer: 'It easily supports up to 125 kg patient weight.' }
    ],
    seo: {
      title: 'Buy/Rent Ergonomic Lightweight Folding Wheelchair - AeonCare',
      description: 'Shop aluminum lightweight folding wheelchairs online. Dual attendant brakes, compact car boot fit. Daily and monthly rental options available.',
      slug: 'lightweight-folding-wheelchair'
    }
  },
  {
    id: 'p3',
    title: 'Medical Grade Oxygen Concentrator (10L Dual Flow)',
    description: 'High purity continuous flow 10 Litre per minute oxygen concentrator with built-in purity indicator monitor and nebulizer outlet. Delivers 93% ± 3% medical oxygen concentration continuously for respiratory care patients at home.',
    category: 'Respiratory Care',
    price: 58000,
    mrp: 75000,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isRentable: true,
    rentRates: { daily: 400, weekly: 2500, monthly: 7500 },
    securityDeposit: 15000,
    specifications: [
      { name: 'Oxygen Flow', value: '1 - 10 LPM (Dual Outlet)' },
      { name: 'Oxygen Purity', value: '93% ± 3% across all flow rates' },
      { name: 'Sound Level', value: '< 45 dBA (Quiet Operation)' },
      { name: 'Alarms', value: 'Low Purity, Power Outage, High Pressure' }
    ],
    stock: 2,
    lowStockThreshold: 2,
    brand: 'OxyPure',
    tags: ['oxygen concentrator', '10lpm', 'respiratory', 'nebulizer'],
    reviews: [
      { name: 'Dr. Anand', rating: 5, comment: 'Reliable 10L continuous output. Low noise motor makes it suitable for bedroom overnight use.', date: '2026-07-05' }
    ],
    qa: [
      { question: 'Is oxygen cannula tubing included?', answer: 'Yes, 2 adult nasal cannulas, humidifier bottle, and extra intake filters are included.' }
    ],
    seo: {
      title: 'Medical 10L Oxygen Concentrator Buy & Rent - AeonCare',
      description: 'Continuous 10 LPM medical oxygen concentrators for home care. High purity 93% oxygen output with 24/7 delivery in Chennai.',
      slug: '10l-oxygen-concentrator'
    }
  },
  {
    id: 'p4',
    title: 'Digital Automatic Blood Pressure Monitor with Voice',
    description: 'Accurate upper arm digital BP monitor equipped with Intellisense cuff technology, arrhythmia heartbeat detector, and bilingual voice readout feature. Stores up to 180 readings for 2 users with date and time stamps.',
    category: 'Diagnostics',
    price: 2150,
    mrp: 3200,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isRentable: false,
    rentRates: { daily: 0, weekly: 0, monthly: 0 },
    securityDeposit: 0,
    specifications: [
      { name: 'Measurement Range', value: 'Pressure: 0-299 mmHg | Pulse: 40-180 bpm' },
      { name: 'Accuracy', value: 'Pressure ±3 mmHg | Pulse ±5%' },
      { name: 'Display', value: 'Large Backlit LCD Display' },
      { name: 'Power', value: '4 x AA Batteries + Type-C USB Port' }
    ],
    stock: 45,
    lowStockThreshold: 10,
    brand: 'AeonFit',
    tags: ['bp monitor', 'blood pressure', 'diagnostics', 'digital'],
    reviews: [
      { name: 'Kavitha P.', rating: 5, comment: 'Very accurate readings compared with doctor clinic. Clear voice announcement helps elderly parents.', date: '2026-07-10' }
    ],
    qa: [
      { question: 'What is the cuff size range?', answer: 'Standard wide cuff fits arm circumferences from 22 cm to 42 cm.' }
    ],
    seo: {
      title: 'Digital BP Monitor with Voice - Buy Online - AeonCare',
      description: 'Buy automatic digital blood pressure monitor with voice function. Dual user 180 memory capacity. Fast delivery across India.',
      slug: 'digital-bp-monitor-voice'
    }
  },
  {
    id: 'p5',
    title: 'Ultra Light Weight Folding Patient Walker with Wheels',
    description: 'High-strength anodized aluminum lightweight folding walker with 5-inch front wheels and non-slip rubber tips. Height adjustable with one-button push folding mechanism. Perfect support for elderly mobility and post-surgery walking rehabilitation.',
    category: 'Mobility Aid',
    price: 2450,
    mrp: 3500,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isRentable: true,
    rentRates: { daily: 50, weekly: 300, monthly: 900 },
    securityDeposit: 1000,
    specifications: [
      { name: 'Frame Material', value: 'Anodized Lightweight Aluminum' },
      { name: 'Height Adjustment', value: '78 cm - 96 cm (8 levels)' },
      { name: 'Weight Capacity', value: '110 kg' },
      { name: 'Weight', value: '2.4 kg' }
    ],
    stock: 20,
    lowStockThreshold: 5,
    brand: 'AeonFit',
    tags: ['walker', 'walkers', 'walkstick', 'walking stick', 'mobility', 'crutches', 'folding walker'],
    reviews: [
      { name: 'Subramanian R.', rating: 5, comment: 'Very sturdy and lightweight walker. Easy for my father to fold and keep in the car.', date: '2026-07-12' }
    ],
    qa: [
      { question: 'Is the height adjustable?', answer: 'Yes, height can be adjusted easily across 8 preset levels.' }
    ],
    seo: {
      title: 'Buy/Rent Light Weight Folding Patient Walker - AeonCare',
      description: 'Shop aluminum folding patient walkers with wheels online. Height adjustable, one-button fold.',
      slug: 'folding-patient-walker-wheels'
    }
  },
  {
    id: 'p6',
    title: 'Ergonomic Quad Cane Walking Stick with Anti-Slip Base',
    description: '4-leg quad walking stick designed for superior stability and balance. Features soft foam grip handle, lightweight aluminum shaft, and self-standing 4-prong rubber base for maximum support on flat and uneven surfaces.',
    category: 'Mobility Aid',
    price: 1350,
    mrp: 1950,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isRentable: false,
    rentRates: { daily: 0, weekly: 0, monthly: 0 },
    securityDeposit: 0,
    specifications: [
      { name: 'Base Type', value: 'Quad 4-Leg Rubber Tip Base' },
      { name: 'Height Adjustment', value: '72 cm - 95 cm' },
      { name: 'Weight Capacity', value: '100 kg' },
      { name: 'Grip', value: 'Ergonomic Cushioned Foam' }
    ],
    stock: 35,
    lowStockThreshold: 8,
    brand: 'CareQuip',
    tags: ['walkstick', 'walkers', 'walking stick', 'quad cane', 'stick', 'mobility'],
    reviews: [
      { name: 'Parvathi M.', rating: 5, comment: 'Provides great support for my mother. Doesn’t slip even on smooth tile floors.', date: '2026-07-14' }
    ],
    qa: [
      { question: 'Can it stand upright on its own?', answer: 'Yes, the wide 4-prong base allows it to stand independently.' }
    ],
    seo: {
      title: 'Buy Quad Cane Walking Stick Online - AeonCare',
      description: 'Four prong quad walking stick for elderly stability. Height adjustable non-slip base.',
      slug: 'quad-cane-walking-stick'
    }
  }
];

const initialCustomers = [
  { id: 'c1', name: 'JINTO Luies aj', email: 'jinto@gmail.com', phone: '+91 99959 72384', location: 'Chennai, TN', ordersCount: 4, totalSpent: 62500, tags: ['Regular Buyer', 'VIP'] },
  { id: 'c2', name: 'Muthukumarappan D', email: 'muthu@gmail.com', phone: '+91 80124 84422', location: 'Coimbatore, TN', ordersCount: 2, totalSpent: 18400, tags: ['Rental Client'] },
  { id: 'c3', name: 'Reena Kumari', email: 'reena@gmail.com', phone: '+91 99409 55150', location: 'Chennai, TN', ordersCount: 1, totalSpent: 4850, tags: ['New Customer'] },
  { id: 'c4', name: 'Ullas Agrawal', email: 'ullas.agrawal@gknaerospace.com', phone: '+91 91089 53426', location: 'Bengaluru, KA', ordersCount: 3, totalSpent: 89000, tags: ['Corporate B2B', 'VIP'] }
];

const initialOrders = [
  {
    id: 'AC-1001',
    date: '2026-07-14',
    customerName: 'JINTO Luies aj',
    customerEmail: 'jinto@gmail.com',
    customerPhone: '+91 99959 72384',
    items: [
      { id: 'p1', title: 'Premium Electric Hospital Bed (5 Function)', qty: 1, price: 48500, type: 'buy' }
    ],
    subtotal: 48500,
    depositTotal: 0,
    discountAmount: 0,
    shippingFee: 0,
    total: 48500,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    razorpayPaymentId: 'pay_Nz94k80123Xy',
    status: 'shipped',
    shippingAddress: {
      name: 'JINTO Luies aj',
      phone: '+91 99959 72384',
      address: '14 Mount Poonamallee High Rd',
      city: 'Chennai',
      pincode: '600089'
    },
    orderType: 'buy',
    timeline: [
      { time: '2026-07-14 10:30', text: 'Order placed & payment confirmed via Razorpay.' },
      { time: '2026-07-14 14:00', text: 'Packed & dispatched via Express Cargo Courier.' }
    ]
  },
  {
    id: 'AC-1002',
    date: '2026-07-15',
    customerName: 'Muthukumarappan D',
    customerEmail: 'muthu@gmail.com',
    customerPhone: '+91 80124 84422',
    items: [
      { id: 'p2', title: 'Ergonomic Lightweight Folding Wheelchair', qty: 1, price: 12400, type: 'buy' }
    ],
    subtotal: 12400,
    depositTotal: 0,
    discountAmount: 400,
    shippingFee: 0,
    total: 12000,
    paymentMethod: 'paypal',
    paymentStatus: 'paid',
    paypalTransactionId: 'PAYID-M984012389',
    status: 'fulfilled',
    shippingAddress: {
      name: 'Muthukumarappan D',
      phone: '+91 80124 84422',
      address: '42 Cross Street',
      city: 'Coimbatore',
      pincode: '641001'
    },
    orderType: 'buy',
    timeline: [
      { time: '2026-07-15 11:15', text: 'Order placed & payment verified via PayPal.' },
      { time: '2026-07-15 16:30', text: 'Order fulfilled & customer pickup complete.' }
    ]
  }
];

const initialDiscounts = [
  { code: 'WELCOME10', discountType: 'percentage', value: 10, minOrder: 1000, active: true },
  { code: 'FLAT500', discountType: 'fixed', value: 500, minOrder: 5000, active: true }
];

const initialFAQs = [
  { id: 'f1', question: 'How quickly is medical equipment delivered in Chennai?', answer: 'We offer express 4 to 8 hour doorstep delivery and technician setup for hospital beds and oxygen concentrators within Chennai city limits.' },
  { id: 'f2', question: 'What documents are needed to rent equipment?', answer: 'A valid Government photo ID (Aadhaar or Driving License) and refundable security deposit are required upon delivery.' }
];

const initialBlogs = [
  { 
    id: 'b1', 
    title: 'How to Choose the Right Hospital Bed for Elderly Home Recovery', 
    category: 'Home Care', 
    author: 'Dr. S. Ranganathan (Senior Physiatrist)', 
    date: '2026-06-20', 
    summary: 'Choosing the right medical cot is crucial for post-surgery and elderly home care. Learn the differences between manual 2-function, semi-electric, and 5-function ICU beds.', 
    content: 'Home care recovery requires careful assessment of patient mobility and caregiver strength. A 5-function electric bed provides independent remote controls for head elevation, leg elevation, and overall height adjustment.' 
  }
];

const initialLeads = [
  { id: 'l1', name: 'Asha Murali', phone: '9840223344', pincode: '600041', need: 'Requires home safety assessment for elderly mother.', date: '2026-07-16', status: 'new' }
];

const initialAnalytics = {
  visitors: 3240,
  ordersTotal: 18150,
  bounceRate: '38.4%',
  funnel: {
    sessions: 420,
    productViews: 290,
    addToCart: 110,
    checkoutStarted: 62,
    purchases: 2
  },
  pageSessions: [
    { id: 'home', name: 'Home Page', path: '/', views: 245, uniqueVisitors: 198, avgTime: '2m 15s', bounceRate: '32%', conversionRate: '3.2%' },
    { id: 'catalog', name: 'Shop Catalog', path: '/catalog', views: 182, uniqueVisitors: 154, avgTime: '3m 40s', bounceRate: '28%', conversionRate: '5.1%' },
    { id: 'pdp', name: 'Product Details (PDP)', path: '/product/:id', views: 145, uniqueVisitors: 120, avgTime: '4m 10s', bounceRate: '24%', conversionRate: '8.4%' },
    { id: 'services', name: 'Care Services & Setup', path: '/services', views: 95, uniqueVisitors: 82, avgTime: '1m 50s', bounceRate: '41%', conversionRate: '2.5%' },
    { id: 'blog', name: 'Blog & FAQs', path: '/blog', views: 68, uniqueVisitors: 55, avgTime: '2m 30s', bounceRate: '38%', conversionRate: '1.2%' },
    { id: 'userPortal', name: 'My Account / Orders', path: '/account', views: 42, uniqueVisitors: 31, avgTime: '1m 20s', bounceRate: '15%', conversionRate: '12.0%' },
    { id: 'checkout', name: 'Checkout Page', path: '/checkout', views: 35, uniqueVisitors: 32, avgTime: '3m 05s', bounceRate: '12%', conversionRate: '68.5%' }
  ],
  sources: [
    { name: 'Organic Search', count: 180, percentage: 43 },
    { name: 'Direct Traffic', count: 100, percentage: 24 },
    { name: 'Facebook Ads', count: 85, percentage: 20 },
    { name: 'Google Ads', count: 35, percentage: 8 },
    { name: 'UTM Campaigns', count: 20, percentage: 5 }
  ],
  campaigns: [
    { name: 'MONSOON_RENTALS', clicks: 124, orders: 4, revenue: 22000 },
    { name: 'DIAPER_REORDER_EMAIL', clicks: 80, orders: 8, revenue: 9200 }
  ],
  pixelConfig: {
    facebookPixelId: '123456789098765',
    googleAdsTagId: 'AW-9876543210'
  }
};

const initialStoreSettings = {
  storeName: 'AeonCare Healthcare Supply',
  domain: 'aeoncare.in',
  storeEmail: 'billing@aeoncare.in',
  storePhone: '+91 98401 23456',
  whatsappPhone: '+919840123456',
  slogan: 'Caring for your family, right at home.',
  addressLine1: '114 First Floor, Mount Poonamallee High Rd',
  addressLine2: 'Porur',
  city: 'Chennai',
  state: 'Tamil Nadu',
  pincode: '600089',
  country: 'India',
  taxRate: 12,
  gstNumber: '33AAAAA0000A1Z5',
  panNumber: 'AAAAA0000A',
  taxMode: 'inclusive',
  currencySymbol: '₹',
  currencyCode: 'INR',
  freeShippingThreshold: 2000,
  
  // Payment Gateway Configurations
  enableRazorpay: true,
  razorpayKeyId: 'rzp_test_98401234567890',
  razorpayKeySecret: 'secret_key_demo_razorpay',
  razorpayMode: 'test',
  razorpayMerchantName: 'AeonCare Healthcare Supply',

  enablePayPal: true,
  paypalClientId: 'client_id_paypal_aeoncare_98401',
  paypalSecretKey: 'secret_key_paypal_aeoncare_98401',
  paypalMode: 'sandbox',
  paypalCurrency: 'USD',

  enableCod: true,
  enableUpiDirect: true,
  upiId: 'aeoncare@okicici',

  // Automated WhatsApp & SMS Settings
  enableWhatsappAlerts: true,
  enableSmsAlerts: true,
  whatsappSenderId: 'AEONCARE_BIZ',
  smsApiKey: 'sms_api_key_aeoncare_demo'
};

const initialLayout = {
  productsPerPage: 20,
  themeColors: 'teal',
  logoText: 'AeonCare',
  announcementBar: '🚚 Free Express Delivery in Chennai on Orders above ₹2,000!',
  hiddenSections: [],
  navigationTabs: [
    { id: 'home', label: 'Home', collection: 'home' },
    { id: 'wheelchairs', label: 'Wheelchairs', collection: 'Wheelchairs' },
    { id: 'hospital_bed', label: 'Hospital Bed Collection', collection: 'Hospital Bed' },
    { id: 'walkers_stick', label: 'Walkers & Walkstick Collection', collection: 'Walkers & Walkstick' },
    { id: 'services', label: 'Care Services', collection: 'services' },
    { id: 'blog', label: 'Help & FAQs', collection: 'blog' },
    { id: 'userPortal', label: 'My Account', collection: 'userPortal' }
  ],
  sectionsOrder: ['hero', 'trust', 'collections', 'banner', 'featured', 'video', 'faq', 'blog', 'cta'],
  heroTitle: 'Caring for your family, right at home.',
  heroSubtitle: 'Buy premium medical equipment, mobility aids, clinical monitors and home-care consumables with same-day doorstep setup.',
  heroCTA: 'Browse Catalog',
  showBlogPreview: true,
  collectionsList: [
    { name: 'Hospital Bed', slug: 'hospital-bed', image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=200' },
    { name: 'Mobility Aid', slug: 'mobility-aid', image: 'https://images.unsplash.com/photo-1540827299061-002d235882b5?w=200' },
    { name: 'Respiratory Care', slug: 'respiratory-care', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=200' },
    { name: 'Diagnostics', slug: 'diagnostics', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200' }
  ]
};

const initialUserAddresses = [
  { id: 'addr_1', name: 'Sanjay Kumar', phone: '+91 98401 23456', address: 'Flat 4B, Sky Towers, 14 Mount Poonamallee Rd, Porur', city: 'Chennai', pincode: '600089', isDefault: true },
  { id: 'addr_2', name: 'Sanjay (Office)', phone: '+91 98401 23456', address: 'Tech Park, Floor 3, Guindy', city: 'Chennai', pincode: '600032', isDefault: false }
];

const getStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) && typeof fallback === 'object' && !Array.isArray(fallback)) {
      return { ...fallback, ...parsed };
    }
    return parsed;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
};

const getProductKey = (p) => {
  if (!p) return '';
  if (p.handle && String(p.handle).trim().length > 0) return String(p.handle).toLowerCase().trim();
  if (p.title && String(p.title).trim().length > 0) return String(p.title).toLowerCase().trim();
  return String(p.id || '');
};

const deduplicateProducts = (productsList) => {
  if (!Array.isArray(productsList)) return [];
  const map = new Map();
  productsList.forEach(p => {
    if (!p) return;
    const key = getProductKey(p);
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, p);
    } else {
      const existing = map.get(key);
      const isCsv = String(p.id).startsWith('p_csv_');
      const merged = isCsv ? { ...p, ...existing } : { ...existing, ...p };
      map.set(key, merged);
    }
  });
  return Array.from(map.values());
};

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(() => deduplicateProducts(getStorage('aeon_products', initialProducts)));
  const [customers, setCustomers] = useState(() => getStorage('aeon_customers', initialCustomers));
  const [orders, setOrders] = useState(() => getStorage('aeon_orders', initialOrders));
  const [discounts, setDiscounts] = useState(() => getStorage('aeon_discounts', initialDiscounts));
  const [faqs, setFaqs] = useState(() => getStorage('aeon_faqs', initialFAQs));
  const [blogs, setBlogs] = useState(() => getStorage('aeon_blogs', initialBlogs));
  const [leads, setLeads] = useState(() => getStorage('aeon_leads', initialLeads));
  const [userAddresses, setUserAddresses] = useState(() => getStorage('aeon_user_addresses', initialUserAddresses));
  const [wishlist, setWishlist] = useState(() => getStorage('aeon_wishlist', ['p2', 'p4']));
  const initialApprovedStaff = [
    { email: 'bloodhunt029@gmail.com', role: 'Super Admin', status: 'approved', addedAt: '2026-07-25 18:00' },
    { email: 'prasanth08-29@gmail.com', role: 'Super Admin', status: 'approved', addedAt: '2026-07-25 18:00' },
    { email: 'admin@aeoncare.in', role: 'Super Admin', status: 'approved', addedAt: '2026-07-25 18:00' },
    { email: 'support@aeoncare.in', role: 'Super Admin', status: 'approved', addedAt: '2026-07-25 18:00' }
  ];

  const [approvedStaff, setApprovedStaff] = useState(() => {
    const saved = getStorage('aeon_approved_staff', initialApprovedStaff);
    const defaults = ['bloodhunt029@gmail.com', 'prasanth08-29@gmail.com', 'admin@aeoncare.in', 'support@aeoncare.in'];
    let updated = Array.isArray(saved) ? [...saved] : [];
    defaults.forEach(email => {
      if (!updated.some(s => s?.email?.toLowerCase() === email.toLowerCase())) {
        updated.push({ email, role: 'Super Admin', status: 'approved', addedAt: '2026-07-25 18:00' });
      }
    });
    return updated;
  });
  const [pendingRequests, setPendingRequests] = useState(() => getStorage('aeon_pending_requests', []));
  const [userRole, setUserRole] = useState('Super Admin');

  const [storeSettings, setStoreSettings] = useState(() => getStorage('aeon_settings', initialStoreSettings));
  const [layout, setLayout] = useState(() => getStorage('aeon_layout', initialLayout));

  const [cart, setCart] = useState(() => getStorage('aeon_cart', []));
  const [activeUtm, setActiveUtm] = useState('');
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [notificationLogs, setNotificationLogs] = useState([]);

  const isInitialSyncDone = useRef(false);

  // Helper function to save to LocalStorage and Cloud Firestore safely
  const saveKey = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`LocalStorage save notice for ${key}:`, e);
    }

    try {
      if (db) {
        setDoc(doc(db, 'healthcare_store', key), { data, updatedAt: new Date().toISOString() }).catch((err) => {
          console.error(`Firestore save error for ${key}:`, err);
        });
      }
    } catch (e) {
      console.error(`Firestore setDoc error for ${key}:`, e);
    }
  };

  // Realtime Cloud Firestore listeners for all store datasets
  useEffect(() => {
    if (!db) {
      isInitialSyncDone.current = true;
      return;
    }

    const unsubscribes = [];
    const loadedKeys = new Set();

    const syncDoc = (key, setter, fallbackData) => {
      const unsub = onSnapshot(doc(db, 'healthcare_store', key), (docSnap) => {
        loadedKeys.add(key);
        if (docSnap.exists() && docSnap.data()?.data !== undefined) {
          const cloudData = docSnap.data().data;
          const localSaved = getStorage(key, null);

          // If local browser has more products than cloud (e.g. added offline or bulk imported locally), merge & sync up to Firestore
          if (key === 'aeon_products' && Array.isArray(cloudData) && Array.isArray(localSaved) && localSaved.length > cloudData.length) {
            const combinedMap = new Map();
            // Cloud items first
            cloudData.forEach(p => p && p.id && combinedMap.set(p.id, p));
            // Local items supplement
            localSaved.forEach(p => p && p.id && combinedMap.set(p.id, p));
            const mergedProducts = Array.from(combinedMap.values());
            setter(mergedProducts);
            saveKey(key, mergedProducts);
          } else {
            setter(cloudData);
            try {
              localStorage.setItem(key, JSON.stringify(cloudData));
            } catch (err) {}
          }
        } else if (!docSnap.exists() && fallbackData) {
          // Document does not exist in Cloud Firestore yet; initialize it with fallbackData once
          setDoc(doc(db, 'healthcare_store', key), { data: fallbackData, updatedAt: new Date().toISOString() }).catch((err) => {
            console.error(`Error initializing document ${key} in Firestore:`, err);
          });
          setter(fallbackData);
        }
      }, (err) => {
        console.warn(`Firestore snapshot sync error for ${key}:`, err);
      });
      unsubscribes.push(unsub);
    };

    // Realtime Cloud Firestore listener for full product catalog
    syncDoc('aeon_products', (cloudProducts) => {
      if (Array.isArray(cloudProducts) && cloudProducts.length > 0) {
        const localSaved = getStorage('aeon_products', []);
        const merged = deduplicateProducts([
          ...initialProducts,
          ...cloudProducts,
          ...(Array.isArray(localSaved) ? localSaved : [])
        ]);
        setProducts(merged);
        try { localStorage.setItem('aeon_products', JSON.stringify(merged)); } catch (e) {}
      } else {
        const dedupedInitial = deduplicateProducts(initialProducts);
        setProducts(dedupedInitial);
        saveKey('aeon_products', dedupedInitial);
      }
    }, initialProducts);

    // Realtime Cloud Firestore collection listener for individual product documents
    const unsubProducts = onSnapshot(collection(db, 'healthcare_products'), (querySnap) => {
      let cloudProducts = [];
      querySnap.forEach((docSnap) => {
        cloudProducts.push({ id: docSnap.id, ...docSnap.data() });
      });

      if (cloudProducts.length > 0) {
        setProducts(prev => {
          const mergedProducts = deduplicateProducts([
            ...initialProducts,
            ...prev,
            ...cloudProducts
          ]);
          try { localStorage.setItem('aeon_products', JSON.stringify(mergedProducts)); } catch (e) {}
          return mergedProducts;
        });
      }
    }, (err) => {
      console.warn('Firestore products collection sync warning:', err);
    });
    unsubscribes.push(unsubProducts);

    syncDoc('aeon_customers', setCustomers, initialCustomers);
    syncDoc('aeon_orders', setOrders, initialOrders);
    syncDoc('aeon_discounts', setDiscounts, initialDiscounts);
    syncDoc('aeon_faqs', setFaqs, initialFAQs);
    syncDoc('aeon_blogs', setBlogs, initialBlogs);
    syncDoc('aeon_leads', setLeads, initialLeads);
    syncDoc('aeon_settings', setStoreSettings, initialStoreSettings);
    syncDoc('aeon_layout', setLayout, initialLayout);
    syncDoc('aeon_approved_staff', setApprovedStaff, initialApprovedStaff);
    syncDoc('aeon_pending_requests', setPendingRequests, []);

    isInitialSyncDone.current = true;

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, []);

  // Keep cart strictly in local browser storage
  useEffect(() => {
    try {
      localStorage.setItem('aeon_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const requestStaffAccess = (email) => {
    const norm = email.toLowerCase().trim();
    if (!norm) return;
    if (approvedStaff.some(s => s.email.toLowerCase() === norm)) return;
    if (pendingRequests.some(r => r.email.toLowerCase() === norm)) return;

    setPendingRequests(prev => [
      ...prev,
      { email: norm, requestedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }), status: 'pending' }
    ]);
  };

  const approveStaffRequest = (email, assignedRole = 'Store/Catalog Manager') => {
    const norm = email.toLowerCase().trim();
    setPendingRequests(prev => prev.filter(r => r.email.toLowerCase() !== norm));
    setApprovedStaff(prev => {
      const existingIndex = prev.findIndex(s => s.email.toLowerCase() === norm);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], role: assignedRole, status: 'approved' };
        return copy;
      }
      return [...prev, { email: norm, role: assignedRole, status: 'approved', addedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) }];
    });
  };

  const rejectStaffRequest = (email) => {
    const norm = email.toLowerCase().trim();
    setPendingRequests(prev => prev.filter(r => r.email.toLowerCase() !== norm));
  };

  const removeApprovedStaff = (email) => {
    const norm = email.toLowerCase().trim();
    setApprovedStaff(prev => prev.filter(s => s.email.toLowerCase() !== norm));
  };

  const updateStoreSettings = (newSettings) => {
    setStoreSettings(prev => {
      const updated = { ...prev, ...newSettings };
      setLayout(lPrev => {
        const mergedL = {
          ...lPrev,
          logoText: updated.storeName || lPrev.logoText,
          heroTitle: updated.slogan ? updated.slogan : lPrev.heroTitle,
          footerText: updated.slogan ? `${updated.slogan} Premier home healthcare, clinical devices & medical equipment supply in ${updated.city || 'Chennai'}.` : lPrev.footerText,
          footerContactAddress: `${updated.storeName || 'AeonCare'}, ${updated.addressLine1 || ''}${updated.addressLine2 ? ', ' + updated.addressLine2 : ''}, ${updated.city || ''}, ${updated.state || ''} ${updated.pincode || ''}`.trim(),
          footerContactPhone: updated.storePhone || lPrev.footerContactPhone,
          footerContactEmail: updated.storeEmail || lPrev.footerContactEmail
        };
        saveKey('aeon_layout', mergedL);
        return mergedL;
      });
      saveKey('aeon_settings', updated);
      return updated;
    });
  };

  const updateLayout = (newLayout) => {
    setLayout(prev => {
      const updated = { ...prev, ...newLayout };
      saveKey('aeon_layout', updated);
      return updated;
    });
  };

  const resetLayout = () => {
    setLayout(initialLayout);
    saveKey('aeon_layout', initialLayout);
  };

  const resetStoreSettings = () => {
    setStoreSettings(initialStoreSettings);
    saveKey('aeon_settings', initialStoreSettings);
  };

  const resetProducts = () => {
    setProducts(initialProducts);
    saveKey('aeon_products', initialProducts);
  };

  const resetCustomers = () => {
    setCustomers(initialCustomers);
    saveKey('aeon_customers', initialCustomers);
  };

  const resetOrders = () => {
    setOrders(initialOrders);
    saveKey('aeon_orders', initialOrders);
  };

  const resetDiscounts = () => {
    setDiscounts(initialDiscounts);
    saveKey('aeon_discounts', initialDiscounts);
  };

  const resetFaqs = () => {
    setFaqs(initialFAQs);
    saveKey('aeon_faqs', initialFAQs);
  };

  const resetBlogs = () => {
    setBlogs(initialBlogs);
    saveKey('aeon_blogs', initialBlogs);
  };

  const resetLeads = () => {
    setLeads(initialLeads);
    saveKey('aeon_leads', initialLeads);
  };

  const resetAllStoreData = () => {
    setProducts(initialProducts);
    saveKey('aeon_products', initialProducts);
    setCustomers(initialCustomers);
    saveKey('aeon_customers', initialCustomers);
    setOrders(initialOrders);
    saveKey('aeon_orders', initialOrders);
    setDiscounts(initialDiscounts);
    saveKey('aeon_discounts', initialDiscounts);
    setFaqs(initialFAQs);
    saveKey('aeon_faqs', initialFAQs);
    setBlogs(initialBlogs);
    saveKey('aeon_blogs', initialBlogs);
    setLeads(initialLeads);
    saveKey('aeon_leads', initialLeads);
    setStoreSettings(initialStoreSettings);
    saveKey('aeon_settings', initialStoreSettings);
    setLayout(initialLayout);
    saveKey('aeon_layout', initialLayout);
    setCart([]);
    saveKey('aeon_cart', []);
  };

  // Cart actions with unique cartItemId support
  const getCartItemId = (item) => {
    if (!item) return '';
    if (item.cartItemId) return item.cartItemId;
    const type = item.type || 'buy';
    const variant = item.variant ? String(item.variant).replace(/\s+/g, '_') : 'std';
    return `${item.id}_${type}_${variant}`;
  };

  const addToCart = (product, qty = 1, options = {}) => {
    setCart(prev => {
      const type = options.type || product.type || 'buy';
      const variant = product.variant || options.variant || null;
      const targetCartItemId = `${product.id}_${type}_${variant ? String(variant).replace(/\s+/g, '_') : 'std'}`;

      const existingIndex = prev.findIndex(i => (i.cartItemId || getCartItemId(i)) === targetCartItemId);
      if (existingIndex > -1) {
        return prev.map((item, idx) => idx === existingIndex ? { ...item, qty: item.qty + qty } : item);
      }

      const newCartItem = {
        ...product,
        cartItemId: targetCartItemId,
        qty: qty || product.qty || 1,
        type,
        variant,
        rentDuration: options.rentDuration || product.rentDuration || null
      };
      return [...prev, newCartItem];
    });
  };

  const removeFromCart = (cartItemIdOrId) => {
    setCart(prev => prev.filter(i => (i.cartItemId || getCartItemId(i)) !== cartItemIdOrId && i.id !== cartItemIdOrId));
  };

  const updateCartQty = (cartItemIdOrId, qty) => {
    setCart(prev => prev.map(i => {
      const currentKey = i.cartItemId || getCartItemId(i);
      if (currentKey === cartItemIdOrId || i.id === cartItemIdOrId) {
        return { ...i, qty: Math.max(1, qty) };
      }
      return i;
    }));
  };

  const clearCart = () => setCart([]);

  // Page View Tracking
  const trackPageView = (pageId, customName, customPath) => {
    setAnalytics(prev => {
      const existingList = prev?.pageSessions || [];
      const index = existingList.findIndex(p => p.id === pageId);
      let updatedPageSessions;

      if (index > -1) {
        updatedPageSessions = existingList.map((p, idx) => {
          if (idx === index) {
            return {
              ...p,
              name: customName || p.name,
              path: customPath || p.path,
              views: p.views + 1,
              uniqueVisitors: p.uniqueVisitors + 1
            };
          }
          return p;
        });
      } else {
        const formattedName = customName || (pageId.charAt(0).toUpperCase() + pageId.slice(1).replace(/[-_]/g, ' ') + ' Page');
        const formattedPath = customPath || `/${pageId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        const newPage = {
          id: pageId,
          name: formattedName,
          path: formattedPath,
          views: 1,
          uniqueVisitors: 1,
          avgTime: '1m 45s',
          bounceRate: '25.0%',
          conversionRate: '3.0%'
        };
        updatedPageSessions = [...existingList, newPage];
      }

      return {
        ...prev,
        visitors: (prev?.visitors || 0) + 1,
        funnel: { ...(prev?.funnel || {}), sessions: ((prev?.funnel?.sessions) || 0) + 1 },
        pageSessions: updatedPageSessions
      };
    });
  };

  const addBlog = (blogData) => setBlogs(prev => [{ id: `b-${Date.now()}`, date: new Date().toISOString().split('T')[0], ...blogData }, ...prev]);
  const deleteBlog = (id) => setBlogs(prev => prev.filter(b => b.id !== id));

  const addFAQ = (faqData) => setFaqs(prev => [...prev, { id: `f-${Date.now()}`, ...faqData }]);
  const deleteFAQ = (id) => setFaqs(prev => prev.filter(f => f.id !== id));

  // Helper to generate WhatsApp & SMS alert payloads and URLs
  const triggerOrderNotification = (order, type = 'created') => {
    const rawPhone = (order.customerPhone || '').replace(/[^0-9]/g, '');
    const formattedPhone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

    let messageText = '';
    if (type === 'created') {
      messageText = `📦 AeonCare Order Alert: Hi ${order.customerName}! Your order #${order.id} (₹${(order.total || 0).toLocaleString('en-IN')}) has been received & confirmed. Track status online: https://aeoncare.in/track/${order.id}`;
    } else if (type === 'shipped') {
      messageText = `🚚 AeonCare Express Dispatch: Hi ${order.customerName}, your order #${order.id} has been shipped via Cargo Courier! Tracking ID: EXP${order.id}33. Contact support: +91 98401 23456.`;
    } else if (type === 'delivered') {
      messageText = `✅ AeonCare Delivery Complete: Order #${order.id} has been delivered & setup successfully. Thank you for choosing AeonCare Healthcare!`;
    } else {
      messageText = `📢 AeonCare Update: Hi ${order.customerName}, your order #${order.id} status is now: ${type.toUpperCase()}.`;
    }

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;

    const newLog = {
      id: `log-${Date.now()}`,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      orderId: order.id,
      customerName: order.customerName,
      phone: formattedPhone,
      type,
      messageText,
      whatsappUrl,
      channel: 'WhatsApp & SMS'
    };

    setNotificationLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  // Create Order
  const createOrder = (orderData) => {
    const nextOrderId = `AC-${orders.length + 1003}`;
    const newOrder = {
      id: nextOrderId,
      date: new Date().toISOString().split('T')[0],
      ...orderData,
      timeline: [
        { time: new Date().toISOString().replace('T', ' ').substring(0, 16), text: 'Order created successfully.' }
      ]
    };
    
    setOrders(prev => [newOrder, ...prev]);

    // Update customer lifetime spend
    setCustomers(prev => {
      const email = orderData.customerEmail || '';
      const index = prev.findIndex(c => c.email.toLowerCase() === email.toLowerCase());
      if (index > -1) {
        const updated = [...prev];
        updated[index].ordersCount += 1;
        updated[index].totalSpent += orderData.total;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `c${prev.length + 1}`,
            name: orderData.customerName,
            email: orderData.customerEmail || `${orderData.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
            phone: orderData.customerPhone,
            location: orderData.shippingAddress?.city || 'Chennai',
            ordersCount: 1,
            totalSpent: orderData.total,
            tags: ['Online Customer']
          }
        ];
      }
    });

    // Automatically log WhatsApp notification
    triggerOrderNotification(newOrder, 'created');

    return nextOrderId;
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated = {
          ...o,
          status: newStatus,
          timeline: [
            ...o.timeline,
            { time: new Date().toISOString().replace('T', ' ').substring(0, 16), text: `Status updated to ${newStatus}` }
          ]
        };
        // Trigger automated WhatsApp/SMS alert upon shipment/delivery
        triggerOrderNotification(updated, newStatus);
        return updated;
      }
      return o;
    }));
  };

  // Update payment status
  const updatePaymentStatus = (orderId, newPaymentStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus: newPaymentStatus,
          timeline: [
            ...o.timeline,
            { time: new Date().toISOString().replace('T', ' ').substring(0, 16), text: `Payment status updated to ${newPaymentStatus}` }
          ]
        };
      }
      return o;
    }));
  };

  // Product CRUD & Batch Import Actions (Individual Documents in healthcare_products Firestore Collection)
  const addProduct = (prodData) => {
    const newId = prodData.id || `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newProduct = { ...prodData, id: newId };

    setProducts(prev => {
      const updated = [newProduct, ...prev.filter(p => p.id !== newId)];
      saveKey('aeon_products', updated);
      return updated;
    });

    if (db) {
      setDoc(doc(db, 'healthcare_products', String(newId)), newProduct).catch(err => {
        console.error(`Error adding product ${newId} to Firestore:`, err);
      });
    }
  };

  const updateProduct = (updatedProd) => {
    if (!updatedProd || !updatedProd.id) return;
    const prodId = String(updatedProd.id);

    setProducts(prev => {
      const updated = prev.map(p => String(p.id) === prodId ? { ...p, ...updatedProd } : p);
      saveKey('aeon_products', updated);
      return updated;
    });

    if (db) {
      setDoc(doc(db, 'healthcare_products', prodId), updatedProd, { merge: true }).catch(err => {
        console.error(`Error updating product ${prodId} in Firestore:`, err);
      });
    }
  };

  const updateProductsBatch = (updatedProductsList) => {
    if (!Array.isArray(updatedProductsList)) return;

    setProducts(updatedProductsList);
    saveKey('aeon_products', updatedProductsList);

    if (db) {
      updatedProductsList.forEach(prod => {
        if (prod && prod.id) {
          setDoc(doc(db, 'healthcare_products', String(prod.id)), prod, { merge: true }).catch(err => {
            console.error(`Error updating product ${prod.id} in Firestore batch:`, err);
          });
        }
      });
    }
  };

  const deleteProduct = (id) => {
    if (!id) return;
    const prodId = String(id);

    setProducts(prev => {
      const updated = prev.filter(p => String(p.id) !== prodId);
      saveKey('aeon_products', updated);
      return updated;
    });

    if (db) {
      deleteDoc(doc(db, 'healthcare_products', prodId)).catch(err => {
        console.error(`Error deleting product ${prodId} from Firestore:`, err);
      });
    }
  };

  const importProducts = (newProductsList) => {
    if (!Array.isArray(newProductsList) || newProductsList.length === 0) return;

    setProducts(prev => {
      const updatedList = [...prev];
      const toWrite = [];

      newProductsList.forEach(newProd => {
        const existingIndex = updatedList.findIndex(
          p => (p.sku && newProd.sku && String(p.sku).toLowerCase() === String(newProd.sku).toLowerCase()) ||
               (p.handle && newProd.handle && String(p.handle).toLowerCase() === String(newProd.handle).toLowerCase())
        );

        const prodWithId = {
          id: existingIndex >= 0 ? updatedList[existingIndex].id : `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          ...newProd
        };

        if (existingIndex >= 0) {
          updatedList[existingIndex] = prodWithId;
        } else {
          updatedList.unshift(prodWithId);
        }
        toWrite.push(prodWithId);
      });

      saveKey('aeon_products', updatedList);

      if (db) {
        toWrite.forEach(prod => {
          setDoc(doc(db, 'healthcare_products', String(prod.id)), prod, { merge: true }).catch(err => {
            console.error(`Error importing product ${prod.id} to Firestore:`, err);
          });
        });
      }

      return updatedList;
    });
  };

  // Wishlist actions
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      let updated;
      if (prev.includes(productId)) {
        updated = prev.filter(id => id !== productId);
      } else {
        updated = [...prev, productId];
      }
      try { localStorage.setItem('aeon_wishlist', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  // Address Book actions
  const addUserAddress = (newAddr) => {
    setUserAddresses(prev => {
      const id = `addr_${Date.now()}`;
      const addrWithId = { ...newAddr, id, isDefault: prev.length === 0 || newAddr.isDefault };
      let updated = [...prev];
      if (addrWithId.isDefault) {
        updated = updated.map(a => ({ ...a, isDefault: false }));
      }
      updated.push(addrWithId);
      saveKey('aeon_user_addresses', updated);
      return updated;
    });
  };

  const updateUserAddress = (updatedAddr) => {
    setUserAddresses(prev => {
      let updated = prev.map(a => {
        if (a.id === updatedAddr.id) {
          return updatedAddr;
        }
        if (updatedAddr.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      });
      saveKey('aeon_user_addresses', updated);
      return updated;
    });
  };

  const deleteUserAddress = (id) => {
    setUserAddresses(prev => {
      const updated = prev.filter(a => a.id !== id);
      if (updated.length > 0 && !updated.some(a => a.isDefault)) {
        updated[0].isDefault = true;
      }
      saveKey('aeon_user_addresses', updated);
      return updated;
    });
  };

  // Lead / Service callback submission
  const submitLead = (payload) => {
    const newLead = {
      id: `l_${Date.now()}`,
      name: payload.name,
      phone: payload.phone,
      pincode: payload.pincode || '600089',
      need: payload.need || 'General Inquiry',
      date: new Date().toISOString().split('T')[0],
      status: 'new'
    };
    setLeads(prev => {
      const updated = [newLead, ...prev];
      saveKey('aeon_leads', updated);
      return updated;
    });
    return newLead;
  };

  // CSV Export utility
  const exportToCSV = (filename, dataArray) => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) return;
    const sample = dataArray[0];
    const headers = Object.keys(sample).filter(k => typeof sample[k] !== 'object');
    const csvRows = [];
    csvRows.push(headers.join(','));
    for (const row of dataArray) {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + (val ?? '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Modern Toast & Custom Confirmation Modal System
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);

  const showToast = (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message: String(message), type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const showConfirm = (title, message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel') => {
    setConfirmModal({
      title,
      message,
      onConfirm: () => {
        setConfirmModal(null);
        onConfirm?.();
      },
      onCancel: () => setConfirmModal(null),
      confirmText,
      cancelText
    });
  };

  // Override browser native window.alert globally for modern UI/UX
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.alert = (msg) => {
        const msgStr = String(msg || '');
        const isError = msgStr.toLowerCase().includes('error') || msgStr.toLowerCase().includes('fail') || msgStr.toLowerCase().includes('required') || msgStr.toLowerCase().includes('only jpg');
        showToast(msgStr, isError ? 'error' : 'success');
      };
    }
  }, []);

  return (
    <AppContext.Provider value={{
      products, setProducts, addProduct, updateProduct, updateProductsBatch, deleteProduct, importProducts, resetProducts,
      customers, setCustomers, resetCustomers,
      orders, setOrders, createOrder, updateOrderStatus, updatePaymentStatus, resetOrders,
      discounts, setDiscounts, resetDiscounts,
      faqs, setFaqs, addFAQ, deleteFAQ, resetFaqs,
      blogs, setBlogs, addBlog, deleteBlog, resetBlogs,
      storeSettings, setStoreSettings, updateStoreSettings, resetStoreSettings,
      layout, setLayout, updateLayout, resetLayout,
      cart, addToCart, removeFromCart, updateCartQty, clearCart,
      analytics, activeUtm, trackPageView, notificationLogs, triggerOrderNotification,
      leads, setLeads, submitLead, resetLeads,
      userAddresses, addUserAddress, updateUserAddress, deleteUserAddress,
      wishlist, toggleWishlist, exportToCSV,
      resetAllStoreData,
      userRole, setUserRole,
      approvedStaff, pendingRequests, requestStaffAccess, approveStaffRequest, rejectStaffRequest, removeApprovedStaff,
      showToast, showConfirm
    }}>
      {children}
      <ToastContainer toasts={toasts} setToasts={setToasts} />
      <ConfirmModal confirmModal={confirmModal} setConfirmModal={setConfirmModal} />
    </AppContext.Provider>
  );
};

/* ================= SLEEK TOAST NOTIFICATION CONTAINER ================= */
function ToastContainer({ toasts, setToasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1.25rem',
      right: '1.25rem',
      zIndex: 999999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      pointerEvents: 'none',
      maxWidth: '420px',
      width: 'calc(100% - 2.5rem)'
    }}>
      {toasts.map(toast => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';
        const borderColor = isError ? '#ef4444' : (isInfo ? '#3b82f6' : '#10b981');

        return (
          <div
            key={toast.id}
            className="animate-slide-in-right"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              backgroundColor: '#ffffff',
              color: '#1e293b',
              padding: '0.85rem 1.15rem',
              borderRadius: '10px',
              borderLeft: `4px solid ${borderColor}`,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              {isError ? (
                <AlertTriangle size={20} style={{ color: '#ef4444' }} />
              ) : isInfo ? (
                <Info size={20} style={{ color: '#3b82f6' }} />
              ) : (
                <CheckCircle2 size={20} style={{ color: '#10b981' }} />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <h5 style={{ fontSize: '0.825rem', fontWeight: '800', margin: '0 0 2px 0', color: '#0f172a' }}>
                {isError ? 'Action Required' : isInfo ? 'Notice' : 'Success'}
              </h5>
              <p style={{ fontSize: '0.8rem', margin: 0, color: '#475569', lineHeight: '1.4', fontWeight: '500' }}>
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ================= MODERN CONFIRMATION DIALOG MODAL ================= */
function ConfirmModal({ confirmModal, setConfirmModal }) {
  if (!confirmModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      padding: '1rem'
    }}
    onClick={() => confirmModal.onCancel?.()}
    >
      <div
        style={{
          width: '420px',
          maxWidth: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <AlertTriangle size={26} />
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
          {confirmModal.title || 'Confirm Action'}
        </h3>

        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.5rem' }}>
          {confirmModal.message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.85rem' }}
            onClick={() => confirmModal.onCancel?.()}
          >
            {confirmModal.cancelText || 'Cancel'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.85rem', backgroundColor: '#ef4444', borderColor: '#dc2626' }}
            onClick={() => confirmModal.onConfirm?.()}
          >
            {confirmModal.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
