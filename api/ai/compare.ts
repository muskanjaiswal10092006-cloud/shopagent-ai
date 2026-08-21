import { processProductComparison } from '../../server/services/geminiService';

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
    const { productIds, userQuestion } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'productIds array is required' });
    }

    const result = await processProductComparison(productIds, userQuestion);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Vercel API AI comparison error:', error);
    return res.status(500).json({
      error: 'Failed to process product comparison',
      details: error.message,
    });
  }
}
