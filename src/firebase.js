import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnlOsLSQQ556pExqVPOcfR0fMWXhUwJTk",
  authDomain: "clone-31b80.firebaseapp.com",
  projectId: "clone-31b80",
  storageBucket: "clone-31b80.firebasestorage.app",
  messagingSenderId: "502396285110",
  appId: "1:502396285110:web:611d6eeb16fa1ba82d7617",
  measurementId: "G-JNT10Z5PHE"
};

// Initialize the Firebase App instance
const firebaseApp = initializeApp(firebaseConfig);

// Connect to the modern database and auth services
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Export them so your components can use them
export { db, auth };