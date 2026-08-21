import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  Send,
  User,
  ShoppingBag,
  Layers,
  RotateCcw,
  Tag,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Filter,
  DollarSign
} from 'lucide-react';
import { ChatMessage, ExtractedIntent, RecommendationRationale } from '../types';
import { sendChatMessage } from '../services/api';
import { AIRecommendationCard } from '../components/AIRecommendationCard';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { PRODUCTS } from '../data/products';

const INITIAL_SUGGESTIONS = [
  'I need a black dress under ₹2000 for a college event.',
  'I need comfortable sneakers under ₹3000 for daily college use.',
  'Find a thoughtful birthday gift under ₹1500.',
  'Show me waterproof laptop backpacks for university.',
  'Recommend oversized cotton shirts for summer.',
];

export const AssistantPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToCompare } = useCompare();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentIntent, setCurrentIntent] = useState<ExtractedIntent>({});
  const [poweredBy, setPoweredBy] = useState<'gemini' | 'rule-engine'>('gemini');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQueryProcessedRef = useRef(false);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'msg-welcome',
        role: 'assistant',
        content: `Hello! I am **ShopAgent AI**, your personal shopping assistant. 
Tell me what you're looking for, your budget, preferred color, or the occasion. 

For example:
• *"I need a black dress under ₹2000 for a college event."*
• *"Show me comfortable sneakers under ₹3000."*
• *"Which one is better for daily college walking?"*

I will discover relevant products, explain why they match, and can even add items directly to your cart!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpSuggestions: INITIAL_SUGGESTIONS,
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Process query param if passed via URL e.g. /assistant?q=...
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !initialQueryProcessedRef.current) {
      initialQueryProcessedRef.current = true;
      handleSendMessage(q);
      // Clean query param
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation history for context memory
      const history = messages
        .filter((m) => m.id !== 'msg-welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await sendChatMessage({
        message: text,
        history,
        currentIntent,
      });

      setPoweredBy(response.poweredBy);
      if (response.extractedIntent) {
        setCurrentIntent(response.extractedIntent);
      }

      // Execute Agent Action if detected (e.g. Add to cart)
      if (response.agentAction && response.agentAction.type === 'ADD_TO_CART' && response.agentAction.productId) {
        const prod = PRODUCTS.find((p) => p.id === response.agentAction?.productId);
        if (prod) {
          addToCart(prod, 1, prod.colors[0], prod.sizes?.[0]);
        }
      } else if (response.agentAction && response.agentAction.type === 'COMPARE' && response.agentAction.productIds) {
        response.agentAction.productIds.forEach((pid) => {
          const prod = PRODUCTS.find((p) => p.id === pid);
          if (prod) addToCompare(prod);
        });
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: response.recommendations,
        agentAction: response.agentAction,
        extractedIntent: response.extractedIntent,
        followUpSuggestions: response.followUpSuggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I ran into an issue connecting to the AI service. Don't worry, you can try asking again or explore our catalog directly!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpSuggestions: INITIAL_SUGGESTIONS,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleResetConversation = () => {
    setCurrentIntent({});
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Conversation reset! What can I help you find today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpSuggestions: INITIAL_SUGGESTIONS,
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8.5rem)] min-h-[620px]">
        {/* Left Agent Context & Parameters Panel (Desktop) */}
        <div className="hidden lg:flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs p-5 justify-between">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-700 flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">ShopAgent AI</h3>
                  <span className="text-[11px] text-teal-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    Agent Active
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Autonomous commerce assistant parsing budget limits, styles, colors, and occasions.
              </p>
            </div>

            {/* Extracted Intent Tracker */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-teal-600" />
                  Active Context
                </span>
                {Object.keys(currentIntent).length > 0 && (
                  <button
                    onClick={() => setCurrentIntent({})}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              {Object.keys(currentIntent).length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-400 text-center">
                  Start typing to build contextual shopping memory...
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {currentIntent.category && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-teal-50/80 text-teal-900 border border-teal-200/60 font-medium">
                      <span className="text-teal-700 text-[11px]">Category:</span>
                      <span className="font-bold">{currentIntent.category}</span>
                    </div>
                  )}

                  {currentIntent.budgetMax && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/80 text-emerald-900 border border-emerald-200/60 font-medium">
                      <span className="text-emerald-700 text-[11px]">Max Budget:</span>
                      <span className="font-bold">₹{currentIntent.budgetMax.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {currentIntent.colors && currentIntent.colors.length > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 text-slate-800 font-medium">
                      <span className="text-slate-500 text-[11px]">Colors:</span>
                      <span className="capitalize">{currentIntent.colors.join(', ')}</span>
                    </div>
                  )}

                  {currentIntent.occasions && currentIntent.occasions.length > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 text-slate-800 font-medium">
                      <span className="text-slate-500 text-[11px]">Occasion:</span>
                      <span className="capitalize">{currentIntent.occasions.join(', ')}</span>
                    </div>
                  )}

                  {currentIntent.styles && currentIntent.styles.length > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 text-slate-800 font-medium">
                      <span className="text-slate-500 text-[11px]">Style / Preference:</span>
                      <span className="capitalize">{currentIntent.styles.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quick Refinements
              </span>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleSendMessage('Show me cheaper options under ₹1500')}
                  className="w-full text-left text-xs p-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between transition-colors"
                >
                  <span>Filter under ₹1500</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSendMessage('Show something more comfortable with memory foam')}
                  className="w-full text-left text-xs p-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between transition-colors"
                >
                  <span>Prioritize Comfort</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSendMessage('Compare the top 2 options')}
                  className="w-full text-left text-xs p-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between transition-colors"
                >
                  <span>Compare Top Options</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSendMessage('Add the best recommended item to my cart')}
                  className="w-full text-left text-xs p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-medium flex items-center justify-between transition-colors border border-teal-200/60"
                >
                  <span>Add Best to Cart</span>
                  <ShoppingBag className="w-3.5 h-3.5 text-teal-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Reset Button */}
          <button
            onClick={handleResetConversation}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Conversation</span>
          </button>
        </div>

        {/* Center Main Chat Experience (3 cols on desktop) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {/* Assistant Header */}
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-900 text-sm sm:text-base">ShopAgent AI Assistant</h2>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded">
                    Live Engine
                  </span>
                </div>
                <p className="text-xs text-slate-500">Autonomous conversational product discovery & checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetConversation}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 text-xs flex items-center gap-1 transition-colors"
                title="Reset Conversation"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Transcript / Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Assistant Avatar */}
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`flex flex-col space-y-3 max-w-2xl ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Text Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      message.role === 'user'
                        ? 'bg-teal-600 text-white rounded-tr-none shadow-md'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                    }`}
                  >
                    {message.content}
                  </div>

                  {/* Agentic Action Notification if applied */}
                  {message.agentAction?.type === 'ADD_TO_CART' && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Item successfully added to your cart!</span>
                      <button
                        onClick={() => navigate('/cart')}
                        className="ml-auto underline hover:text-emerald-950 font-bold"
                      >
                        View Cart →
                      </button>
                    </div>
                  )}

                  {/* Embedded Product Recommendations */}
                  {message.recommendations && message.recommendations.length > 0 && (
                    <div className="w-full space-y-2.5 pt-1">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                        <span>Top Matching Products ({message.recommendations.length}):</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {message.recommendations.map((rec) => (
                          <AIRecommendationCard
                            key={rec.productId}
                            product={rec.product}
                            rationale={rec.rationale}
                            matchScore={rec.matchScore}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Suggestion Chips */}
                  {message.followUpSuggestions && message.followUpSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {message.followUpSuggestions.map((sugg, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(sugg)}
                          className="text-xs bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-700 font-medium px-3 py-1 rounded-full border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-teal-600" />
                          <span>{sugg}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-400 px-1">
                    {message.timestamp}
                  </span>
                </div>

                {/* User Avatar */}
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </div>
                <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-3 text-sm text-slate-600 shadow-xs flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    ShopAgent AI is analyzing 28 products & ranking matches...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
              <div className="relative flex-grow">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Describe what you need (e.g. 'black dress under ₹2000 for college fest', 'add the best one to cart')..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-3 focus:ring-teal-500/10 text-sm text-slate-800 placeholder-slate-400 transition-all focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs"
              >
                <span>Send</span>
                <Send className="w-4 h-4 text-teal-400" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
