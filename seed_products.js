import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCDBRZKkcrlvHp5Hkf9zautKWVc_pZuG-U",
  authDomain: "healthcareecommerce.firebaseapp.com",
  projectId: "healthcareecommerce",
  storageBucket: "healthcareecommerce.firebasestorage.app",
  messagingSenderId: "75076647381",
  appId: "1:75076647381:web:ba870772ef37678eaae55c",
  measurementId: "G-WK0N92BLVT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const initialProducts = [
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
  }
];

async function seed() {
  console.log("Seeding products to healthcare_products Firestore collection...");
  for (const p of initialProducts) {
    await setDoc(doc(db, 'healthcare_products', p.id), p);
    console.log(`Successfully seeded product document: healthcare_products/${p.id}`);
  }
  console.log("Seeding finished successfully!");
  process.exit(0);
}

seed();
