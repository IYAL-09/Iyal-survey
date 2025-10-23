// api/admin-check.js

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code } = req.body;

    // Fetch admin code from Vercel environment variable
    const ADMIN_CODE = process.env.ADMIN_CODE;

    if (!ADMIN_CODE) {
      return res.status(500).json({ success: false, error: "Server misconfigured." });
    }

    if (code === ADMIN_CODE) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, error: "Access denied." });
    }
  } catch (err) {
    console.error("Admin check error:", err);
    return res.status(500).json({ success: false, error: "Server error." });
  }
}
