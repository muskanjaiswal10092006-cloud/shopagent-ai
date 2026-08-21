import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Zap,
  Users,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Award
} from 'lucide-react';
import { AnalyticsMetrics } from '../types';
import { fetchInsightsAPI } from '../services/api';

export const InsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    fetchInsightsAPI()
      .then((data) => setMetrics(data))
      .catch((e) => console.error('Failed to load metrics:', e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading Agentic Commerce Growth Insights...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200/60">
              AI Growth & Agentic Commerce
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Commerce Agent Telemetry & Analytics
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-world performance benchmarks comparing autonomous shopping agents against traditional search.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={() => navigate('/assistant')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Test Agent Live</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Agent Sessions</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-sans">
            {metrics.totalSessions.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+34% weekly user adoption</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Resolution Speed</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-sans">
            {metrics.avgResolutionSeconds}s
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            vs 4.8 mins traditional filtering
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recommendation CTR</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-sans">
            {metrics.recommendationClickRate}%
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>3.2x higher than keyword search</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cart Conversion Rate</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-teal-700 font-sans">
            {metrics.cartConversionRate}%
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>vs 2.1% industry baseline</span>
          </div>
        </div>
      </div>

      {/* Category Intent Breakdown & Intent Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              <span>Category Intent Distribution</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">By query volume</span>
          </div>

          <div className="space-y-4">
            {metrics.topCategories.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{cat.name}</span>
                  <span className="font-sans text-slate-900">{cat.count.toLocaleString('en-IN')} queries ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Intent Categories */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-600" />
              <span>Top Natural-Language Query Clusters</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Extracted constraints</span>
          </div>

          <div className="space-y-3">
            {metrics.intentBreakdown.map((intent, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-teal-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span>{intent.intent}</span>
                </div>
                <span className="font-bold text-slate-900 font-sans shrink-0">
                  {intent.count.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Converted Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600" />
            <span>Top AI-Recommended Products & Conversion Efficiency</span>
          </h3>
          <Link
            to="/products"
            className="text-xs font-semibold text-teal-700 hover:underline"
          >
            View Catalogue →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4 text-center">AI Recommendations</th>
                <th className="py-3 px-4 text-center">Purchased / Added to Cart</th>
                <th className="py-3 px-4 text-right">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.topRecommended.map((item) => {
                const rate = ((item.conversionCount / item.recommendationsCount) * 100).toFixed(1);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <Link to={`/products/${item.id}`} className="hover:text-teal-700 transition-colors">
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-center font-sans text-slate-700">
                      {item.recommendationsCount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center font-sans font-bold text-slate-900">
                      {item.conversionCount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700 font-sans">
                      {rate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
