// src/firebase/firebaseConfig.jsx
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Load Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// initializeFirestore (instead of getFirestore) lets us pass
// ignoreUndefinedProperties: true — Firestore normally throws
// "Unsupported field value: undefined" if ANY field anywhere in a document
// (including nested inside arrays of objects, e.g. resume experience/
// project entries) is undefined instead of a real value, null, or simply
// omitted. With this setting, Firestore silently skips undefined fields
// instead of crashing the write — this fixes it app-wide, not just for
// one save call, since it's an easy mistake to make anywhere state is
// built up from multiple optional/merged sources.
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

export const storage = getStorage(app);