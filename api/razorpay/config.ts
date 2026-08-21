import { getRazorpayConfig } from '../../server/services/razorpayService';

export default async function handler(req: any, res: any) {
  // CORS Headers
  if (res && typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  }

  if (req && req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      return res.status(200).end();
    }
    return new Response(null, { status: 200 });
  }

  if (req && req.method && req.method !== 'GET') {
    if (res && typeof res.status === 'function') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const config = getRazorpayConfig();
    if (res && typeof res.status === 'function') {
      return res.status(200).json(config);
    }
    return new Response(JSON.stringify(config), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    const errPayload = {
      isConfigured: false,
      keyId: null,
      mode: 'unconfigured',
      error: error.message || 'Failed to retrieve Razorpay configuration',
    };
    if (res && typeof res.status === 'function') {
      return res.status(200).json(errPayload);
    }
    return new Response(JSON.stringify(errPayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
