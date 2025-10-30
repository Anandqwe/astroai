const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Gemini client
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

let genAI = null;
if (!geminiApiKey) {
  console.warn('GEMINI_API_KEY missing — /api/ai/chat will return 501 until set');
} else {
  genAI = new GoogleGenerativeAI(geminiApiKey);
}

// POST /api/ai/chat -> { message } => { response }
router.post('/chat', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(501).json({ error: 'Gemini is not configured (GEMINI_API_KEY missing)' });
    }

    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const model = genAI.getGenerativeModel({
      model: geminiModel,
      systemInstruction: 'You are an AI space expert assistant. Answer clearly and concisely.',
    });

    const result = await model.generateContent(message);
    const text = result?.response?.text?.() || '';

    if (!text) {
      return res.status(502).json({ error: 'Empty response from Gemini' });
    }

    return res.json({ response: text });
  } catch (err) {
    console.error('Gemini chat error:', err?.response?.data || err?.message || err);
    return res.status(500).json({ error: 'Failed to get AI response', details: err?.message });
  }
});

module.exports = router;
 
// Optional: GET wrapper for quick browser testing
// Usage: GET /api/ai/chat?message=Hello
router.get('/chat', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(501).json({ error: 'Gemini is not configured (GEMINI_API_KEY missing)' });
    }

    const message = req.query.message;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Query param "message" is required' });
    }

    const model = genAI.getGenerativeModel({
      model: geminiModel,
      systemInstruction: 'You are an AI space expert assistant. Answer clearly and concisely.',
    });

    const result = await model.generateContent(String(message));
    const text = result?.response?.text?.() || '';
    if (!text) return res.status(502).json({ error: 'Empty response from Gemini' });
    return res.json({ response: text });
  } catch (err) {
    console.error('Gemini chat (GET) error:', err?.response?.data || err?.message || err);
    return res.status(500).json({ error: 'Failed to get AI response', details: err?.message });
  }
});
