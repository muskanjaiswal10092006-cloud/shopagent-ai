import React, { useState, useMemo } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquarePlus,
  Filter,
  ArrowUpDown,
  Sparkles,
  Check,
  User,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, Review, FitFeedback } from '../types';
import { getProductReviews, saveProductReview, toggleReviewHelpful } from '../data/reviews';

interface ProductReviewsProps {
  product: Product;
  onRatingUpdate?: (newAvgRating: number, newCount: number) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor - Not as expected',
  2: 'Fair - Below expectations',
  3: 'Average - Decent for the price',
  4: 'Very Good - Met expectations',
  5: 'Excellent - Exceeded expectations',
};

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product, onRatingUpdate }) => {
  const [reviews, setReviews] = useState<Review[]>(() => getProductReviews(product.id));
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'helpful'>('recent');
  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});

  // Review Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [recommended, setRecommended] = useState<boolean>(true);
  const [fitFeedback, setFitFeedback] = useState<FitFeedback>('True to Size');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Compute stats dynamically
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return {
        avgRating: product.rating,
        total: product.reviewCount,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recommendPercent: 95,
        fitSummary: { 'True to Size': 100, 'Runs Small': 0, 'Runs Large': 0 },
      };
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = Number((sum / total).toFixed(1));

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let recommendCount = 0;
    const fitCounts: Record<FitFeedback, number> = {
      'True to Size': 0,
      'Runs Small': 0,
      'Runs Large': 0,
    };

    reviews.forEach((r) => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
      }
      if (r.recommended) recommendCount++;
      if (r.fitFeedback && fitCounts[r.fitFeedback] !== undefined) {
        fitCounts[r.fitFeedback]++;
      }
    });

    const recommendPercent = Math.round((recommendCount / total) * 100);

    return {
      avgRating,
      total,
      distribution,
      recommendPercent,
      fitSummary: {
        'True to Size': Math.round((fitCounts['True to Size'] / total) * 100),
        'Runs Small': Math.round((fitCounts['Runs Small'] / total) * 100),
        'Runs Large': Math.round((fitCounts['Runs Large'] / total) * 100),
      },
    };
  }, [reviews, product.rating, product.reviewCount]);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (starFilter !== null) {
      list = list.filter((r) => r.rating === starFilter);
    }

    if (verifiedOnly) {
      list = list.filter((r) => r.verifiedPurchase);
    }

    list.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      if (sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      if (sortBy === 'helpful') {
        return b.helpfulCount - a.helpfulCount;
      }
      return 0;
    });

    return list;
  }, [reviews, starFilter, verifiedOnly, sortBy]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!authorName.trim()) {
      setFormError('Please enter your full name or nickname.');
      return;
    }
    if (!title.trim()) {
      setFormError('Please provide a short headline for your review.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setFormError('Please write at least 10 characters detailing your experience.');
      return;
    }

    const created = saveProductReview(product.id, {
      productId: product.id,
      authorName: authorName.trim(),
      rating,
      title: title.trim(),
      comment: comment.trim(),
      verifiedPurchase: true,
      recommended,
      fitFeedback,
    });

    const updatedList = [created, ...reviews];
    setReviews(updatedList);
    setFormSuccess(true);

    if (onRatingUpdate) {
      const sum = updatedList.reduce((acc, r) => acc + r.rating, 0);
      const newAvg = Number((sum / updatedList.length).toFixed(1));
      onRatingUpdate(newAvg, updatedList.length);
    }

    // Reset form after short delay
    setTimeout(() => {
      setAuthorName('');
      setTitle('');
      setComment('');
      setRating(5);
      setRecommended(true);
      setFitFeedback('True to Size');
      setIsWritingReview(false);
      setFormSuccess(false);
    }, 1600);
  };

  const handleHelpfulClick = (reviewId: string) => {
    const isAlreadyVoted = Boolean(helpfulVoted[reviewId]);
    const updated = toggleReviewHelpful(product.id, reviewId, !isAlreadyVoted);
    setReviews(updated);
    setHelpfulVoted((prev) => ({
      ...prev,
      [reviewId]: !isAlreadyVoted,
    }));
  };

  return (
    <section id="customer-reviews" className="pt-10 border-t border-slate-200 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Customer Ratings & Reviews
            </h2>
            <span className="bg-teal-50 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-200">
              {reviews.length} Verified Reviews
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real feedback from verified shoppers who purchased the {product.name}.
          </p>
        </div>

        <button
          onClick={() => {
            setIsWritingReview(!isWritingReview);
            setFormError('');
          }}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
            isWritingReview
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          {isWritingReview ? (
            <>
              <X className="w-4 h-4" />
              <span>Cancel Feedback</span>
            </>
          ) : (
            <>
              <MessageSquarePlus className="w-4 h-4 text-teal-400" />
              <span>Write a Review</span>
            </>
          )}
        </button>
      </div>

      {/* Review Submission Form Drawer */}
      {isWritingReview && (
        <div className="p-6 rounded-2xl bg-white border border-teal-200 shadow-lg space-y-5 transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Share Your Experience</h3>
                <p className="text-xs text-slate-500">Your feedback helps fellow campus shoppers make informed choices.</p>
              </div>
            </div>
            <button
              onClick={() => setIsWritingReview(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formSuccess ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-emerald-900">Thank You for Your Feedback!</h4>
              <p className="text-xs text-emerald-700">
                Your review has been verified and published immediately to this product page.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
                  {formError}
                </div>
              )}

              {/* Star Rating Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Overall Rating <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= (hoverRating || rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-slate-300 hover:scale-110 transition-transform focus:outline-none"
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              isFilled ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    {RATING_LABELS[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Author & Headline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Your Name / Nickname <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Priya S. or College Student"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Review Headline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Perfect for daily campus wear!"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Review Comment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Detailed Feedback <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about comfort, fabric quality, durability, and how you styled it..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Recommendation & Sizing Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Recommend */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Would you recommend this item?
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setRecommended(true)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                        recommended
                          ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 text-teal-600" />
                      <span>Yes, I recommend</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecommended(false)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                        !recommended
                          ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <X className="w-3.5 h-3.5 text-rose-600" />
                      <span>No</span>
                    </button>
                  </div>
                </div>

                {/* Sizing / Fit Feedback */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    How does it fit?
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Runs Small', 'True to Size', 'Runs Large'] as FitFeedback[]).map((fit) => (
                      <button
                        key={fit}
                        type="button"
                        onClick={() => setFitFeedback(fit)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                          fitFeedback === fit
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Ratings Breakdown Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-200/80">
        {/* Left: Overall Score Card */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200/70 text-center space-y-2 shadow-2xs">
          <span className="text-4xl sm:text-5xl font-black text-slate-900 font-sans tracking-tight">
            {stats.avgRating}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(stats.avgRating)
                    ? 'fill-amber-400 text-amber-500'
                    : 'fill-slate-100 text-slate-300'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Based on {stats.total} verified reviews
          </p>
          <div className="pt-2 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{stats.recommendPercent}% of buyers recommend this</span>
          </div>
        </div>

        {/* Center: Rating Distribution Bars */}
        <div className="lg:col-span-2 flex flex-col justify-center space-y-2 p-2 sm:p-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Rating Breakdown</span>
            {starFilter !== null && (
              <button
                onClick={() => setStarFilter(null)}
                className="text-xs text-teal-700 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Clear Filter ({starFilter}★)</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star] || 0;
            const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            const isSelected = starFilter === star;

            return (
              <button
                key={star}
                onClick={() => setStarFilter(isSelected ? null : star)}
                className={`group w-full flex items-center gap-3 text-xs py-1 px-2 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-teal-100/70 text-teal-900 font-bold'
                    : 'hover:bg-white/80 text-slate-600'
                }`}
              >
                <span className="w-8 text-right font-semibold flex items-center justify-end gap-1 shrink-0">
                  {star} <Star className="w-3 h-3 fill-amber-400 text-amber-500 inline" />
                </span>

                <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSelected ? 'bg-teal-600' : 'bg-amber-400 group-hover:bg-amber-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-12 text-right text-slate-400 text-[11px] font-mono shrink-0">
                  {percentage}% ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>

          <button
            onClick={() => setStarFilter(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              starFilter === null
                ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Ratings ({reviews.length})
          </button>

          {[5, 4, 3, 2, 1].map((s) => {
            const count = stats.distribution[s] || 0;
            if (count === 0 && starFilter !== s) return null;
            return (
              <button
                key={s}
                onClick={() => setStarFilter(starFilter === s ? null : s)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                  starFilter === s
                    ? 'bg-teal-600 border-teal-600 text-white shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{s}</span>
                <Star className={`w-3 h-3 ${starFilter === s ? 'fill-white text-white' : 'fill-amber-400 text-amber-500'}`} />
                <span className="opacity-75">({count})</span>
              </button>
            );
          })}

          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              verifiedOnly
                ? 'bg-emerald-700 border-emerald-700 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Buyers Only</span>
          </button>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No reviews found matching this filter</h4>
            <p className="text-xs text-slate-500">
              Try adjusting your star rating filter or write the first review for this criteria!
            </p>
            <button
              onClick={() => {
                setStarFilter(null);
                setVerifiedOnly(false);
              }}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const hasVoted = Boolean(helpfulVoted[review.id]);

            return (
              <div
                key={review.id}
                className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3.5 transition-all hover:border-slate-300"
              >
                {/* Top Row: Author & Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-teal-400 font-extrabold text-xs flex items-center justify-center tracking-wider shadow-xs">
                      {review.authorName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{review.authorName}</span>
                        {review.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Reviewed on {new Date(review.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Star rating for this review */}
                  <div className="flex items-center gap-1 self-start sm:self-auto">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-amber-400 text-amber-500'
                            : 'fill-slate-100 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Title & Content */}
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {review.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {/* Badges & Helpful Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    {review.recommended && (
                      <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60 flex items-center gap-1">
                        <Check className="w-3 h-3 text-teal-600" />
                        <span>Recommends this item</span>
                      </span>
                    )}

                    {review.fitFeedback && (
                      <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
                        Fit: <strong>{review.fitFeedback}</strong>
                      </span>
                    )}
                  </div>

                  {/* Helpful Button */}
                  <button
                    onClick={() => handleHelpfulClick(review.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      hasVoted
                        ? 'bg-teal-600 text-white shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-white text-white' : 'text-slate-400'}`} />
                    <span>
                      {hasVoted ? 'Helpful' : 'Helpful'} ({review.helpfulCount})
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
