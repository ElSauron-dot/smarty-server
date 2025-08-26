import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import * as cheerio from "cheerio";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Anasayfa (lokalde test için çalışır, Render frontend ayrı olacak)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Arama endpoint'i
app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ results: [] });

  try {
    const response = await fetch(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const body = await response.text();
    const $ = cheerio.load(body);

    let results = [];
    $(".result").each((i, el) => {
      const title = $(el).find(".result__title a").text().trim();
      let href = $(el).find(".result__title a").attr("href");
      const description = $(el).find(".result__snippet").text().trim();

      // DuckDuckGo yönlendirme linklerini temizle
      if (href && (href.startsWith("/l/?uddg=") || href.includes("duckduckgo.com/l/?uddg="))) {
        try {
          const urlObj = new URL(href, "https://duckduckgo.com");
          const realUrl = urlObj.searchParams.get("uddg");
          if (realUrl) href = decodeURIComponent(realUrl);
        } catch (e) {
          console.error("Link decode hatası:", e);
        }
      }

      if (title && href) {
        results.push({ title, href, description });
      }
    });

    res.json({ results });
  } catch (err) {
    console.error("DuckDuckGo parse hatası:", err);
    res.json({ results: [] });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ SmartyInt çalışıyor: http://localhost:${PORT}`);
});
