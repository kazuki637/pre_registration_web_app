import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADK2EtPA3XYK68MfDrfdn5eYams9ibJt0",
  authDomain: "kurukatsu-app.firebaseapp.com",
  projectId: "kurukatsu-app",
  storageBucket: "kurukatsu-app.appspot.com",
  messagingSenderId: "702781399082",
  appId: "1:702781399082:web:a4e848d6046690adad2353",
  measurementId: "G-KB0YTDPEBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
