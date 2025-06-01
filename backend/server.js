const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = [{ email: "admin@firma.com", password: "123456", name: "Admin" }];
let deadlines = [
  { id: 1, title: "KAP Bildirimi", date: "2025-06-15" },
  { id: 2, title: "Genel Kurul", date: "2025-06-30" }
];
let regulations = [
  { title: "SPK Tebliği", content: "Sermaye Piyasası Kurulu'nun 2023/12 sayılı tebliği..." },
  { title: "BIST Kuralları", content: "Borsa İstanbul kotasyon kuralları..." }
];

// Giriş
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Giriş başarısız" });
  res.json({ user: { email: user.email, name: user.name } });
});

// Son tarihler
app.get("/api/deadlines", (req, res) => res.json(deadlines));
app.post("/api/deadlines", (req, res) => {
  const { title, date } = req.body;
  const id = deadlines.length ? deadlines[deadlines.length - 1].id + 1 : 1;
  deadlines.push({ id, title, date });
  res.json(deadlines);
});
app.delete("/api/deadlines/:id", (req, res) => {
  deadlines = deadlines.filter(d => d.id !== Number(req.params.id));
  res.json(deadlines);
});

// Mevzuat arama
app.get("/api/regulations", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const filtered = regulations.filter(r =>
    r.title.toLowerCase().includes(q) || r.content.toLowerCase().includes(q)
  );
  res.json(filtered);
});

// Abacus.AI gerçek entegrasyonu
app.post("/api/abacus", async (req, res) => {
  const { message } = req.body;
  try {
    // Abacus.AI Prediction API endpoint
    const url = "https://api.abacus.ai/v1/deployment/getChatResponse";
    const token = "a64b6d1dd31d451d886dbf2cc0a38b22";
    const deployment_id = "bc04bdc02";

    const payload = {
      deployment_token: token,
      deployment_id: deployment_id,
      messages: [{ is_user: true, text: message }],
      temperature: 0.0
    };

    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" }
    });

    // Abacus.AI response format
    const aiText = response.data?.result?.response || "Yanıt alınamadı.";
    // Eğer modeliniz deadline objesi döndürüyorsa, buraya ekleyin:
    const deadline = response.data?.result?.deadline || null;

    res.json({ response: aiText, deadline });
  } catch (err) {
    console.error("AI API error:", err?.response?.data || err.message);
    res.json({ response: "AI service bağlantı kurulamadı.", deadline: null });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API ${PORT} portunda çalışıyor.`));