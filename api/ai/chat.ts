import { processAIChat } from '../../server/services/geminiService';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { message, history, currentIntent } = body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required' });
    }

    const response = await processAIChat({
      message,
      history: Array.isArray(history) ? history : [],
      currentIntent,
    });

    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Vercel API AI chat error:', error);
    return res.status(500).json({
      error: 'Failed to process AI chat request',
      details: error.message,
    });
  }
}
