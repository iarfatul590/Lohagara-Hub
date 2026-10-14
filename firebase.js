/**
 * firebase.js — Lohagara Hub
 * Central Firebase initializer.
 * Exports: firebaseApp, db, storage, auth, googleProvider, analyticsReady
 * Also exposes everything on `window.*` so non-module scripts (admin.html,
 * Setting.html, index.html) can reach them without a separate import.
 *
 * Firebase SDK version: 10.12.2
 */

import { getApp, getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAnalytics, isSupported } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js';
import { getFirestore, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// ─── Firebase Project Config ──────────────────────────────────────────────────
export const firebaseConfig = {
  apiKey: "AIzaSyCdj368WSGGn7C9-EB5FsnL25e1_6z1AYs",
  authDomain: "lohagara-hub.firebaseapp.com",
  projectId: "lohagara-hub",
  storageBucket: "lohagara-hub.firebasestorage.app",
  messagingSenderId: "640245437491",
  appId: "1:640245437491:web:3695b41e7cb1097ae4bf46",
  measurementId: "G-9ZR6PRY5Q4"
};

// ─── App (singleton-safe) ─────────────────────────────────────────────────────
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ─── Firestore ────────────────────────────────────────────────────────────────
export const db = getFirestore(firebaseApp);

// Enable offline persistence so the app keeps working without network
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open – persistence only works in one at a time.
    console.info('[Firestore] Offline persistence disabled: multiple tabs open.');
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support IndexedDB.
    console.info('[Firestore] Offline persistence not supported in this browser.');
  }
});

// ─── Firebase Storage ─────────────────────────────────────────────────────────
export const storage = getStorage(firebaseApp);

// ─── Firebase Auth ────────────────────────────────────────────────────────────
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

// ─── Analytics (optional – fails gracefully in non-supported environments) ────
export const analyticsReady = isSupported()
  .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
  .catch((error) => {
    console.warn('[Firebase] Analytics unavailable in this browser.', error);
    return null;
  });

// ─── Connection-state helper ──────────────────────────────────────────────────
// Exposes a simple boolean so other scripts know Firebase loaded successfully.
let _firebaseReady = false;

const _markReady = () => {
  if (_firebaseReady) return;
  _firebaseReady = true;

  // Expose everything on window so non-module inline scripts can reach them.
  window.firebaseApp   = firebaseApp;
  window.firebaseDb    = db;
  window.firebaseStorage = storage;
  window.firebaseConfig  = firebaseConfig;
  window.firebaseAuth    = auth;
  window.googleProvider  = googleProvider;
  window.firebaseAnalyticsReady = analyticsReady;

  // Auth helpers (used by admin.html and Setting.html)
  window.firebaseSignInWithPopup   = signInWithPopup;
  window.firebaseSignOut           = signOut;
  window.firebaseOnAuthStateChanged = onAuthStateChanged;

  // Firestore helpers used by admin.html live-dashboard listener
  // (imported lazily here so admin.html doesn't need its own import)
  import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
    .then(({ doc, collection, query, where, orderBy, limit,
             onSnapshot, getDocs, getDoc,
             setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp }) => {
      window.firebaseFirestoreDoc          = doc;
      window.firebaseFirestoreCollection   = collection;
      window.firebaseFirestoreQuery        = query;
      window.firebaseFirestoreWhere        = where;
      window.firebaseFirestoreOrderBy      = orderBy;
      window.firebaseFirestoreLimit        = limit;
      window.firebaseFirestoreOnSnapshot   = onSnapshot;
      window.firebaseFirestoreGetDocs      = getDocs;
      window.firebaseFirestoreGetDoc       = getDoc;
      window.firebaseFirestoreSetDoc       = setDoc;
      window.firebaseFirestoreAddDoc       = addDoc;
      window.firebaseFirestoreUpdateDoc    = updateDoc;
      window.firebaseFirestoreDeleteDoc    = deleteDoc;
      window.firebaseFirestoreServerTimestamp = serverTimestamp;
    })
    .catch((err) => console.warn('[Firestore] Helper import failed.', err));

  // Signal to other scripts (admin.html listens for this)
  window.hasRealFirebaseConfig = true;
  window.dispatchEvent(new CustomEvent('lohagara-firebase-ready', {
    detail: { app: firebaseApp, db, storage, auth }
  }));
};

// Mark ready as soon as this module executes (no async gate needed)
_markReady();

// ─── Auth state change — broadcast login/logout events globally ───────────────
onAuthStateChanged(auth, (user) => {
  window.dispatchEvent(
    new CustomEvent('lohagara-auth-changed', {
      detail: { user: user ?? null, uid: user?.uid ?? null, email: user?.email ?? null }
    })
  );
});

// ─── Network status helpers ───────────────────────────────────────────────────
// Updates a global flag so UI can show offline warnings
const _updateOnlineStatus = () => {
  window.lohagaraIsOnline = navigator.onLine;
  document.documentElement.dataset.offline = String(!navigator.onLine);
};

window.addEventListener('online', _updateOnlineStatus);
window.addEventListener('offline', _updateOnlineStatus);
_updateOnlineStatus();