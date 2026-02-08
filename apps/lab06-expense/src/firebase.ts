import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQCFttSToNhh7N1zdtOVEUjo2cvBMKhQI",
  authDomain: "lab06-a3a89.firebaseapp.com",
  projectId: "lab06-a3a89"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
