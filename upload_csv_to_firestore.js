import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

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

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function parseCSV(content) {
  const rows = [];
  let currentRow = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      currentRow += char;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentRow.trim()) {
        rows.push(currentRow);
      }
      currentRow = '';
      if (char === '\r' && content[i + 1] === '\n') i++;
    } else {
      currentRow += char;
    }
  }
  if (currentRow.trim()) rows.push(currentRow);

  if (rows.length === 0) return [];
  const headers = parseCSVLine(rows[0]);
  const dataRows = [];

  for (let i = 1; i < rows.length; i++) {
    const values = parseCSVLine(rows[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || '';
    });
    dataRows.push(obj);
  }
  return dataRows;
}

async function uploadCatalog() {
  try {
    const csvPath = path.join(process.cwd(), 'extracted_csv', 'products_export_1.csv');
    const content = fs.readFileSync(csvPath, 'utf8');
    const rawRows = parseCSV(content);
    console.log(`Parsed ${rawRows.length} raw CSV rows.`);

    const productsMap = new Map();
    rawRows.forEach((row, index) => {
      const handle = row['Handle'] || `prod_${index}`;
      const title = row['Title'] || '';
      const body = row['Body (HTML)'] || '';
      const category = row['Product Category'] || row['Type'] || 'Home Care';
      const vendor = row['Vendor'] || 'AeonCare';
      const priceStr = row['Variant Price'] || '0';
      const comparePriceStr = row['Variant Compare At Price'] || '0';
      const sku = row['Variant SKU'] || '';
      const barcode = row['Variant Barcode'] || '';
      const img = row['Image Src'] || '';
      const stockStr = row['Variant Inventory Qty'] || '10';

      const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 999;
      const comparePrice = parseFloat(comparePriceStr.replace(/[^0-9.]/g, '')) || Math.round(price * 1.3);
      const stock = parseInt(stockStr.replace(/[^0-9]/g, ''), 10) || 10;

      const cleanDesc = body.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim().substring(0, 120);

      if (!productsMap.has(handle)) {
        if (title.trim()) {
          productsMap.set(handle, {
            id: `p_csv_${handle}`,
            handle,
            title: title.trim(),
            description: cleanDesc || title.trim(),
            category: category.trim() || 'Home Care',
            brand: vendor.trim() || 'AeonCare',
            price,
            mrp: comparePrice > price ? comparePrice : Math.round(price * 1.35),
            image: img || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
            sku,
            barcode,
            stock,
            isRentable: price > 5000,
            rentRates: price > 5000 ? { daily: Math.round(price * 0.01), weekly: Math.round(price * 0.05), monthly: Math.round(price * 0.15) } : { daily: 0, weekly: 0, monthly: 0 },
            securityDeposit: price > 5000 ? Math.round(price * 0.2) : 0
          });
        }
      } else {
        const existing = productsMap.get(handle);
        if (!existing.image && img) {
          existing.image = img;
        }
      }
    });

    const parsedProducts = Array.from(productsMap.values());
    const payloadStr = JSON.stringify(parsedProducts);
    console.log(`Parsed ${parsedProducts.length} unique products from CSV. Payload size: ${Math.round(payloadStr.length / 1024)} KB.`);

    if (parsedProducts.length > 0) {
      const docRef = doc(db, 'healthcare_store', 'aeon_products');
      await setDoc(docRef, { data: parsedProducts, updatedAt: new Date().toISOString() });
      console.log(`SUCCESS! Uploaded ${parsedProducts.length} products to Cloud Firestore aeon_products document.`);
    }
  } catch (err) {
    console.error('Error uploading catalog:', err);
  }
  process.exit(0);
}

uploadCatalog();
