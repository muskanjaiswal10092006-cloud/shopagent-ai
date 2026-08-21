import { Review } from '../types';

export const INITIAL_REVIEWS: Record<string, Review[]> = {
  // Dresses
  'prod-dress-01': [
    {
      id: 'rev-dress-01-1',
      productId: 'prod-dress-01',
      authorName: 'Priya Sharma',
      rating: 5,
      title: 'Super comfortable for full college days!',
      comment:
        'The cotton fabric feels soft and breathable even during 35°C afternoon lectures. The hidden side pockets are deep enough for my phone and student ID. Highly recommend!',
      date: '2026-08-10',
      verifiedPurchase: true,
      helpfulCount: 24,
      recommended: true,
      fitFeedback: 'True to Size',
    },
    {
      id: 'rev-dress-01-2',
      productId: 'prod-dress-01',
      authorName: 'Ananya Verma',
      rating: 5,
      title: 'Flattering waist pleats and zero wrinkles',
      comment:
        'Wore this for our campus orientation event. The pleats hold up really well after washing. Looks great paired with white sneakers and a denim jacket.',
      date: '2026-08-04',
      verifiedPurchase: true,
      helpfulCount: 18,
      recommended: true,
      fitFeedback: 'True to Size',
    },
    {
      id: 'rev-dress-01-3',
      productId: 'prod-dress-01',
      authorName: 'Kavya Nair',
      rating: 4,
      title: 'Great quality, slightly snug on bust',
      comment:
        'Lovely color (Navy Blue is deep and rich). If you are in between sizes, I would suggest sizing up one size for a more relaxed fit around the chest.',
      date: '2026-07-28',
      verifiedPurchase: true,
      helpfulCount: 9,
      recommended: true,
      fitFeedback: 'Runs Small',
    },
  ],
  'prod-dress-02': [
    {
      id: 'rev-dress-02-1',
      productId: 'prod-dress-02',
      authorName: 'Rhea Sen',
      rating: 5,
      title: 'Stunning evening dress for college farewell!',
      comment:
        'The micro-velvet material looks super luxurious and catches light gracefully. The inner clasp on the neckline prevents any wardrobe malfunctions. Everyone complimented it!',
      date: '2026-08-14',
      verifiedPurchase: true,
      helpfulCount: 31,
      recommended: true,
      fitFeedback: 'True to Size',
    },
    {
      id: 'rev-dress-02-2',
      productId: 'prod-dress-02',
      authorName: 'Tanvi Kapoor',
      rating: 4,
      title: 'Burgundy shade is gorgeous',
      comment:
        'Really soft texture and fits nicely around the waist with the sash tie. Perfect for dinner parties and fest nights under ₹2000.',
      date: '2026-08-02',
      verifiedPurchase: true,
      helpfulCount: 12,
      recommended: true,
      fitFeedback: 'True to Size',
    },
  ],
  'prod-dress-03': [
    {
      id: 'rev-dress-03-1',
      productId: 'prod-dress-03',
      authorName: 'Meera Iyer',
      rating: 5,
      title: 'Breezy and elegant for daytime presentations',
      comment:
        'The smocked bodice stretches comfortably and the lining ensures it is not see-through. Perfect length with flats or wedges.',
      date: '2026-08-08',
      verifiedPurchase: true,
      helpfulCount: 15,
      recommended: true,
      fitFeedback: 'True to Size',
    },
  ],

  // Sneakers
  'prod-snk-01': [
    {
      id: 'rev-snk-01-1',
      productId: 'prod-snk-01',
      authorName: 'Aditya Patel',
      rating: 5,
      title: 'Lifesaver for 10,000+ steps across campus',
      comment:
        'The memory foam insole is top-notch. My feet usually ache by evening after walking between science blocks, but these keep my soles cushioned and fatigue-free all day.',
      date: '2026-08-16',
      verifiedPurchase: true,
      helpfulCount: 42,
      recommended: true,
      fitFeedback: 'True to Size',
    },
    {
      id: 'rev-snk-01-2',
      productId: 'prod-snk-01',
      authorName: 'Siddharth Rao',
      rating: 5,
      title: 'Super lightweight and easy to clean',
      comment:
        'Weighs practically nothing and the breathable knitted mesh prevents sweaty feet. Triple white looks clean with both jeans and gym joggers.',
      date: '2026-08-09',
      verifiedPurchase: true,
      helpfulCount: 20,
      recommended: true,
      fitFeedback: 'True to Size',
    },
    {
      id: 'rev-snk-01-3',
      productId: 'prod-snk-01',
      authorName: 'Rahul Joshi',
      rating: 4,
      title: 'Very comfortable sole, snug toe box',
      comment:
        'Cushioning is 10/10. For wider feet, consider picking one size larger so your toes have plenty of room to splay.',
      date: '2026-07-30',
      verifiedPurchase: true,
      helpfulCount: 11,
      recommended: true,
      fitFeedback: 'Runs Small',
    },
  ],
  'prod-snk-02': [
    {
      id: 'rev-snk-02-1',
      productId: 'prod-snk-02',
      authorName: 'Ishaan Malhotra',
      rating: 5,
      title: 'Awesome chunky silhouette with extra height',
      comment:
        'The 4cm platform gives great posture without feeling heavy or clumsy. The Off-White & Teal colorway gets continuous compliments in the canteen.',
      date: '2026-08-12',
      verifiedPurchase: true,
      helpfulCount: 28,
      recommended: true,
      fitFeedback: 'True to Size',
    },
  ],

  // Bags
  'prod-bag-01': [
    {
      id: 'rev-bag-01-1',
      productId: 'prod-bag-01',
      authorName: 'Varun Mukherjee',
      rating: 5,
      title: 'Best college laptop backpack under ₹2000',
      comment:
        'Fits my 15.6" Dell laptop with thick padding on all sides. Survived heavy monsoon rain without a single drop reaching my books inside. The USB port is a handy bonus!',
      date: '2026-08-15',
      verifiedPurchase: true,
      helpfulCount: 37,
      recommended: true,
      fitFeedback: 'True to Size',
    },
    {
      id: 'rev-bag-01-2',
      productId: 'prod-bag-01',
      authorName: 'Aakash Deep',
      rating: 5,
      title: 'Solid build quality and ergonomic straps',
      comment:
        'Padded shoulder straps distribute heavy weight evenly. Ample compartments for water bottle, umbrella, chargers, and notebook folders.',
      date: '2026-08-06',
      verifiedPurchase: true,
      helpfulCount: 19,
      recommended: true,
      fitFeedback: 'True to Size',
    },
  ],
  'prod-bag-02': [
    {
      id: 'rev-bag-02-1',
      productId: 'prod-bag-02',
      authorName: 'Divya Nambiar',
      rating: 5,
      title: 'Classy vegan leather tote for presentations',
      comment:
        'The tan brown looks expensive and easily holds my 13" MacBook, iPad, and notebook. The full top zipper is essential for safety during train commutes.',
      date: '2026-08-11',
      verifiedPurchase: true,
      helpfulCount: 22,
      recommended: true,
      fitFeedback: 'True to Size',
    },
  ],

  // Watches
  'prod-wat-01': [
    {
      id: 'rev-wat-01-1',
      productId: 'prod-wat-01',
      authorName: 'Arjun Mehta',
      rating: 5,
      title: 'Timeless minimalist watch with sapphire crystal',
      comment:
        'Clean Bauhaus aesthetic that looks like a ₹10,000 timepiece. Milanese mesh strap is very easy to adjust. Perfect for interviews and campus events.',
      date: '2026-08-13',
      verifiedPurchase: true,
      helpfulCount: 30,
      recommended: true,
      fitFeedback: 'True to Size',
    },
  ],
  'prod-wat-02': [
    {
      id: 'rev-wat-02-1',
      productId: 'prod-wat-02',
      authorName: 'Kunal Singhania',
      rating: 5,
      title: 'Crisp AMOLED display and accurate step tracking',
      comment:
        'Display is vivid even in direct sunlight. Bluetooth calling is clear and the battery easily lasts 6-7 days on a single charge. Excellent value!',
      date: '2026-08-17',
      verifiedPurchase: true,
      helpfulCount: 45,
      recommended: true,
      fitFeedback: 'True to Size',
    },
  ],

  // Accessories
  'prod-acc-01': [
    {
      id: 'rev-acc-01-1',
      productId: 'prod-acc-01',
      authorName: 'Sanjay Deshmukh',
      rating: 5,
      title: 'Genuine polarized lenses with zero glare',
      comment:
        'Tested them while driving and on campus under harsh noon sun. Glare cut is immediate and the TR90 frame is flexible and featherlight.',
      date: '2026-08-07',
      verifiedPurchase: true,
      helpfulCount: 25,
      recommended: true,
      fitFeedback: 'True to Size',
    },
  ],
  'prod-acc-02': [
    {
      id: 'rev-acc-02-1',
      productId: 'prod-acc-02',
      authorName: 'Sneha Roy',
      rating: 5,
      title: 'Delicate, hallmarked 925 silver shine',
      comment:
        'Bought this as a birthday gift for myself. The dual layer chain hangs beautifully and has not tarnished after daily wear. The gift box is lovely too.',
      date: '2026-08-10',
      verifiedPurchase: true,
      helpfulCount: 16,
      recommended: true,
      fitFeedback: 'True to Size',
    },
  ],
};

