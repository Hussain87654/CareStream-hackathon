import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDl-QFF9GgIPLUIEWNRF4TU0VbFFBi-KhU",
  authDomain: "hackathon-8dc25.firebaseapp.com",
  projectId: "hackathon-8dc25",
  storageBucket: "hackathon-8dc25.firebasestorage.app",
  messagingSenderId: "238845263979",
  appId: "1:238845263979:web:bd41aae7a438b6fe9db12e",
  measurementId: "G-01CKSWN8CL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);