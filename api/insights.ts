import { AnalyticsMetrics } from '../src/types';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sampleAnalytics: AnalyticsMetrics = {
    totalSessions: 14820,
    avgResolutionSeconds: 14.2,
    recommendationClickRate: 68.4,
    cartConversionRate: 32.8,
    topCategories: [
      { name: 'Sneakers', count: 4820, percentage: 32.5 },
      { name: 'Dresses', count: 3950, percentage: 26.6 },
      { name: 'Bags', count: 2410, percentage: 16.3 },
      { name: 'Tops', count: 1890, percentage: 12.8 },
      { name: 'Watches', count: 1120, percentage: 7.6 },
      { name: 'Accessories', count: 630, percentage: 4.2 },
    ],
    topRecommended: [
      { id: 'prod-snk-01', name: 'CloudStride Pro Daily Walking Sneakers', recommendationsCount: 3120, conversionCount: 1140 },
      { id: 'prod-dress-01', name: 'A-Line Pleated College Skater Dress', recommendationsCount: 2840, conversionCount: 980 },
      { id: 'prod-bag-01', name: 'UrbanShield Tech College Backpack (15.6")', recommendationsCount: 2190, conversionCount: 750 },
      { id: 'prod-dress-02', name: 'Velvet Midnight Wrap Evening Dress', recommendationsCount: 1940, conversionCount: 680 },
      { id: 'prod-wat-02', name: 'AeroTrack Pro Smart Fitness Smartwatch', recommendationsCount: 1450, conversionCount: 490 },
    ],
    intentBreakdown: [
      { intent: 'Budget-Constrained Discovery (< ₹2000)', count: 6420 },
      { intent: 'Occasion-Specific (College / Campus / Events)', count: 4980 },
      { intent: 'Comfort & Daily Walking Preference', count: 3870 },
      { intent: 'Direct Comparison & Feature Tradeoffs', count: 2310 },
      { intent: 'Gift Recommendation Requests', count: 1420 },
    ],
    dailyInteractions: [
      { day: 'Mon', aiAssisted: 1840, manualSearch: 620 },
      { day: 'Tue', aiAssisted: 2100, manualSearch: 710 },
      { day: 'Wed', aiAssisted: 1980, manualSearch: 680 },
      { day: 'Thu', aiAssisted: 2450, manualSearch: 790 },
      { day: 'Fri', aiAssisted: 2890, manualSearch: 890 },
      { day: 'Sat', aiAssisted: 3410, manualSearch: 1050 },
      { day: 'Sun', aiAssisted: 3150, manualSearch: 980 },
    ],
  };

  return res.status(200).json(sampleAnalytics);
}
