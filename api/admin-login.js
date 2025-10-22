import { initializeApp as initFirebaseApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Firebase client config
const firebaseConfig = {
  apiKey: "AIzaSyAyUuew-e4wlIdUDx7olNKx68sjD1UXY9U",
  authDomain: "iyal-survey.firebaseapp.com",
  projectId: "iyal-survey",
  storageBucket: "iyal-survey.appspot.com",
  messagingSenderId: "356060656195",
  appId: "1:356060656195:web:d0357a25774de984371af6",
  measurementId: "G-28XENM0B78"
};

// Initialize Firebase app
const app = initFirebaseApp(firebaseConfig);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // read from Vercel environment variable

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  if (email !== ADMIN_EMAIL) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  try {
    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, email, password);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
      }
