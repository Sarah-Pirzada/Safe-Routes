import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBJxwrsc-nBOtOzLcTPWr8t6yNFdfFW30",
  authDomain: "saferoutesdb.firebaseapp.com",
  projectId: "saferoutesdb",
  storageBucket: "saferoutesdb.appspot.com",
  messagingSenderId: "467090184600",
  appId: "1:467090184600:web:39dcc28064c390220fb3ed",
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
