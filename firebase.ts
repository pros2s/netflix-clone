// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUapoWYpmkHif4zwaqRT-0sH0IbzD-ing",
  authDomain: "netflix-clone-fdc19.firebaseapp.com",
  projectId: "netflix-clone-fdc19",
  storageBucket: "netflix-clone-fdc19.appspot.com",
  messagingSenderId: "221169037821",
  appId: "1:221169037821:web:d847c91508804b771f2994"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }