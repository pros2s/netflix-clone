import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAUapoWYpmkHif4zwaqRT-0sH0IbzD-ing',
  authDomain: 'netflix-clone-fdc19.firebaseapp.com',
  projectId: 'netflix-clone-fdc19',
  storageBucket: 'netflix-clone-fdc19.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();

export default app;
export { auth, db };
