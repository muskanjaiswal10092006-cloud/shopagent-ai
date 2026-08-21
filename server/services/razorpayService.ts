import crypto from 'crypto';
import dotenv from 'dotenv';

// Ensure .env is loaded if present in development or custom environments
dotenv.config();

export interface RazorpayConfigStatus {
  isConfigured: boolean;
  keyId: string | null;
  mode: 'test' | 'live' | 'invalid' | 'unconfigured';
  message?: string;
  diagnostics?: {
    hasKeyId: boolean;
    hasKeySecret: boolean;
    keyIdPrefix: string | null;
    isTestMode: boolean;
    secretSet: boolean;
  };
}

function sanitizeKey(val?: string | null): string | null {
  if (!val) return null;
  let clean = String(val).trim();
  // Strip outer quotes if accidentally entered in environment variables UI (e.g. "rzp_test_..." or 'rzp_test_...')
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1).trim();
  }
  // Strip escaped quotes like \"...\"
  if (clean.startsWith('\\"') && clean.endsWith('\\"')) {
    clean = clean.slice(2, -2).trim();
  }
  return clean.length > 0 ? clean : null;
}

export function getRazorpayKeys() {
  const keyId = sanitizeKey(
    process.env.RAZORPAY_KEY_ID ||
    process.env.VITE_RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.REACT_APP_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_TEST_KEY_ID ||
    process.env.RAZORPAY_KEY
  );

  const keySecret = sanitizeKey(
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_SECRET ||
    process.env.RAZORPAY_TEST_KEY_SECRET ||
    process.env.RAZORPAY_TEST_SECRET ||
    process.env.RAZORPAY_API_SECRET
  );

  return { keyId, keySecret };
}

export function getRazorpayConfig(): RazorpayConfigStatus {
  const { keyId, keySecret } = getRazorpayKeys();

  const isPlaceholderKey =
    !keyId ||
    keyId === 'MY_RAZORPAY_KEY_ID' ||
    keyId === 'your_razorpay_test_key_id' ||
    keyId === 'rzp_test_placeholder';

  const isPlaceholderSecret =
    !keySecret ||
    keySecret === 'MY_RAZORPAY_KEY_SECRET' ||
    keySecret === 'your_razorpay_test_key_secret' ||
    keySecret === 'your_secret_here';

  const hasKeyId = Boolean(keyId && !isPlaceholderKey);
  const hasKeySecret = Boolean(keySecret && !isPlaceholderSecret);

  if (!hasKeyId || !hasKeySecret) {
    const missing = [];
    if (!hasKeyId) missing.push('RAZORPAY_KEY_ID');
    if (!hasKeySecret) missing.push('RAZORPAY_KEY_SECRET');

    return {
      isConfigured: false,
      keyId: null,
      mode: 'unconfigured',
      message: `Razorpay credentials missing in environment variables: ${missing.join(' and ')}. Please configure them in Vercel Settings > Environment Variables.`,
      diagnostics: {
        hasKeyId,
        hasKeySecret,
        keyIdPrefix: hasKeyId && keyId ? keyId.substring(0, 9) : null,
        isTestMode: Boolean(hasKeyId && keyId?.startsWith('rzp_test_')),
        secretSet: hasKeySecret,
      },
    };
  }

  const isValidFormat = (keyId as string).startsWith('rzp_test_') || (keyId as string).startsWith('rzp_live_');
  if (!isValidFormat) {
    return {
      isConfigured: false,
      keyId: null,
      mode: 'invalid',
      message: "Invalid Key ID format. Razorpay Key IDs must start with 'rzp_test_' (Test mode) or 'rzp_live_' (Live mode).",
      diagnostics: {
        hasKeyId: true,
        hasKeySecret: true,
        keyIdPrefix: (keyId as string).substring(0, 9),
        isTestMode: false,
        secretSet: true,
      },
    };
  }

  const isTest = (keyId as string).startsWith('rzp_test_');

  return {
    isConfigured: true,
    keyId: keyId as string,
    mode: isTest ? 'test' : 'live',
    diagnostics: {
      hasKeyId: true,
      hasKeySecret: true,
      keyIdPrefix: isTest ? 'rzp_test_' : 'rzp_live_',
      isTestMode: isTest,
      secretSet: true,
    },
  };
}

