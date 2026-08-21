import { Product, ProductCategory, ExtractedIntent, RecommendationRationale, AgentAction } from '../types';
import { PRODUCTS } from '../data/products';

export function parseShoppingIntent(query: string, currentIntent?: ExtractedIntent): ExtractedIntent {
  const q = query.toLowerCase();
  const intent: ExtractedIntent = {
    colors: currentIntent?.colors ? [...currentIntent.colors] : [],
    occasions: currentIntent?.occasions ? [...currentIntent.occasions] : [],
    styles: currentIntent?.styles ? [...currentIntent.styles] : [],
    specificFeatures: currentIntent?.specificFeatures ? [...currentIntent.specificFeatures] : [],
    category: currentIntent?.category || undefined,
    budgetMax: currentIntent?.budgetMax || undefined,
    budgetMin: currentIntent?.budgetMin || undefined,
  };

  // 1. Budget extraction
  // Matches "under 2000", "under ₹2000", "below 2000", "less than 2k", "< 2000", "within 1500", "budget 2000", "max 2000"
  const underMatch = q.match(/(?:under|below|less than|within|max|budget of|budget|upto|up to|costing less than)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d+)?|\d+k)/i);
  const symbolMatch = q.match(/(?:<|<=)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
  const rangeMatch = q.match(/(?:between|from)\s*(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:to|and|-)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);

  if (underMatch) {
    let raw = underMatch[1].replace(/,/g, '');
    if (raw.toLowerCase().endsWith('k')) {
      intent.budgetMax = parseFloat(raw) * 1000;
    } else {
      intent.budgetMax = parseInt(raw, 10);
    }
  } else if (symbolMatch) {
    intent.budgetMax = parseInt(symbolMatch[1], 10);
  } else if (rangeMatch) {
    intent.budgetMin = parseInt(rangeMatch[1], 10);
    intent.budgetMax = parseInt(rangeMatch[2], 10);
  } else {
    // Check if user says "around 2000" or just "2000" with context
    const aroundMatch = q.match(/(?:around|approx|nearly)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
    if (aroundMatch) {
      const target = parseInt(aroundMatch[1], 10);
      intent.budgetMax = target * 1.15;
      intent.budgetMin = target * 0.7;
    }
  }

  // Refinement: "cheaper", "lower budget", "under 1500"
  if (q.includes('cheaper') || q.includes('lower price') || q.includes('more affordable') || q.includes('budget option')) {
    if (intent.budgetMax) {
      intent.budgetMax = Math.round(intent.budgetMax * 0.75);
    } else {
      intent.budgetMax = 1500;
    }
  }

  // 2. Category extraction
  if (q.match(/\b(dress|dresses|frock|gowns?|skirt|kurta|anarkali|slip dress|maxi)\b/i)) {
    intent.category = 'Dresses';
  } else if (q.match(/\b(tops?|shirts?|t-?shirts?|tees?|crop tops?|blouses?|knit top|streetwear tee)\b/i)) {
    intent.category = 'Tops';
  } else if (q.match(/\b(sneakers?|shoes?|footwear|kicks|trainers|runners|walking shoes|platform shoes|slip-?ons?)\b/i)) {
    intent.category = 'Sneakers';
  } else if (q.match(/\b(bags?|backpacks?|tote bags?|totes?|handbags?|slings?|crossbody|messenger)\b/i)) {
    intent.category = 'Bags';
  } else if (q.match(/\b(watch|watches|smartwatch|smartwatches|timepiece|fitness band|wrist watch)\b/i)) {
    intent.category = 'Watches';
  } else if (q.match(/\b(accessories|sunglasses|shades|shades|jewelry|necklace|pendant|earbuds|earphones|belt|tumbler|bottle|scarf)\b/i)) {
    intent.category = 'Accessories';
  }

  // 3. Color extraction
  const colorList = ['black', 'white', 'navy', 'blue', 'green', 'teal', 'sage', 'rose gold', 'silver', 'brown', 'beige', 'grey', 'gray', 'red', 'burgundy', 'maroon', 'yellow', 'mustard', 'emerald', 'tan', 'khaki'];
  for (const c of colorList) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(q)) {
      if (!intent.colors?.includes(c)) {
        intent.colors = [c, ...(intent.colors || [])];
      }
    }
  }

  // 4. Occasion extraction
  const occasionMap: { [key: string]: string[] } = {
    'college': ['college', 'campus', 'lecture', 'university', 'classes', 'library'],
    'party': ['party', 'parties', 'club', 'celebration', 'fest', 'cocktail', 'farewell', 'prom'],
    'casual': ['casual', 'daily', 'everyday', 'hangout', 'cafe'],
    'gift': ['gift', 'gifting', 'present', 'birthday', 'anniversary', 'rakhi', 'valuable'],
    'formal': ['formal', 'office', 'interview', 'presentation', 'work', 'corporate'],
    'sports': ['gym', 'workout', 'sports', 'running', 'fitness', 'training', 'walking'],
    'travel': ['travel', 'vacation', 'trip', 'flight', 'weekend'],
    'summer': ['summer', 'beach', 'hot weather', 'sun', 'outdoor'],
    'festive': ['festive', 'traditional', 'ethnic day', 'diwali', 'ethnic']
  };

  for (const [occKey, aliases] of Object.entries(occasionMap)) {
    if (aliases.some(alias => new RegExp(`\\b${alias}\\b`, 'i').test(q))) {
      if (!intent.occasions?.includes(occKey)) {
        intent.occasions = [occKey, ...(intent.occasions || [])];
      }
    }
  }

  // 5. Styles & preferences
  if (q.includes('comfortable') || q.includes('comfy') || q.includes('soft') || q.includes('cushion') || q.includes('walking')) {
    intent.styles = Array.from(new Set([...(intent.styles || []), 'comfortable']));
  }
  if (q.includes('oversized') || q.includes('baggy') || q.includes('relaxed') || q.includes('loose')) {
    intent.styles = Array.from(new Set([...(intent.styles || []), 'oversized']));
  }
  if (q.includes('minimalist') || q.includes('minimal') || q.includes('simple') || q.includes('clean')) {
    intent.styles = Array.from(new Set([...(intent.styles || []), 'minimalist']));
  }
  if (q.includes('waterproof') || q.includes('water resistant') || q.includes('anti-theft') || q.includes('laptop')) {
    intent.styles = Array.from(new Set([...(intent.styles || []), 'functional']));
  }
  if (q.includes('elegant') || q.includes('classy') || q.includes('premium') || q.includes('luxurious')) {
    intent.styles = Array.from(new Set([...(intent.styles || []), 'elegant']));
  }

  return intent;
}

