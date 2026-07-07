import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // fast + free
    });

    const result = await model.generateContent(message);
    const response = result.response.text();

    res.json({ reply: response });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;