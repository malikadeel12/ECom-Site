import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

export const ADMIN_UID = "FGYeTdfMWIR9xRFpwNonrfMYSzo2";

let app = null;
let _db = null;
let _storage = null;
let _auth = null;
let _analytics = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  _db = getFirestore(app);
  _storage = getStorage(app);
  _auth = getAuth(app);
  if (typeof window !== "undefined") {
    isSupported().then((yes) => {
      if (yes) _analytics = getAnalytics(app);
    });
  }
}

export const db = _db;
export const storage = _storage;
export const auth = _auth;
export const analytics = _analytics;
export default app;
