// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// ✅ Correct Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBahpVt7SalMK6xX8vVslP77RYMDfLcVC4",
  authDomain: "expensetracker-e67e7.firebaseapp.com",
  projectId: "expensetracker-e67e7",
  storageBucket: "expensetracker-e67e7.firebasestorage.app",
  messagingSenderId: "305665027269",
  appId: "1:305665027269:web:6216d9e6edc028e22294ac"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export for app use
export { db, auth, provider, doc, setDoc, analytics };

