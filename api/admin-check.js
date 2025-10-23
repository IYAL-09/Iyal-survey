// /api/admin-check.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;

  // Get code from Vercel environment variable
  const ADMIN_CODE = process.env.ADMIN_CODE;

  if (!ADMIN_CODE) {
    return res.status(500).json({ success: false, error: "Server not configured" });
  }

  if (code === ADMIN_CODE) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Invalid admin code" });
  }
}