export interface CreateOrderParams {
  amount: number; // in INR
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  success: boolean;
  orderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  isTestMode: boolean;
}

export async function createRazorpayOrder(params: CreateOrderParams): Promise<RazorpayOrderResult> {
  const { keyId, keySecret } = getRazorpayKeys();
  const amountInPaise = Math.round(params.amount * 100);
  const receipt = params.receipt || `rcpt_${Date.now()}`;

  if (
    !keyId ||
    !keySecret ||
    keyId === 'MY_RAZORPAY_KEY_ID' ||
    keySecret === 'MY_RAZORPAY_KEY_SECRET' ||
    keyId === 'your_razorpay_test_key_id' ||
    keySecret === 'your_razorpay_test_key_secret' ||
    keyId === 'rzp_test_placeholder' ||
    keySecret === 'your_secret_here'
  ) {
    throw new Error(
      'Razorpay credentials are not configured on the server. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel Environment Variables to process payments.'
    );
  }

  if (!keyId.startsWith('rzp_test_') && !keyId.startsWith('rzp_live_')) {
    throw new Error(
      "Invalid Razorpay Key ID format. Key ID must start with 'rzp_test_' for Test mode or 'rzp_live_' for Live mode. Please verify your keys in the Razorpay Dashboard (Settings > API Keys)."
    );
  }

  // Standard Razorpay API call via basic auth (key_id:key_secret)
  const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt.substring(0, 40),
      notes: params.notes || { app: 'ShopAgent AI' },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    let errorDetail = errText;
    try {
      const parsed = JSON.parse(errText);
      if (parsed.error?.description) {
        errorDetail = parsed.error.description;
      }
    } catch {
      // Use raw text if not JSON
    }

    if (response.status === 401) {
      if (keyId.startsWith('rzp_test_')) {
        console.warn(
          '[ShopAgent AI] Razorpay API returned 401 for server order creation. Using test mode client checkout with public Key ID.'
        );
        return {
          success: true,
          orderId: '', // Empty orderId enables direct test-mode checkout in Razorpay modal
          amount: amountInPaise,
          currency: 'INR',
          keyId: keyId,
          isTestMode: true,
        };
      }
      throw new Error(
        'Razorpay Authentication Failed (401). Your RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is incorrect. Please check your credentials in Vercel Environment Variables.'
      );
    }

    throw new Error(`Razorpay order creation failed (${response.status}): ${errorDetail}`);
  }

  const data = await response.json();
  if (!data.id) {
    throw new Error('Razorpay API did not return a valid order ID');
  }

  return {
    success: true,
    orderId: data.id,
    amount: data.amount,
    currency: data.currency || 'INR',
    keyId: keyId,
    isTestMode: keyId.startsWith('rzp_test_'),
  };
}

export interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export function verifyRazorpaySignature(params: VerifyPaymentParams): { isValid: boolean; message: string } {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;
  const { keySecret } = getRazorpayKeys();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return {
      isValid: false,
      message: 'Missing required payment verification parameters (razorpay_order_id, razorpay_payment_id, or razorpay_signature).',
    };
  }

  if (
    !keySecret ||
    keySecret === 'MY_RAZORPAY_KEY_SECRET' ||
    keySecret === 'your_razorpay_test_key_secret' ||
    keySecret === 'your_secret_here'
  ) {
    return {
      isValid: false,
      message: 'RAZORPAY_KEY_SECRET is not configured on the server. Cannot verify payment signature.',
    };
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const genBuf = Buffer.from(generatedSignature, 'utf8');
    const sigBuf = Buffer.from(razorpay_signature, 'utf8');

    const isValid = genBuf.length === sigBuf.length && crypto.timingSafeEqual(genBuf, sigBuf);

    return {
      isValid,
      message: isValid
        ? 'Razorpay payment signature verified successfully.'
        : 'Razorpay HMAC signature mismatch. Verification failed.',
    };
  } catch (err: any) {
    console.error('Signature verification exception:', err);
    return {
      isValid: false,
      message: `Signature verification error: ${err.message}`,
    };
  }
}
