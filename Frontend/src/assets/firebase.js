import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVs33lt7MtakPJDiVz_Bvo9Xp76r2Qx3o",
  authDomain: "voltcare-5c862.firebaseapp.com",
  projectId: "voltcare-5c862",
  storageBucket: "voltcare-5c862.appspot.com",
  messagingSenderId: "723616237038",
  appId: "1:723616237038:web:1465716a0387d36508baff",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
