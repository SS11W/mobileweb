// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcEipR75cvzZ2SFzRdWKTQJ8NRkfryFcA",
  authDomain: "rundom-b96d2.firebaseapp.com",
  projectId: "rundom-b96d2",
  storageBucket: "rundom-b96d2.firebasestorage.app",
  messagingSenderId: "583554283961",
  appId: "1:583554283961:web:4fa96a32c9bfe98a839e68",
  measurementId: "G-98FGMYBHFX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);