// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ceni-booking.firebaseapp.com",
  projectId: "ceni-booking",
  storageBucket: "ceni-booking.appspot.com",
  messagingSenderId: "364134523246",
  appId: "1:364134523246:web:c6668aa31af1c9d52ae17f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);