export function rankProductsForIntent(
  products: Product[] = PRODUCTS,
  intent: ExtractedIntent,
  queryText: string = ''
): RecommendationRationale[] {
  const scoredList: { product: Product; score: number; matchReasons: string[] }[] = [];

  const lowerQuery = queryText.toLowerCase();

  for (const product of products) {
    let score = 0;
    const matchReasons: string[] = [];

    // 1. Category Matching (Highest Base Factor if defined)
    if (intent.category && intent.category !== 'all') {
      if (product.category.toLowerCase() === intent.category.toLowerCase()) {
        score += 40;
      } else {
        score -= 20; // Demote non-matching category
      }
    }

    // 2. Budget Matching
    if (intent.budgetMax) {
      if (product.price <= intent.budgetMax) {
        score += 35;
        const diff = intent.budgetMax - product.price;
        // Reward close fits without overspending
        if (diff >= 0 && diff <= 500) {
          score += 10;
        }
        matchReasons.push(`Fits within your ₹${intent.budgetMax.toLocaleString('en-IN')} budget (₹${product.price.toLocaleString('en-IN')})`);
      } else {
        // Exceeds budget: penalize proportionally
        const overPercent = (product.price - intent.budgetMax) / intent.budgetMax;
        if (overPercent > 0.3) {
          score -= 50; // Too expensive
        } else {
          score -= 15; // Slightly over budget
        }
      }
    }

    if (intent.budgetMin && product.price >= intent.budgetMin) {
      score += 10;
    }

    // 3. Color Matching
    if (intent.colors && intent.colors.length > 0) {
      const matchedColor = intent.colors.find(c =>
        product.colors.some(pc => pc.toLowerCase().includes(c.toLowerCase())) ||
        product.name.toLowerCase().includes(c.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(c.toLowerCase()))
      );

      if (matchedColor) {
        score += 25;
        matchReasons.push(`Available in your preferred ${matchedColor} color tone`);
      }
    }

    // 4. Occasion Matching
    if (intent.occasions && intent.occasions.length > 0) {
      const matchedOcc = intent.occasions.find(occ =>
        product.occasion.some(po => po.toLowerCase().includes(occ.toLowerCase())) ||
        product.tags.some(tag => tag.toLowerCase().includes(occ.toLowerCase())) ||
        product.description.toLowerCase().includes(occ.toLowerCase())
      );

      if (matchedOcc) {
        score += 20;
        matchReasons.push(`Tailored for ${matchedOcc} use and settings`);
      }
    }

    // 5. Styles and Keywords
    if (intent.styles && intent.styles.length > 0) {
      for (const style of intent.styles) {
        if (
          product.tags.some(t => t.toLowerCase().includes(style)) ||
          product.features.some(f => f.toLowerCase().includes(style)) ||
          product.description.toLowerCase().includes(style)
        ) {
          score += 15;
          matchReasons.push(`Features ${style} styling & comfort`);
        }
      }
    }

    // 6. Direct Query Keyword Overlap
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
    let keywordHits = 0;
    for (const word of queryWords) {
      if (
        product.name.toLowerCase().includes(word) ||
        product.tags.some(t => t.toLowerCase().includes(word)) ||
        product.features.some(f => f.toLowerCase().includes(word)) ||
        product.category.toLowerCase().includes(word)
      ) {
        keywordHits++;
      }
    }
    score += Math.min(keywordHits * 8, 24);

    // 7. Quality signals (Rating, Reviews, Discounts)
    score += (product.rating - 4.0) * 15; // 4.9 adds 13.5 pts
    if (product.discount >= 30) {
      score += 5;
    }

    // Compose concise, natural explanation
    let rationale = '';
    if (matchReasons.length >= 2) {
      rationale = `Matches your ${matchReasons.join(', ').toLowerCase()}. Rated ${product.rating}★ by ${product.reviewCount} verified shoppers.`;
    } else if (matchReasons.length === 1) {
      rationale = `${matchReasons[0]}. Highly rated (${product.rating}★) with ${product.features[0]}.`;
    } else {
      rationale = `Popular top-rated choice in ${product.category} (₹${product.price.toLocaleString('en-IN')}) featuring ${product.features[0]}.`;
    }

    scoredList.push({
      product,
      score,
      matchReasons
    });
  }

  // Sort descending by score
  scoredList.sort((a, b) => b.score - a.score);

  // Return top 3-4 matches with formed rationale
  return scoredList.slice(0, 4).map(item => {
    const p = item.product;
    let rationale = '';

    if (intent.category && intent.budgetMax && intent.colors && intent.colors.length > 0) {
      rationale = `Matches your ₹${intent.budgetMax.toLocaleString('en-IN')} budget, ${intent.colors[0]} color preference, and ${intent.occasions?.[0] || 'college'} requirement.`;
    } else if (intent.budgetMax && intent.occasions && intent.occasions.length > 0) {
      rationale = `Under ₹${intent.budgetMax.toLocaleString('en-IN')} (priced at ₹${p.price.toLocaleString('en-IN')}) and optimized for ${intent.occasions[0]} with ${p.features[0]}.`;
    } else if (intent.styles?.includes('comfortable')) {
      rationale = `Top-rated for comfort with ${p.features[0]} and ${p.rating}★ rating.`;
    } else if (item.matchReasons.length > 0) {
      rationale = `${item.matchReasons.join('. ')}.`;
    } else {
      rationale = `Recommended best-seller in ${p.category} with ${p.discount}% discount and ${p.rating}★ customer satisfaction.`;
    }

    return {
      productId: p.id,
      product: p,
      rationale,
      matchScore: Math.round(item.score)
    };
  });
}

export function detectAgentAction(query: string, currentRecommendations: RecommendationRationale[]): AgentAction | undefined {
  const q = query.toLowerCase();

  // Add to cart action
  if (
    q.includes('add the best') ||
    q.includes('add the top') ||
    q.includes('add best one') ||
    q.includes('add it to my cart') ||
    q.includes('add to cart') ||
    q.includes('put this in my cart') ||
    q.includes('buy the first') ||
    q.includes('add this')
  ) {
    if (currentRecommendations.length > 0) {
      return {
        type: 'ADD_TO_CART',
        productId: currentRecommendations[0].productId,
        applied: true
      };
    }
  }

  // Compare action
  if (
    q.includes('compare') ||
    q.includes('which one is better') ||
    q.includes('how do they compare') ||
    q.includes('difference between') ||
    q.includes('vs')
  ) {
    if (currentRecommendations.length >= 2) {
      return {
        type: 'COMPARE',
        productIds: currentRecommendations.slice(0, 3).map(r => r.productId),
        applied: true
      };
    }
  }

  return undefined;
}
