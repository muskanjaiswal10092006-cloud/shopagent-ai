import { verifyRazorpaySignature } from '../../server/services/razorpayService';

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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const verification = verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (verification.isValid) {
      const payload = {
        success: true,
        verified: true,
        message: verification.message,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      };
      if (res && typeof res.status === 'function') {
        return res.status(200).json(payload);
      }
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      const payload = {
        success: false,
        verified: false,
        message: verification.message,
      };
      if (res && typeof res.status === 'function') {
        return res.status(400).json(payload);
      }
      return new Response(JSON.stringify(payload), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  } catch (error: any) {
    console.error('Vercel API signature verification error:', error);
    const errPayload = {
      success: false,
      error: 'Payment verification failed',
      details: error.message,
    };
    if (res && typeof res.status === 'function') {
      return res.status(500).json(errPayload);
    }
    return new Response(JSON.stringify(errPayload), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
