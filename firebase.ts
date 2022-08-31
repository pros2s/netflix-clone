import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAUapoWYpmkHif4zwaqRT-0sH0IbzD-ing',
  authDomain: 'netflix-clone-fdc19.firebaseapp.com',
  projectId: 'netflix-clone-fdc19',
  storageBucket: 'netflix-clone-fdc19.appspot.com',
  messagingSenderId: '221169037821',
  appId: '1:221169037821:web:d847c91508804b771f2994',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();

export default app;
export { auth, db };