const STORAGE_KEY_PREFIX = 'shopagent_reviews_';

export function getProductReviews(productId: string): Review[] {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${productId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading reviews from localStorage:', err);
  }

  // Return preset initial reviews or default fallback
  return INITIAL_REVIEWS[productId] || [
    {
      id: `rev-${productId}-def1`,
      productId,
      authorName: 'Verified Student Buyer',
      rating: 5,
      title: 'Exceptional quality and fast delivery',
      comment: 'Very pleased with the craftsmanship and quick dispatch. Exactly matches the photos and descriptions.',
      date: '2026-08-15',
      verifiedPurchase: true,
      helpfulCount: 8,
      recommended: true,
      fitFeedback: 'True to Size',
    },
    {
      id: `rev-${productId}-def2`,
      productId,
      authorName: 'Campus Shopper',
      rating: 4,
      title: 'Value for money purchase',
      comment: 'Solid build and good finish. Would definitely recommend for daily college styling and routine use.',
      date: '2026-08-05',
      verifiedPurchase: true,
      helpfulCount: 5,
      recommended: true,
      fitFeedback: 'True to Size',
    },
  ];
}

export function saveProductReview(productId: string, newReview: Omit<Review, 'id' | 'date' | 'helpfulCount'>): Review {
  const current = getProductReviews(productId);
  const createdReview: Review = {
    ...newReview,
    id: `rev-${productId}-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    helpfulCount: 0,
  };

  const updated = [createdReview, ...current];
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${productId}`, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving review to localStorage:', err);
  }

  return createdReview;
}

export function toggleReviewHelpful(productId: string, reviewId: string, increment: boolean): Review[] {
  const current = getProductReviews(productId);
  const updated = current.map((rev) => {
    if (rev.id === reviewId) {
      return {
        ...rev,
        helpfulCount: Math.max(0, rev.helpfulCount + (increment ? 1 : -1)),
      };
    }
    return rev;
  });

  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${productId}`, JSON.stringify(updated));
  } catch (err) {
    console.error('Error updating review helpfulness:', err);
  }

  return updated;
}
