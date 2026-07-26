import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

async function checkDocs() {
  const keys = ['aeon_settings', 'aeon_layout', 'aeon_products'];
  for (const key of keys) {
    try {
      const docRef = doc(db, 'healthcare_store', key);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        console.log(`\n================ DOCUMENT: ${key} ================`);
        console.log("UpdatedAt:", snap.data().updatedAt);
        console.log("Data:", JSON.stringify(snap.data().data, null, 2));
      } else {
        console.log(`\n================ DOCUMENT: ${key} DOES NOT EXIST IN FIRESTORE ================`);
      }
    } catch (err) {
      console.error(`Error fetching ${key}:`, err.message || err);
    }
  }
  process.exit(0);
}

checkDocs();
