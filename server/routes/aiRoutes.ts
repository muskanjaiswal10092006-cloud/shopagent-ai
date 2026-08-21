import express from 'express';
import { processAIChat, processProductComparison } from '../services/geminiService';

const router = express.Router();

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, history, currentIntent } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required' });
    }

    const response = await processAIChat({
      message,
      history: Array.isArray(history) ? history : [],
      currentIntent,
    });

    return res.json(response);
  } catch (error: any) {
    console.error('AI chat route error:', error);
    return res.status(500).json({
      error: 'Failed to process AI chat request',
      details: error.message,
    });
  }
});

// POST /api/ai/compare
router.post('/compare', async (req, res) => {
  try {
    const { productIds, userQuestion } = req.body;
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'productIds array is required' });
    }

    const result = await processProductComparison(productIds, userQuestion);
    return res.json(result);
  } catch (error: any) {
    console.error('AI comparison route error:', error);
    return res.status(500).json({
      error: 'Failed to process product comparison',
      details: error.message,
    });
  }
});

export default router;
