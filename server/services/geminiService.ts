import { GoogleGenAI } from '@google/genai';
import { PRODUCTS } from '../../src/data/products';
import { ExtractedIntent, RecommendationRationale, AgentAction, Product } from '../../src/types';
import { parseShoppingIntent, rankProductsForIntent, detectAgentAction } from '../../src/utils/recommendationEngine';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface AIChatRequest {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  currentIntent?: ExtractedIntent;
}

export interface AIChatResponse {
  reply: string;
  recommendations: RecommendationRationale[];
  extractedIntent: ExtractedIntent;
  agentAction?: AgentAction;
  followUpSuggestions: string[];
  poweredBy: 'gemini' | 'rule-engine';
}

const CATALOG_SUMMARY = PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  originalPrice: p.originalPrice,
  discount: p.discount,
  rating: p.rating,
  colors: p.colors,
  occasion: p.occasion,
  features: p.features,
  tags: p.tags,
  bestFor: p.bestFor,
}));

export async function processAIChat(request: AIChatRequest): Promise<AIChatResponse> {
  const userMessage = request.message;
  const history = request.history || [];
  const currentIntent = request.currentIntent || {};

  // First extract baseline intent with our robust parser
  const parsedIntent = parseShoppingIntent(userMessage, currentIntent);
  const baselineRecs = rankProductsForIntent(PRODUCTS, parsedIntent, userMessage);
  const baselineAction = detectAgentAction(userMessage, baselineRecs);

  const client = getAIClient();

  if (!client) {
    // Return high-quality, conversational rule-engine response
    return generateFallbackChatResponse(userMessage, parsedIntent, baselineRecs, baselineAction, history);
  }

  try {
    const systemPrompt = `You are ShopAgent AI, an intelligent, conversational agentic commerce shopping assistant for Indian shoppers.
You help users discover, compare, select, and purchase items from our curated fashion and lifestyle catalogue in Indian Rupees (₹).

CATALOGUE DATABASE:
${JSON.stringify(CATALOG_SUMMARY, null, 2)}

YOUR AGENTIC CAPABILITIES:
1. Extract intent: Category, budget (max/min), color preferences, occasion (college, party, daily, gift, formal, etc.), style, features.
2. Recommend the best matching products strictly from the catalogue (provide product ID and a personalized 'Why this matches' explanation referencing their exact budget, color, or occasion requirements).
3. If the user asks follow-up refinement (e.g. "show something more comfortable", "cheaper options", "in another color"), remember previous context and refine recommendations.
4. If the user asks to compare items (e.g. "which is better for daily college?"), compare key metrics (durability, comfort, price, rating) and declare a clear recommendation.
5. If the user says "add the best one to my cart" or "add to cart", execute the agent action by specifying action: "ADD_TO_CART" and the chosen productId.
6. Suggest 3 concise, highly relevant next-step prompts.

RESPONSE JSON FORMAT:
Return ONLY valid JSON (without backticks or markdown if possible, or standard JSON inside \`\`\`json block):
{
  "reply": "Conversational assistant reply explaining the findings clearly and politely",
  "recommendedProductIds": ["prod-id-1", "prod-id-2"],
  "productRationales": {
    "prod-id-1": "Specific 1-sentence explanation of why this matches their budget, occasion, and preferences",
    "prod-id-2": "Specific 1-sentence explanation of why this is a great alternative"
  },
  "extractedIntent": {
    "category": "Dresses",
    "budgetMax": 2000,
    "colors": ["Black"],
    "occasions": ["college event", "party"],
    "styles": ["comfortable"]
  },
  "agentAction": {
    "type": "ADD_TO_CART" | "COMPARE" | "NONE",
    "productId": "prod-id-1",
    "productIds": ["prod-id-1", "prod-id-2"]
  },
  "followUpSuggestions": [
    "Show options under ₹1500",
    "Which has better comfort for walking?",
    "Add the top rated to cart"
  ]
}`;

    const formattedHistory = history.map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
    const prompt = `CONVERSATION HISTORY:
${formattedHistory}

LATEST USER REQUEST:
"${userMessage}"

Analyze the request in context and return the structured JSON response.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Clean possible markdown wrapper
      const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    const recommendedIds: string[] = parsed.recommendedProductIds || [];
    const rationalesMap: Record<string, string> = parsed.productRationales || {};

    const finalRecommendations: RecommendationRationale[] = recommendedIds
      .map((id) => {
        const prod = PRODUCTS.find((p) => p.id === id);
        if (!prod) return null;
        return {
          productId: prod.id,
          product: prod,
          rationale: rationalesMap[id] || `Matches your preferences with ${prod.rating}★ rating.`,
          matchScore: 90,
        };
      })
      .filter((r): r is RecommendationRationale => r !== null);

    // Fallback to baseline recs if AI returned empty or invalid IDs
    const recsToUse = finalRecommendations.length > 0 ? finalRecommendations : baselineRecs;

    let agentAction: AgentAction | undefined = undefined;
    if (parsed.agentAction && parsed.agentAction.type !== 'NONE') {
      agentAction = {
        type: parsed.agentAction.type,
        productId: parsed.agentAction.productId || recsToUse[0]?.productId,
        productIds: parsed.agentAction.productIds,
        applied: true,
      };
    } else if (baselineAction) {
      agentAction = baselineAction;
    }

    return {
      reply: parsed.reply || `I found the best matching options for you in our catalogue:`,
      recommendations: recsToUse,
      extractedIntent: parsed.extractedIntent || parsedIntent,
      agentAction,
      followUpSuggestions: parsed.followUpSuggestions || [
        'Show more budget-friendly options',
        'Compare these products',
        'Add the best one to my cart',
      ],
      poweredBy: 'gemini',
    };
  } catch (error) {
    console.error('Gemini API call failed, falling back to rule engine:', error);
    return generateFallbackChatResponse(userMessage, parsedIntent, baselineRecs, baselineAction, history);
  }
}

function generateFallbackChatResponse(
  userMessage: string,
  intent: ExtractedIntent,
  recommendations: RecommendationRationale[],
  action?: AgentAction,
  history: { role: string; content: string }[] = []
): AIChatResponse {
  const q = userMessage.toLowerCase();
  let reply = '';
  let followUpSuggestions: string[] = [];

  // Check if action is Add to Cart
  if (action?.type === 'ADD_TO_CART' && recommendations.length > 0) {
    const topItem = recommendations[0].product;
    reply = `Done! I have added the ${topItem.name} (₹${topItem.price.toLocaleString('en-IN')}) to your cart. You can review your cart anytime or proceed straight to checkout.`;
    followUpSuggestions = [
      'Show matching accessories for this',
      'Compare with second best alternative',
      'Go to Cart & Checkout',
    ];
  } else if (q.includes('compare') || q.includes('which one is better') || q.includes('vs')) {
    if (recommendations.length >= 2) {
      const p1 = recommendations[0].product;
      const p2 = recommendations[1].product;
      reply = `Comparing **${p1.name}** vs **${p2.name}**:\n\n• **${p1.name}** (₹${p1.price.toLocaleString('en-IN')}, ${p1.rating}★): Offers superior ${p1.features[0].toLowerCase()} and is tailored for ${p1.occasion.slice(0, 2).join(' & ')}.\n• **${p2.name}** (₹${p2.price.toLocaleString('en-IN')}, ${p2.rating}★): Highlights ${p2.features[0].toLowerCase()} with a ${p2.discount}% discount.\n\n**Agent Verdict**: For ${intent.occasions?.[0] || 'daily'} use, **${p1.name}** is the best value recommendation!`;
      followUpSuggestions = [
        `Add ${p1.name} to cart`,
        `Show in other colors`,
        `Find matching shoes/bags`,
      ];
    } else {
      reply = `Here are the top options to compare based on your requirements:`;
      followUpSuggestions = [
        'Which has better durability?',
        'Show options under ₹2000',
        'Add top rated to cart',
      ];
    }
  } else if (q.includes('comfortable') || q.includes('comfy')) {
    reply = `I prioritized high-comfort items crafted with cushioned soles, breathable fabrics, and ergonomic designs:`;
    followUpSuggestions = [
      'Show daily college options',
      'Filter under ₹2000',
      'Add the most comfortable to cart',
    ];
  } else if (intent.budgetMax) {
    const budgetStr = `₹${intent.budgetMax.toLocaleString('en-IN')}`;
    const categoryStr = intent.category ? intent.category.toLowerCase() : 'products';
    const colorStr = intent.colors && intent.colors.length > 0 ? `${intent.colors[0]} ` : '';
    const occasionStr = intent.occasions && intent.occasions.length > 0 ? ` for ${intent.occasions[0]}` : '';

    reply = `I discovered ${recommendations.length} fantastic ${colorStr}${categoryStr}${occasionStr} within your ${budgetStr} budget:`;
    followUpSuggestions = [
      'Show something even more affordable',
      'Which one is highest rated?',
      'Add the best one to my cart',
    ];
  } else {
    reply = `Based on your request, I searched our catalogue and ranked these top recommendations for you:`;
    followUpSuggestions = [
      'Show options under ₹2000',
      'Show something more comfortable',
      'Compare the top 2 options',
    ];
  }

  return {
    reply,
    recommendations,
    extractedIntent: intent,
    agentAction: action,
    followUpSuggestions,
    poweredBy: 'rule-engine',
  };
}

export async function processProductComparison(
  productIds: string[],
  userQuestion?: string
): Promise<{ analysis: string; winnerId?: string }> {
  const selectedProducts = PRODUCTS.filter((p) => productIds.includes(p.id));
  if (selectedProducts.length === 0) {
    return { analysis: 'No valid products found for comparison.' };
  }

  const client = getAIClient();
  if (client) {
    try {
      const prompt = `Compare these products from our catalogue:
${JSON.stringify(selectedProducts, null, 2)}

User question/context: "${userQuestion || 'Which product is the best overall choice for everyday use and value?'}"

Provide a concise, highly readable comparison analysis:
1. Key differences in materials, pricing, and features.
2. Pros and Cons of each.
3. Final Agent Verdict with a definitive recommendation and winner productId.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      return {
        analysis: response.text || '',
        winnerId: selectedProducts[0]?.id,
      };
    } catch (e) {
      console.error('Gemini comparison failed, falling back to rule based comparison', e);
    }
  }

  // Fallback rule comparison
  const p1 = selectedProducts[0];
  const p2 = selectedProducts[1] || selectedProducts[0];

  const analysis = `### Agent Comparison Analysis

**1. Price & Value**:
- **${p1.name}**: ₹${p1.price.toLocaleString('en-IN')} (${p1.discount}% off regular ₹${p1.originalPrice})
- **${p2.name}**: ₹${p2.price.toLocaleString('en-IN')} (${p2.discount}% off regular ₹${p2.originalPrice})

**2. Key Features & Materials**:
- **${p1.name}**: ${p1.features.join(' • ')}
- **${p2.name}**: ${p2.features.join(' • ')}

**3. Customer Feedback**:
- **${p1.name}** holds a ${p1.rating}★ rating across ${p1.reviewCount} customer reviews.
- **${p2.name}** holds a ${p2.rating}★ rating across ${p2.reviewCount} customer reviews.

**Agent Verdict**:
If your priority is **${userQuestion?.includes('college') ? 'campus durability and everyday versatility' : 'overall value and premium feel'}**, we recommend **${p1.rating >= p2.rating ? p1.name : p2.name}** as the winning choice!`;

  return {
    analysis,
    winnerId: p1.rating >= p2.rating ? p1.id : p2.id,
  };
}
