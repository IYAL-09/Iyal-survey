export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    // Get admin email from Vercel environment variables
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    if (email !== adminEmail) {
      return res.status(401).json({ error: "Access denied." });
    }

    // Email matches the admin email
    return res.status(200).json({ success: true, message: "Email verified." });

  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
