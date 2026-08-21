import { getRazorpayConfig } from '../server/services/razorpayService';

export default function handler(req: any, res: any) {
  if (res && typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req && req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      return res.status(200).end();
    }
    return new Response(null, { status: 200 });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const razorpayConfig = getRazorpayConfig();

  const payload = {
    status: 'ok',
    app: 'ShopAgent AI',
    platform: 'Vercel Serverless',
    time: new Date().toISOString(),
    geminiConfigured: Boolean(geminiKey && geminiKey !== 'MY_GEMINI_API_KEY' && geminiKey !== 'your_gemini_api_key'),
    razorpayConfigured: razorpayConfig.isConfigured,
    razorpayMode: razorpayConfig.mode,
  };

  if (res && typeof res.status === 'function') {
    return res.status(200).json(payload);
  }
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
