export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    // Get admin email from Vercel environment variables
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    if (email !== adminEmail) {
      return res.status(401).json({ error: "Access denied." });
    }

    // If needed, you can also validate password here
    // For now, we just allow any password if email matches

    return res.status(200).json({ success: true, message: "Admin login successful!" });

  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
                                 }
