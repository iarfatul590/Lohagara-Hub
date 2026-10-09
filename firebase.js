import { getApp, getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAnalytics, isSupported } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export const firebaseConfig = {
  apiKey: "AIzaSyCdj368WSGGn7C9-EB5FsnL25e1_6z1AYs",
  authDomain: "lohagara-hub.firebaseapp.com",
  projectId: "lohagara-hub",
  storageBucket: "lohagara-hub.firebasestorage.app",
  messagingSenderId: "640245437491",
  appId: "1:640245437491:web:3695b41e7cb1097ae4bf46",
  measurementId: "G-9ZR6PRY5Q4"
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

window.firebaseApp = firebaseApp;
window.firebaseDb = db;
window.firebaseConfig = firebaseConfig;

export const analyticsReady = isSupported()
  .then((supported) => supported ? getAnalytics(firebaseApp) : null)
  .catch((error) => {
    console.warn('Firebase Analytics is unavailable in this browser.', error);
    return null;
  });

window.firebaseAnalyticsReady = analyticsReady;