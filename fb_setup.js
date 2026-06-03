// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRFEEaBxknFnx2RI4Tl5eKz0_9HUdQAZg",
  authDomain: "athul-12database-project.firebaseapp.com",
  projectId: "athul-12database-project",
  storageBucket: "athul-12database-project.firebasestorage.app",
  messagingSenderId: "378430784037",
  appId: "1:378430784037:web:07d0633890fb04411c35cc",
  measurementId: "G-3SSMLK5SC7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);