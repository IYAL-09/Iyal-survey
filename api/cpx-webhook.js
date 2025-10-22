// File: api/cpx-webhook.js
import admin from "firebase-admin";
import crypto from "crypto";

// Initialize Firebase Admin SDK
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

// Helper: verify HMAC signature from CPX
function verifySignature(req) {
  const signature = req.headers["x-cpx-signature"];
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", process.env.CPX_WEBHOOK_SECRET);
  const body = JSON.stringify(req.body);
  const digest = hmac.update(body).digest("hex");

  return digest === signature;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!verifySignature(req)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = req.body;

  try {
    const { user_id, reward = 0 } = event;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    const userRef = db.collection("users").doc(user_id);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update balance and surveys completed
    const currentBalance = userSnap.data().balance || 0;
    const surveysCompleted = userSnap.data().surveysCompleted || 0;

    await userRef.update({
      balance: currentBalance + reward,
      surveysCompleted: surveysCompleted + 1
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
}