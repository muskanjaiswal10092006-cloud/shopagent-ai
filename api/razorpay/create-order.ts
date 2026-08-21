import { createRazorpayOrder } from '../../server/services/razorpayService';

export default async function handler(req: any, res: any) {
  if (res && typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req && req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      return res.status(200).end();
    }
    return new Response(null, { status: 200 });
  }

  if (req && req.method && req.method !== 'POST') {
    if (res && typeof res.status === 'function') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    } else if (!body && typeof req.json === 'function') {
      body = await req.json().catch(() => ({}));
    }
    body = body || {};

    const { amount, receipt, notes } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      const err = { success: false, error: 'Valid positive amount in INR is required' };
      if (res && typeof res.status === 'function') {
        return res.status(400).json(err);
      }
      return new Response(JSON.stringify(err), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const order = await createRazorpayOrder({
      amount,
      receipt,
      notes,
    });

    if (res && typeof res.status === 'function') {
      return res.status(200).json(order);
    }
    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    console.error('Vercel API create-order error:', error.message);
    const errPayload = {
      success: false,
      error: error.message || 'Failed to create Razorpay order',
    };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(errPayload);
    }
    return new Response(JSON.stringify(errPayload), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
