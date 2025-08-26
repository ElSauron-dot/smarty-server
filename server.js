import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// CORS aç
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Örnek API endpoint
app.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "query is required" });

  try {
    // Burada gerçek API çağırabilirsin, şimdilik dummy sonuç
    const results = [
      { title: "Minecraft", url: "https://www.minecraft.net", desc: "Minecraft official site" },
      { title: "OpenAI", url: "https://openai.com", desc: "Artificial Intelligence research" }
    ];

    res.json({ query: q, results });
  } catch (err) {
    res.status(500).json({ error: "API failed", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

