import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3000;
const AI_API_KEY = process.env.AI_API_KEY;
const AI_BASE_URL = (process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
const AI_MODEL = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

app.get('/', (_req, res) => res.json({ status: 'ok', service: 'Maruti AI backend', aiConfigured: Boolean(AI_API_KEY) }));

app.post('/chat', async (req, res) => {
  if (!AI_API_KEY) return res.status(503).json({ error: 'Backend AI key is not configured.' });
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  if (!messages.length) return res.status(400).json({ error: 'messages array is required.' });
  const cleanMessages = messages.slice(-20).map(m => ({
    role: ['user', 'assistant'].includes(m?.role) ? m.role : 'user',
    content: String(m?.content ?? '').slice(0, 8000)
  }));
  try {
    const upstream = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${AI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: AI_MODEL,
        temperature: 0.7,
        max_tokens: 800,
        messages: [
          { role: 'system', content: 'You are Maruti, a friendly, respectful, cute childlike Hindi-first AI companion inspired by Bal Hanuman. Reply naturally and concisely. Match the user language (Hindi, Gujarati, English, or other languages). Be honest when uncertain. You may tell stories or create original poems and songs when asked, but do not claim to sing audio unless audio generation is actually available.' },
          ...cleanMessages
        ]
      })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return res.status(502).json({ error: data?.error?.message || `AI provider returned ${upstream.status}` });
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) return res.status(502).json({ error: 'AI response was empty.' });
    res.json({ reply });
  } catch (err) {
    res.status(502).json({ error: 'AI service connection failed.', detail: String(err?.message || err) });
  }
});

app.listen(PORT, () => console.log(`Maruti backend listening on ${PORT}`));
