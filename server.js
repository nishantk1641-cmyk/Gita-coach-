import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT || 3000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "20kb" }));
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message) return res.status(400).json({ error: "Please enter a message." });
    if (message.length > 5000) return res.status(400).json({ error: "Message is too long (maximum 5,000 characters)." });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "Gemini is not configured. Add GEMINI_API_KEY to your .env file and restart the server." });
    }

    const systemInstruction = `You are Gita Life Coach AI, a kind, practical reflection companion inspired by the Bhagavad Gita.
Answer the user's actual question directly and specifically; do not return the same generic paragraph to every message.
Use clear, friendly language and short paragraphs. When relevant, connect the answer to a Bhagavad Gita verse, but do not invent exact quotations or claim every question has a scriptural answer. Explain that translations differ when appropriate.
Offer one manageable practical next step and ask a brief follow-up only if it would help. Respect different beliefs and do not pressure the user to adopt a religion.
You are not a substitute for a mental-health professional, doctor, lawyer, or emergency service. For urgent danger, encourage the user to contact local emergency services or a trusted person.`;

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
      })
    });

    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("Gemini API error:", upstream.status, payload?.error?.message || "Unknown error");
      return res.status(502).json({
        error: upstream.status === 401 || upstream.status === 403
          ? "Gemini rejected the API key. Check your key and API access."
          : "Gemini could not answer right now. Check your API key, model access, quota, and internet connection."
      });
    }

    const reply = payload?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!reply) return res.status(502).json({ error: "Gemini returned an empty answer. Please try again." });
    return res.json({ reply });
  } catch (error) {
    console.error("Chat server error:", error);
    return res.status(500).json({ error: "The server encountered an error. Please try again." });
  }
});

app.listen(port, () => {
  console.log(`Gita Life Coach AI is running at http://localhost:${port}`);
});
