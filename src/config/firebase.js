import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// =====================================================
// IRONEASE FIREBASE CONFIGURATION
// =====================================================

const firebaseConfig = {
  // 👇 EXACT values Firebase Console se paste karo
  apiKey: "AIzaSyA92GTlLKO4Ap2HpXOXvrkl1OMr3ly8bL0",
  authDomain: "ironease-c0c3e.firebaseapp.com",
  projectId: "ironease-c0c3e",
  storageBucket: "ironease-c0c3e.firebasestorage.app",
  messagingSenderId: "932226560115",
  appId: "1:932226560115:web:b67bdeb04d5075f9363a06",
  measurementId: "G-6N0ELC0YFZ",
};

// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

// =====================================================
// AUTHENTICATION
// =====================================================

const auth = getAuth(app);

// =====================================================
// FIRESTORE
// =====================================================

const db = getFirestore(app);

// =====================================================
// ANALYTICS
// =====================================================

let analytics = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((error) => {
      console.warn("Firebase Analytics unavailable:", error);
    });
}

// =====================================================
// EXPORT
// =====================================================

export {
  app,
  auth,
  db,
  analytics,
};