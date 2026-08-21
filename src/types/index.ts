export type ProductCategory =
  | 'Dresses'
  | 'Tops'
  | 'Sneakers'
  | 'Bags'
  | 'Watches'
  | 'Accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number; // in INR
  originalPrice: number;
  discount: number; // in %
  rating: number;
  reviewCount: number;
  colors: string[];
  sizes?: string[];
  tags: string[];
  occasion: string[];
  features: string[];
  stock: number;
  image: string;
  gallery?: string[];
  brand?: string;
  bestFor?: string;
}

export interface CartItem {
  id: string; // unique item instance id (productId + color + size)
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: 'paid' | 'pending' | 'failed';
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  customer: CustomerDetails;
  shipping: ShippingAddress;
  createdAt: string;
  paymentMethod: string;
}

export interface RecommendationRationale {
  productId: string;
  product: Product;
  rationale: string;
  matchScore: number;
}

export interface AgentAction {
  type: 'ADD_TO_CART' | 'COMPARE' | 'FILTER' | 'REFINE';
  productId?: string;
  productIds?: string[];
  applied?: boolean;
}

export interface ExtractedIntent {
  category?: ProductCategory | 'all';
  budgetMax?: number;
  budgetMin?: number;
  colors?: string[];
  occasions?: string[];
  styles?: string[];
  specificFeatures?: string[];
  isRefinement?: boolean;
  actionRequested?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recommendations?: RecommendationRationale[];
  agentAction?: AgentAction;
  extractedIntent?: ExtractedIntent;
  followUpSuggestions?: string[];
}

export interface ComparisonData {
  products: Product[];
  verdict?: string;
  winnerProductId?: string;
}

export interface AnalyticsMetrics {
  totalSessions: number;
  avgResolutionSeconds: number;
  recommendationClickRate: number;
  cartConversionRate: number;
  topCategories: { name: string; count: number; percentage: number }[];
  topRecommended: { id: string; name: string; recommendationsCount: number; conversionCount: number }[];
  intentBreakdown: { intent: string; count: number }[];
  dailyInteractions: { day: string; aiAssisted: number; manualSearch: number }[];
}

export type FitFeedback = 'Runs Small' | 'True to Size' | 'Runs Large';

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  authorEmail?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  recommended: boolean;
  fitFeedback?: FitFeedback;
}
