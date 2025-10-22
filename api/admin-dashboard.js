// File: api/admin-dashboard.js
import admin from "firebase-admin";

// Initialize Firebase Admin SDK using environment variables
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    }),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validate admin code
  const code = req.headers["x-admin-code"];
  if (!code || code !== process.env.ADMIN_CODE) {
    return res.status(401).json({ error: "Access denied. Invalid code." });
  }

  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    const users = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        name: data.name || "N/A",
        email: data.email || "N/A",
        balance: data.balance || 0,
        referrals: data.referrals || 0,
        surveysCompleted: data.surveysCompleted || 0,
        createdAt: data.createdAt ? new Date(data.createdAt).toLocaleString() : "N/A",
        deviceIP: data.deviceIP || "N/A"
      });
    });

    // Optional: sort users by balance descending
    users.sort((a, b) => b.balance - a.balance);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}