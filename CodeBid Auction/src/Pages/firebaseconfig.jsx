import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFqIWKeUvIze3J2dX_1829FpRTh93gML8",
  authDomain: "codebid-auction.firebaseapp.com",
  projectId: "codebid-auction",
  storageBucket: "codebid-auction.firebasestorage.app",
  messagingSenderId: "624787500691",
  appId: "1:624787500691:web:233a818dbcb88a54bfa766",
  measurementId: "G-VNVP41STY4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export {auth, db}