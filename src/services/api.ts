import { ExtractedIntent, RecommendationRationale, AgentAction, AnalyticsMetrics } from '../types';

export interface ChatAPIRequest {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  currentIntent?: ExtractedIntent;
}

export interface ChatAPIResponse {
  reply: string;
  recommendations: RecommendationRationale[];
  extractedIntent: ExtractedIntent;
  agentAction?: AgentAction;
  followUpSuggestions: string[];
  poweredBy: 'gemini' | 'rule-engine';
}

export async function sendChatMessage(params: ChatAPIRequest): Promise<ChatAPIResponse> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `Server error ${response.status}`);
  }

  return response.json();
}

export async function compareProductsAPI(
  productIds: string[],
  userQuestion?: string
): Promise<{ analysis: string; winnerId?: string }> {
  const response = await fetch('/api/ai/compare', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productIds, userQuestion }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch AI comparison analysis');
  }

  return response.json();
}

export async function getRazorpayConfigAPI(): Promise<{ isConfigured: boolean; keyId: string | null; mode: string; message?: string }> {
  try {
    const response = await fetch('/api/razorpay/config');
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    const errData = await response.json().catch(() => ({}));
    return {
      isConfigured: false,
      keyId: null,
      mode: 'unconfigured',
      message: errData.message || errData.error || 'Razorpay credentials not configured in Vercel.',
    };
  } catch (err) {
    console.warn('[ShopAgent AI] /api/razorpay/config check failed:', err);
    return {
      isConfigured: false,
      keyId: null,
      mode: 'unconfigured',
      message: 'Unable to reach payment configuration server. Check network and Vercel serverless function status.',
    };
  }
}

export async function createRazorpayOrderAPI(amount: number, notes?: Record<string, string>): Promise<{
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  isTestMode: boolean;
}> {
  const response = await fetch('/api/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, notes }),
  });

  const contentType = response.headers.get('content-type') || '';
  let data: any = {};
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => ({}));
  } else {
    const text = await response.text().catch(() => '');
    data = { error: text || `Server returned HTTP ${response.status}` };
  }

  if (!response.ok || !data.success) {
    throw new Error(data.error || data.details || data.message || `Failed to create order on Razorpay server (${response.status})`);
  }

  return data;
}

export async function verifyRazorpayPaymentAPI(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ success: boolean; verified: boolean; message: string; orderId?: string; paymentId?: string }> {
  const response = await fetch('/api/razorpay/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const contentType = response.headers.get('content-type') || '';
  let data: any = {};
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => ({}));
  } else {
    const text = await response.text().catch(() => '');
    data = { message: text || `Verification returned status ${response.status}` };
  }

  if (!response.ok || !data.verified) {
    throw new Error(data.message || data.error || 'Payment signature verification failed');
  }

  return data;
}

export async function fetchInsightsAPI(): Promise<AnalyticsMetrics> {
  const response = await fetch('/api/insights');
  if (!response.ok) {
    throw new Error('Failed to fetch commerce insights');
  }
  return response.json();
}
