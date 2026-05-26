/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Star, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Shield, 
  Waves, 
  Cpu,
  ArrowRight,
  Search,
  Trophy,
  Gift,
  Heart,
  ShoppingBag,
  TrendingUp,
  User as UserIcon,
  Coins,
  Award,
  Activity,
  Target,
  Share2,
  MessageSquare,
  ShoppingCart,
  Package,
  CreditCard,
  Filter,
  Trash2,
  Plus,
  Minus,
  ChevronLeft,
  Users,
  Facebook,
  MessageCircle,
  Clock,
  Mail,
  FileText,
  Layout,
  Sparkles,
  Send,
  Check,
  Play,
  Lock,
  Radio
} from 'lucide-react';
import { 
  GOPRO_MODELS, 
  BADGES, 
  VIRTUAL_ITEMS, 
  LEADERBOARD, 
  SHOP_PRODUCTS, 
  GROUP_BUYS, 
  GROUP_BUY_LEADERBOARD,
  FUNNEL_ADS,
  TARGET_AUDIENCES,
  FUNNEL_EMAILS
} from './constants';
import { 
  GoProModel, 
  UserProfile, 
  VirtualItem, 
  ShopProduct, 
  CartItem, 
  GroupBuy,
  AdCampaign,
  TargetAudience,
  FunnelEmail 
} from './types';
import { AIChat } from './components/AIChat';
import { AIStartupSystem } from './components/AIStartupSystem';
import { getReviewSummary } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setRotateX(rotateX);
    setRotateY(rotateY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ transformStyle: 'preserve-3d' }}
      className="relative group cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const [selectedModel, setSelectedModel] = useState<GoProModel>(GOPRO_MODELS[0]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'gamification' | 'compare' | 'quiz' | 'shop' | 'cart' | 'groupbuy' | 'funnel' | 'startup'>('startup');
  const [funnelStep, setFunnelStep] = useState<'ta' | 'ads' | 'leads' | 'giveaway' | 'email' | 'sales'>('ta');

  // Funnel State
  const [leadInfo, setLeadInfo] = useState({ email: '', name: '' });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isGeneratingEbook, setIsGeneratingEbook] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<'video' | 'guide'>('video');
  const [currentChapter, setCurrentChapter] = useState(0);
  const [emailTemplate, setEmailTemplate] = useState<'welcome' | 'tech' | 'case_study' | 'faq' | 'closing'>('welcome');

  const EBOOK_CHAPTERS = [
    {
      title: "第一章：5.3K 錄影設定",
      content: "要在 GoPro 上獲得最佳畫質，請確保開啟 5.3K 60FPS。對於色彩空間，建議使用 10-Bit Color 以便後期調色。快門速度建議設定為幀率的兩倍（1/120s）。",
      image: "https://picsum.photos/seed/cs1/800/400"
    },
    {
      title: "第二章：HyperSmooth 6.0 實戰",
      content: "在顛簸的山路騎行時，請開啟 Auto Boost。這會稍微增加裁切率，但能保證地平線永遠水平。如果是手持行走，Standard 模式就足夠了。",
      image: "https://picsum.photos/seed/cs2/800/400"
    },
    {
      title: "第三章：創意視角 (POV)",
      content: "使用嘴咬式固定座或胸帶能拍出身歷其境的第一人稱視角。記得將鏡頭稍微向下傾斜 15 度，這樣能拍到雙手或載具，增加空間感。",
      image: "https://picsum.photos/seed/cs3/800/400"
    }
  ];

  // Shopping State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shopFilter, setShopFilter] = useState<'all' | 'camera' | 'mount' | 'battery' | 'case'>('all');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Comparison State
  const [compareList, setCompareList] = useState<GoProModel[]>([]);
  
  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<GoProModel | null>(null);

  // User Reviews State
  const [userReviews, setUserReviews] = useState<Record<string, { rating: number; comment: string; date: string }[]>>({});
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // User State
  const [user, setUser] = useState<UserProfile>({
    name: '林小明',
    level: 12,
    exp: 2400,
    points: 1250,
    badges: BADGES.filter(b => b.unlocked),
    inventory: []
  });

  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsSummarizing(true);
      setAiSummary('');
      const summary = await getReviewSummary(selectedModel);
      setAiSummary(summary);
      setIsSummarizing(false);
    };
    fetchSummary();
  }, [selectedModel]);

  const handleBuyItem = (item: VirtualItem) => {
    if (user.points >= item.price) {
      setUser(prev => ({
        ...prev,
        points: prev.points - item.price,
        inventory: [...prev.inventory, item]
      }));
      triggerToast(`成功購買 ${item.name}！`);
    } else {
      triggerToast('積分不足！');
    }
  };

  const handleDonate = () => {
    if (user.points >= 100) {
      setUser(prev => ({ ...prev, points: prev.points - 100 }));
      triggerToast('感謝您的捐贈！已為海洋保護基金會貢獻 100 積分。');
    } else {
      triggerToast('積分不足以捐贈！');
    }
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const addToCart = (product: ShopProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    triggerToast(`已將 ${product.name} 加入購物車！`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col data-grid selection:bg-accent selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 glass-panel rounded-none border-x-0 border-t-0 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-accent p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-display">
            GOPRO<span className="text-accent">HUB</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 bg-white/5 px-6 py-2.5 rounded-full border border-line">
            <div className="flex items-center gap-2 text-yellow-400">
              <Coins className="w-4 h-4" />
              <span className="font-bold text-sm mono-value">{user.points.toLocaleString()}</span>
            </div>
            <div className="w-px h-4 bg-line" />
            <div className="flex items-center gap-2 text-accent">
              <Activity className="w-4 h-4" />
              <span className="font-bold text-sm mono-value">LV.{user.level}</span>
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-text-secondary">
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`transition-all hover:text-accent ${activeTab === 'reviews' ? 'text-accent' : ''}`}
            >
              產品評價
            </button>
            <button 
              onClick={() => setActiveTab('compare')}
              className={`transition-all hover:text-accent ${activeTab === 'compare' ? 'text-accent' : ''}`}
            >
              機型對比
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`transition-all hover:text-accent ${activeTab === 'quiz' ? 'text-accent' : ''}`}
            >
              選購助手
            </button>
            <button 
              onClick={() => setActiveTab('shop')}
              className={`transition-all hover:text-accent ${activeTab === 'shop' ? 'text-accent' : ''}`}
            >
              官方商城
            </button>
            <button 
              onClick={() => setActiveTab('groupbuy')}
              className={`transition-all hover:text-accent ${activeTab === 'groupbuy' ? 'text-accent' : ''}`}
            >
              團購專區
            </button>
             <button 
              onClick={() => setActiveTab('startup')}
              className={`transition-all hover:text-accent ${activeTab === 'startup' ? 'text-accent' : ''}`}
            >
              AI 創業系統
            </button>
            <button 
              onClick={() => setActiveTab('funnel')}
              className={`transition-all hover:text-accent ${activeTab === 'funnel' ? 'text-accent' : ''}`}
            >
              行銷漏斗
            </button>
            <button 
              onClick={() => setActiveTab('gamification')}
              className={`transition-all hover:text-accent ${activeTab === 'gamification' ? 'text-accent' : ''}`}
            >
              遊戲中心
            </button>
            <div className="h-8 w-px bg-line mx-2" />
            <button 
              onClick={() => setActiveTab('cart')}
              className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <ShoppingCart className={`w-6 h-6 ${activeTab === 'cart' ? 'text-accent' : 'text-text-secondary'}`} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-bg group-hover:scale-110 transition-transform">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
            <button className="bg-accent text-white px-6 py-2.5 rounded-xl hover:bg-accent-hover transition-all flex items-center gap-2 shadow-lg shadow-accent/20 hover-glitch">
              <UserIcon className="w-4 h-4" /> {user.name}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'reviews' ? (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-16"
            >
              {/* Hero Section */}
              <section className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-black uppercase tracking-[0.2em]"
                  >
                    <Target className="w-3.5 h-3.5" />
                    Professional Grade
                  </motion.div>
                  <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter text-display">
                    {selectedModel.name.split(' ').map((word, i) => (
                      <span key={i} className={i === 0 ? 'text-white' : 'text-accent block'}>
                        {word}{' '}
                      </span>
                    ))}
                  </h1>
                  <p className="text-xl text-text-secondary max-w-xl leading-relaxed font-light">
                    {selectedModel.description}
                  </p>
                  <div className="flex items-center gap-6 pt-4">
                    <div className="text-4xl font-black text-white mono-value">{selectedModel.price}</div>
                    <button className="bg-white text-black hover:bg-accent hover:text-white px-10 py-5 rounded-2xl font-black text-display flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl">
                      立即購買 <ArrowRight className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => {
                        if (compareList.find(m => m.id === selectedModel.id)) {
                          setCompareList(prev => prev.filter(m => m.id !== selectedModel.id));
                        } else if (compareList.length < 3) {
                          setCompareList(prev => [...prev, selectedModel]);
                        } else {
                          triggerToast('最多只能對比 3 台機型！');
                        }
                      }}
                      className={`p-5 rounded-2xl border transition-all ${
                        compareList.find(m => m.id === selectedModel.id)
                          ? 'bg-accent/20 border-accent text-accent'
                          : 'bg-white/5 border-line text-white hover:border-accent'
                      }`}
                    >
                      <Share2 className={`w-6 h-6 ${compareList.find(m => m.id === selectedModel.id) ? 'fill-accent' : ''}`} />
                    </button>
                  </div>
                </div>

                <TiltCard>
                  <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <motion.div
                    key={selectedModel.id}
                    initial={{ opacity: 0, rotateY: 20 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-line hardware-border shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                  >
                    <img 
                      src={selectedModel.image} 
                      alt={selectedModel.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end" style={{ transform: 'translateZ(50px)' }}>
                      <div className="space-y-1">
                        <div className="text-[10px] text-accent uppercase font-black tracking-[0.3em]">Release Date</div>
                        <div className="text-3xl font-black text-display">{selectedModel.releaseYear}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1.5 bg-accent px-4 py-2 rounded-xl border border-white/20 shadow-xl">
                          <Star className="w-5 h-5 text-white fill-white" />
                          <span className="font-black text-xl text-display">{selectedModel.rating}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TiltCard>
              </section>

              {/* Model Selector */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-text-secondary">Select Equipment</h2>
                  <div className="h-px flex-1 mx-8 bg-line" />
                </div>
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                  {GOPRO_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`flex-shrink-0 px-8 py-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${
                        selectedModel.id === model.id 
                          ? 'bg-accent border-accent text-white shadow-2xl shadow-accent/40' 
                          : 'bg-card border-line text-text-secondary hover:border-accent/50 hover:bg-white/5'
                      }`}
                    >
                      {selectedModel.id === model.id && (
                        <motion.div 
                          layoutId="active-bg" 
                          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" 
                        />
                      )}
                      <div className="font-black text-xl text-display relative z-10">{model.name}</div>
                      <div className="text-xs font-bold opacity-60 mono-value relative z-10">{model.releaseYear} EDITION</div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (compareList.find(m => m.id === model.id)) {
                            setCompareList(prev => prev.filter(m => m.id !== model.id));
                          } else if (compareList.length < 3) {
                            setCompareList(prev => [...prev, model]);
                          } else {
                            triggerToast('最多只能對比 3 台機型！');
                          }
                        }}
                        className={`absolute top-2 right-2 p-2 rounded-lg transition-all z-20 ${
                          compareList.find(m => m.id === model.id)
                            ? 'bg-white text-accent'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <Share2 className={`w-3.5 h-3.5 ${compareList.find(m => m.id === model.id) ? 'fill-accent' : ''}`} />
                      </button>
                    </button>
                  ))}
                </div>
              </section>

              {/* Specs & AI Summary */}
              <section className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                  <div className="glass-panel p-10 hardware-border">
                    <h3 className="text-3xl font-black text-display flex items-center gap-3 mb-10">
                      <Cpu className="w-8 h-8 text-accent" />
                      Technical Specs
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
                      {Object.entries(selectedModel.specs).map(([key, value]) => (
                        <div key={key} className="space-y-3 group/spec">
                          <div className="flex items-center gap-2 text-[10px] text-text-secondary uppercase font-black tracking-widest group-hover/spec:text-accent transition-colors">
                            <Activity className="w-3 h-3 text-accent" />
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-2xl font-black text-display group-hover/spec:translate-x-1 transition-transform">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-10">
                    <div className="glass-panel p-8 border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                      <h4 className="font-black text-emerald-500 text-display flex items-center gap-2 mb-6">
                        <CheckCircle2 className="w-6 h-6" />
                        Pros
                      </h4>
                      <ul className="space-y-4">
                        {selectedModel.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-text-secondary flex items-start gap-3 group/item">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover/item:scale-150 transition-transform" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass-panel p-8 border-rose-500/20 bg-rose-500/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                      <h4 className="font-black text-rose-500 text-display flex items-center gap-2 mb-6">
                        <XCircle className="w-6 h-6" />
                        Cons
                      </h4>
                      <ul className="space-y-4">
                        {selectedModel.cons.map((con, i) => (
                          <li key={i} className="text-sm text-text-secondary flex items-start gap-3 group/item">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 group-hover/item:scale-150 transition-transform" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 glass-panel p-10 border-accent/30 bg-accent/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-display flex items-center gap-3">
                      <Zap className="w-6 h-6 text-accent" />
                      AI Analysis
                    </h3>
                    {isSummarizing && <Loader2 className="w-5 h-5 animate-spin text-accent" />}
                  </div>
                  <div className="markdown-body text-sm relative z-10">
                    {aiSummary ? (
                      <ReactMarkdown>{aiSummary}</ReactMarkdown>
                    ) : (
                      <div className="space-y-6 animate-pulse">
                        <div className="h-4 bg-white/5 rounded w-3/4" />
                        <div className="h-4 bg-white/5 rounded w-full" />
                        <div className="h-4 bg-white/5 rounded w-5/6" />
                        <div className="h-4 bg-white/5 rounded w-2/3" />
                      </div>
                    )}
                  </div>
                  <div className="mt-10 pt-6 border-t border-white/5">
                    <p className="text-[10px] text-text-secondary italic font-mono uppercase tracking-widest">
                      Powered by Gemini 3.1 Flash
                    </p>
                  </div>
                </div>
              </section>

              {/* User Reviews Section */}
              <section className="space-y-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-display flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-accent" />
                    User Reviews
                  </h2>
                  <button className="text-xs font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl border border-line transition-all">
                    Write a Review
                  </button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { name: 'Alex R.', rating: 5, date: '2 days ago', comment: 'The stabilization on the Hero 12 is absolutely mind-blowing. Perfect for my mountain biking trips!', avatar: 'A' },
                    { name: 'Sarah M.', rating: 4, date: '1 week ago', comment: 'Great image quality, but battery life could be better when shooting in 5.3K. Overall very satisfied.', avatar: 'S' },
                    { name: 'Mike T.', rating: 5, date: '2 weeks ago', comment: 'Upgraded from Hero 9 and the difference is night and day. The new sensor is a game changer.', avatar: 'M' }
                  ].map((review, i) => (
                    <div key={i} className="glass-panel p-8 space-y-6 hardware-border group hover:border-accent/50 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-black text-accent">
                            {review.avatar}
                          </div>
                          <div>
                            <div className="font-black text-sm text-display">{review.name}</div>
                            <div className="text-[10px] text-text-secondary uppercase font-black tracking-widest">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-accent fill-accent' : 'text-white/10'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : activeTab === 'compare' ? (
            <motion.div
              key="compare"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <h2 className="text-5xl font-black text-display">機型對比</h2>
                  <p className="text-text-secondary">選擇最多 3 台機型進行深度規格對比</p>
                </div>
                {compareList.length > 0 && (
                  <button 
                    onClick={() => setCompareList([])}
                    className="text-xs font-black uppercase tracking-widest text-accent hover:underline"
                  >
                    清空對比列表
                  </button>
                )}
              </div>

              {compareList.length === 0 ? (
                <div className="glass-panel p-20 text-center space-y-6 hardware-border">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-10 h-10 text-text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-display">尚未選擇機型</h3>
                    <p className="text-text-secondary">請在產品評價頁面點擊「對比」圖示加入列表</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className="bg-accent text-white px-8 py-4 rounded-xl font-black text-display hover:bg-accent-hover transition-all"
                  >
                    前往挑選
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="hidden md:block space-y-12 pt-64">
                    <div className="h-20 flex items-center text-xs font-black uppercase tracking-widest text-text-secondary">基本資訊</div>
                    {Object.keys(GOPRO_MODELS[0].specs).map(key => (
                      <div key={key} className="h-12 flex items-center text-xs font-black uppercase tracking-widest text-text-secondary">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    ))}
                  </div>
                  
                  {compareList.map((model) => (
                    <div key={model.id} className="glass-panel p-6 space-y-12 hardware-border relative group">
                      <button 
                        onClick={() => setCompareList(prev => prev.filter(m => m.id !== model.id))}
                        className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      
                      <div className="space-y-4">
                        <div className="aspect-video rounded-xl overflow-hidden border border-line">
                          <img src={model.image} alt={model.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-display">{model.name}</h3>
                          <div className="text-accent font-black mono-value">{model.price}</div>
                        </div>
                      </div>

                      <div className="space-y-12">
                        <div className="h-20 flex flex-col justify-center gap-1">
                          <div className="text-[10px] md:hidden font-black uppercase tracking-widest text-text-secondary">Release</div>
                          <div className="text-lg font-black text-white mono-value">{model.releaseYear}</div>
                        </div>
                        {Object.entries(model.specs).map(([key, value]) => (
                          <div key={key} className="h-12 flex flex-col justify-center gap-1">
                            <div className="text-[10px] md:hidden font-black uppercase tracking-widest text-text-secondary">{key}</div>
                            <div className="text-sm font-bold text-white mono-value truncate">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : activeTab === 'quiz' ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-6xl font-black text-display">選購助手</h2>
                <p className="text-text-secondary">回答幾個簡單問題，我們將為您推薦最適合的 GoPro</p>
              </div>

              <div className="glass-panel p-12 hardware-border relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1 bg-accent transition-all duration-500" style={{ width: `${(quizStep / 4) * 100}%` }} />
                
                {quizResult ? (
                  <div className="text-center space-y-8 py-8">
                    <div className="space-y-2">
                      <div className="text-accent font-black uppercase tracking-[0.3em] text-xs">推薦機型</div>
                      <h3 className="text-5xl font-black text-display">{quizResult.name}</h3>
                    </div>
                    <div className="aspect-video max-w-md mx-auto rounded-3xl overflow-hidden border border-line shadow-2xl">
                      <img src={quizResult.image} alt={quizResult.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <p className="text-text-secondary max-w-md mx-auto">{quizResult.description}</p>
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => {
                          setSelectedModel(quizResult);
                          setActiveTab('reviews');
                        }}
                        className="bg-accent text-white px-10 py-4 rounded-xl font-black text-display hover:bg-accent-hover transition-all"
                      >
                        查看詳情
                      </button>
                      <button 
                        onClick={() => {
                          if (compareList.find(m => m.id === quizResult.id)) {
                            setCompareList(prev => prev.filter(m => m.id !== quizResult.id));
                          } else if (compareList.length < 3) {
                            setCompareList(prev => [...prev, quizResult]);
                            triggerToast('已加入對比列表！');
                          } else {
                            triggerToast('最多只能對比 3 台機型！');
                          }
                        }}
                        className={`px-10 py-4 rounded-xl font-black text-display transition-all border-2 ${
                          compareList.find(m => m.id === quizResult.id)
                            ? 'bg-accent/20 border-accent text-accent'
                            : 'bg-white/5 border-line text-white hover:border-accent'
                        }`}
                      >
                        {compareList.find(m => m.id === quizResult.id) ? '已在對比中' : '加入對比'}
                      </button>
                      <button 
                        onClick={() => {
                          setQuizResult(null);
                          setQuizStep(0);
                          setQuizAnswers({});
                        }}
                        className="bg-white/5 text-white px-10 py-4 rounded-xl font-black text-display hover:bg-white/10 transition-all"
                      >
                        重新測試
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="text-accent font-black mono-value">QUESTION 0{quizStep + 1} / 04</div>
                      <h3 className="text-3xl font-black text-display">
                        {quizStep === 0 && "您主要的拍攝用途是什麼？"}
                        {quizStep === 1 && "您最在意的功能是？"}
                        {quizStep === 2 && "您的預算範圍？"}
                        {quizStep === 3 && "您是否需要極致的防抖性能？"}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(quizStep === 0 ? ['極限運動', '日常 VLOG', '旅遊記錄', '專業創作'] :
                        quizStep === 1 ? ['影像解析度', '電池續航', '機身大小', '操作簡易度'] :
                        quizStep === 2 ? ['預算充足', '追求性價比', '入門首選'] :
                        ['非常需要', '一般即可']
                      ).map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            const newAnswers = { ...quizAnswers, [quizStep]: option };
                            setQuizAnswers(newAnswers);
                            if (quizStep < 3) {
                              setQuizStep(quizStep + 1);
                            } else {
                              // Improved recommendation logic
                              let recommended = GOPRO_MODELS[0];
                              if (newAnswers[0] === '極限運動' || newAnswers[1] === '影像解析度') {
                                recommended = GOPRO_MODELS.find(m => m.id === 'hero12') || GOPRO_MODELS[0];
                              } else if (newAnswers[0] === '日常 VLOG' || newAnswers[1] === '機身大小') {
                                recommended = GOPRO_MODELS.find(m => m.id === 'hero11-mini') || GOPRO_MODELS[1];
                              } else if (newAnswers[2] === '入門首選') {
                                recommended = GOPRO_MODELS.find(m => m.id === 'hero11') || GOPRO_MODELS[2];
                              }
                              setQuizResult(recommended);
                            }
                          }}
                          className="p-6 rounded-2xl border border-line bg-white/5 text-left hover:border-accent hover:bg-accent/5 transition-all group"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">{option}</span>
                            <ChevronRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeTab === 'shop' ? (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                  <h2 className="text-6xl font-black text-display">官方商城</h2>
                  <p className="text-text-secondary">探索專業級拍攝裝備與配件</p>
                </div>
                <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-line">
                  {['all', 'camera', 'mount', 'battery', 'case'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setShopFilter(cat as any)}
                      className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        shopFilter === cat ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-white'
                      }`}
                    >
                      {cat === 'all' ? '全部' : cat === 'camera' ? '相機' : cat === 'mount' ? '固定座' : cat === 'battery' ? '電池' : '保護殼'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {SHOP_PRODUCTS.filter(p => shopFilter === 'all' || p.category === shopFilter).map((product) => (
                  <div key={product.id} className="glass-panel group hardware-border overflow-hidden flex flex-col">
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-full bg-white text-black py-4 rounded-xl font-black text-display flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                        >
                          <ShoppingCart className="w-5 h-5" /> 加入購物車
                        </button>
                      </div>
                      {product.stock < 10 && (
                        <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                          僅剩 {product.stock} 件
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="text-[10px] text-accent font-black uppercase tracking-widest">{product.category}</div>
                        <h3 className="text-xl font-black text-display group-hover:text-accent transition-colors">{product.name}</h3>
                        <p className="text-xs text-text-secondary line-clamp-2 font-light">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-line">
                        <div className="text-2xl font-black text-white mono-value">${product.price}</div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-3.5 h-3.5 fill-yellow-400" />
                          <span className="text-xs font-black mono-value">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : activeTab === 'cart' ? (
            <motion.div
              key="cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTab('shop')}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-5xl font-black text-display">您的購物車</h2>
              </div>

              {cart.length === 0 ? (
                <div className="glass-panel p-20 text-center space-y-8 hardware-border">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingCart className="w-12 h-12 text-text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-display">購物車是空的</h3>
                    <p className="text-text-secondary">快去商城挑選一些專業裝備吧！</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('shop')}
                    className="bg-accent text-white px-10 py-4 rounded-xl font-black text-display hover:bg-accent-hover transition-all"
                  >
                    前往商城
                  </button>
                </div>
              ) : (
                <div className="grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-8 space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="glass-panel p-6 hardware-border flex gap-8 group">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden border border-line flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-black text-display group-hover:text-accent transition-colors">{item.name}</h3>
                              <p className="text-xs text-text-secondary font-light">{item.category}</p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-text-secondary hover:text-rose-500 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-line">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-2 hover:text-accent transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-black mono-value">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-2 hover:text-accent transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-2xl font-black text-white mono-value">${item.price * item.quantity}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-8 hardware-border space-y-8 sticky top-32">
                      <h3 className="text-2xl font-black text-display">訂單摘要</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between text-text-secondary">
                          <span>小計</span>
                          <span className="mono-value text-white">${cartTotal}</span>
                        </div>
                        <div className="flex justify-between text-text-secondary">
                          <span>運費</span>
                          <span className="mono-value text-white">$0</span>
                        </div>
                        <div className="h-px bg-line" />
                        <div className="flex justify-between text-xl font-black">
                          <span className="text-display">總計</span>
                          <span className="text-accent mono-value">${cartTotal}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsCheckingOut(true)}
                        className="w-full bg-accent text-white py-5 rounded-2xl font-black text-display flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-98 shadow-xl shadow-accent/20"
                      >
                        <CreditCard className="w-6 h-6" /> 結帳
                      </button>
                      <div className="flex items-center justify-center gap-2 text-[10px] text-text-secondary font-black uppercase tracking-widest">
                        <Shield className="w-3.5 h-3.5" /> 安全支付保障
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : activeTab === 'groupbuy' ? (
            <motion.div
              key="groupbuy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                  <h2 className="text-6xl font-black text-display">團購專區</h2>
                  <p className="text-text-secondary">集結力量，享受極致優惠</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-xl text-blue-500 text-xs font-black">
                    <Facebook className="w-4 h-4" /> FB 團購
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-600/10 border border-green-600/30 rounded-xl text-green-500 text-xs font-black">
                    <MessageCircle className="w-4 h-4" /> LINE 社群
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {GROUP_BUYS.map((deal) => (
                  <div key={deal.id} className="glass-panel hardware-border overflow-hidden flex flex-col group">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={deal.image} 
                        alt={deal.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-accent text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                        {Math.round((1 - deal.price / deal.originalPrice) * 100)}% OFF
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-bg to-transparent">
                        <div className="flex items-center gap-2 text-white text-xs font-black">
                          {deal.platform === 'facebook' ? <Facebook className="w-4 h-4 text-blue-500" /> : 
                           deal.platform === 'line' ? <MessageCircle className="w-4 h-4 text-green-500" /> : 
                           <Users className="w-4 h-4 text-accent" />}
                          {deal.platform.toUpperCase()} 專屬團
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8 space-y-6 flex-1 flex flex-col">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-display group-hover:text-accent transition-colors">{deal.name}</h3>
                        <p className="text-sm text-text-secondary font-light leading-relaxed">{deal.description}</p>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-line">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <div className="text-xs text-text-secondary line-through mono-value">${deal.originalPrice}</div>
                            <div className="text-4xl font-black text-white mono-value">${deal.price}</div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-[10px] text-text-secondary font-black uppercase tracking-widest">已加入人數</div>
                            <div className="text-xl font-black text-accent mono-value">{deal.currentCount} / {deal.targetCount}</div>
                          </div>
                        </div>

                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-line">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(deal.currentCount / deal.targetCount) * 100}%` }}
                            className="h-full bg-accent" 
                          />
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-rose-500 font-black uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5" /> 剩餘時間: {new Date(deal.endTime).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <button 
                          onClick={() => triggerToast(`已成功加入 ${deal.name} 團購！`)}
                          className="flex-1 bg-white text-black hover:bg-accent hover:text-white py-4 rounded-xl font-black text-display transition-all hover:scale-[1.02] active:scale-98"
                        >
                          立即加入
                        </button>
                        <button 
                          onClick={() => triggerToast(`已複製 ${deal.name} 團購連結，快分享給好友！`)}
                          className="p-4 rounded-xl bg-white/5 border border-line hover:border-accent/30 transition-all"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Group Buy Leaderboard & Social Links */}
              <div className="grid lg:grid-cols-12 gap-10">
                {/* Leaderboard */}
                <div className="lg:col-span-4 glass-panel p-10 hardware-border space-y-8">
                  <h3 className="text-xl font-black text-display flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-accent" />
                    團購達人榜
                  </h3>
                  <div className="space-y-4">
                    {GROUP_BUY_LEADERBOARD.map((entry) => (
                      <div key={entry.rank} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group">
                        <div className="flex items-center gap-4">
                          <span className={`w-6 text-center font-black text-display text-xl ${entry.rank <= 3 ? 'text-accent' : 'text-text-secondary opacity-30'}`}>
                            {entry.rank}
                          </span>
                          <div>
                            <div className="font-black text-sm text-display group-hover:text-accent transition-colors">{entry.name}</div>
                            <div className="text-[10px] text-text-secondary uppercase font-black tracking-widest">累計參團: {entry.count} 次</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-accent mono-value">已省下</div>
                          <div className="text-sm font-black text-white mono-value">${entry.saved.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links Section */}
                <div className="lg:col-span-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="glass-panel p-10 hardware-border bg-blue-600/5 border-blue-600/20 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-600 rounded-2xl">
                          <Facebook className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-display">FB 官方團購社團</h4>
                          <p className="text-sm text-text-secondary">加入社團，獲取第一手團購資訊與專屬優惠碼</p>
                        </div>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-display hover:bg-blue-700 transition-all">
                        前往 FB 社團
                      </button>
                    </div>

                    <div className="glass-panel p-10 hardware-border bg-green-600/5 border-green-600/20 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-green-600 rounded-2xl">
                          <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-display">LINE 官方社群</h4>
                          <p className="text-sm text-text-secondary">即時通知快閃團購，與同好交流拍攝心得</p>
                        </div>
                      </div>
                      <button className="w-full bg-green-600 text-white py-4 rounded-xl font-black text-display hover:bg-green-700 transition-all">
                        加入 LINE 社群
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'funnel' ? (
            <motion.div
              key="funnel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="space-y-12"
            >
              {/* Funnel Navigation Steps */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                  { id: 'ta', label: '1. TA 目標族群', icon: Target },
                  { id: 'ads', label: '2. 廣告投放', icon: Radio },
                  { id: 'leads', label: '3. 名單蒐集', icon: UserIcon },
                  { id: 'giveaway', label: '4. 免費贈品', icon: Gift },
                  { id: 'email', label: '5. 自動回覆', icon: Mail },
                  { id: 'sales', label: '6. 銷售頁面', icon: Layout },
                ].map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setFunnelStep(step.id as any)}
                    className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                      funnelStep === step.id ? 'bg-accent text-white shadow-xl' : 'bg-white/5 text-text-secondary hover:bg-white/10'
                    }`}
                  >
                    {step.id === 'ads' ? <TrendingUp className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                    <span className="font-bold text-[10px] uppercase tracking-wider">{step.label}</span>
                  </button>
                ))}
              </div>

              {funnelStep === 'ta' && (
                <div className="max-w-5xl mx-auto space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black text-display">Target Audience (TA) 精準鎖定</h2>
                    <p className="text-text-secondary">在開始投放廣告前，我們先定義產品的最佳買家模型。</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {TARGET_AUDIENCES.map(ta => (
                      <div key={ta.id} className="glass-panel p-10 hardware-border space-y-6 hover:border-accent transition-all group">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="text-[10px] text-accent font-black uppercase tracking-widest leading-none">TA 模型 {ta.id.split('-')[1]}</div>
                            <h3 className="text-2xl font-black text-display">{ta.segment}</h3>
                          </div>
                          <div className="bg-accent/10 px-3 py-1 rounded-full text-[10px] font-black text-accent">{ta.age} 歲</div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="text-[10px] font-black text-text-secondary uppercase mb-2">興趣標籤</div>
                            <div className="flex flex-wrap gap-2">
                              {ta.interests.map(i => <span key={i} className="px-2 py-1 bg-white/5 border border-line rounded-lg text-[10px] text-white">{i}</span>)}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                              <div className="text-[10px] font-black text-red-500 uppercase mb-2">痛點 (Pain Points)</div>
                              <ul className="text-xs space-y-1 text-text-secondary">
                                {ta.painPoints.map(p => <li key={p} className="flex gap-2"><span>-</span> {p}</li>)}
                              </ul>
                            </div>
                            <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
                              <div className="text-[10px] font-black text-green-500 uppercase mb-2">渴望 (Desires)</div>
                              <p className="text-xs text-text-secondary">{ta.desire}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center pt-8">
                    <button 
                      onClick={() => setFunnelStep('ads')}
                      className="bg-accent text-white px-10 py-4 rounded-xl font-black text-display hover:bg-accent-hover transition-all flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95"
                    >
                      確認目標族群，開始規劃廣告 <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {funnelStep === 'ads' && (
                <div className="max-w-5xl mx-auto space-y-12">
                   <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black text-display">流量廣告投放 (Traffic Ads)</h2>
                    <p className="text-text-secondary">多渠道引流，將潛在客群引導至名單蒐集頁面。</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    {FUNNEL_ADS.map(ad => (
                      <div key={ad.id} className="glass-panel hardware-border overflow-hidden group">
                        <div className="relative aspect-video">
                          <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-4 left-4 flex gap-2">
                            <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase text-white shadow-lg ${ad.platform === 'facebook' ? 'bg-[#1877F2]' : 'bg-gradient-to-tr from-[#F58529] via-[#D11E8E] to-[#693CBC]'}`}>
                              {ad.platform} AD
                            </div>
                          </div>
                        </div>
                        <div className="p-8 space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-xl font-black text-display">{ad.title}</h4>
                            <p className="text-sm text-text-secondary font-light">{ad.content}</p>
                          </div>
                          <div className="p-4 bg-accent/5 border border-dashed border-accent/30 rounded-xl">
                            <div className="text-[10px] font-black text-accent uppercase mb-1">廣告掛鉤 (Hook)</div>
                            <div className="text-sm font-bold text-white italic">"{ad.hook}"</div>
                          </div>
                          <button onClick={() => setFunnelStep('leads')} className="w-full py-4 bg-white text-black font-black text-display rounded-xl hover:bg-accent hover:text-white transition-all">
                            {ad.cta}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {funnelStep === 'giveaway' && (
                <div className="max-w-5xl mx-auto space-y-12">
                  {isGeneratingEbook ? (
                    <div className="glass-panel p-20 hardware-border text-center space-y-12 flex flex-col items-center justify-center min-h-[600px]">
                      <div className="relative">
                        <div className="w-32 h-32 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                        <FileText className="w-12 h-12 text-accent absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <div className="space-y-6">
                        <h2 className="text-4xl font-black text-display">正在為 {leadInfo.name} 編譯專屬手冊...</h2>
                        <div className="max-w-md mx-auto space-y-2">
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 3 }}
                              className="h-full bg-accent"
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-text-secondary font-black uppercase tracking-widest">
                            <span>正在封裝 5.3K 優化參數</span>
                            <span>已完成 85%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                      {/* Left: Interactive Reader */}
                      <div className="glass-panel hardware-border overflow-hidden bg-white text-black min-h-[600px] flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm">《GoPro 拍攝大師手冊》- {leadInfo.name} 專屬版</span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold">PAGE {currentChapter + 1} / {EBOOK_CHAPTERS.length}</div>
                        </div>
                        
                        <div className="p-10 flex-1 space-y-8 overflow-y-auto max-h-[500px]">
                          <div className="space-y-4">
                            <div className="text-[10px] text-accent font-black uppercase tracking-widest">CHAPTER 0{currentChapter + 1}</div>
                            <h3 className="text-4xl font-bold leading-tight">{EBOOK_CHAPTERS[currentChapter].title}</h3>
                          </div>
                          <img src={EBOOK_CHAPTERS[currentChapter].image} className="rounded-2xl shadow-lg w-full aspect-video object-cover" />
                          <div className="prose prose-lg">
                            <p className="text-gray-600 leading-relaxed text-lg">
                              {EBOOK_CHAPTERS[currentChapter].content}
                            </p>
                          </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                          <button 
                            disabled={currentChapter === 0}
                            onClick={() => setCurrentChapter(prev => prev - 1)}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold disabled:opacity-30 hover:bg-white transition-all"
                          >
                            上一頁
                          </button>
                          <div className="flex gap-2">
                             {EBOOK_CHAPTERS.map((_, idx) => (
                               <div key={idx} className={`w-2 h-2 rounded-full transition-all ${currentChapter === idx ? 'bg-accent w-4' : 'bg-gray-200'}`} />
                             ))}
                          </div>
                          <button 
                            disabled={currentChapter === EBOOK_CHAPTERS.length - 1}
                            onClick={() => setCurrentChapter(prev => prev + 1)}
                            className="px-4 py-2 bg-black text-white rounded-xl text-sm font-bold disabled:opacity-30 hover:scale-105 transition-all"
                          >
                            下一頁
                          </button>
                        </div>
                      </div>

                      {/* Right: Promotion & Next Step */}
                      <div className="space-y-8">
                        <div className="glass-panel p-10 hardware-border space-y-6">
                          <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">
                            領取成功
                          </div>
                          <h2 className="text-4xl font-black text-display">這份手冊能為您<br />省下 50 小時的自學時間</h2>
                          <p className="text-text-secondary leading-relaxed font-light">
                            我們已經將這份手冊的 PDF 高畫質版寄送到您的信箱：<br />
                            <span className="text-white font-bold">{leadInfo.email}</span>
                          </p>
                          <div className="space-y-4 pt-6 border-t border-line">
                            <h4 className="font-bold text-white text-lg">接下來您可以：</h4>
                            <div className="grid gap-3">
                              {[
                                { t: '完成閱讀解鎖隱藏攻略', d: '閱讀完全部章節可獲得專屬徽章' },
                                { t: '查看信箱領取優惠', d: '包含新手的首張創作者折扣券' }
                              ].map(i => (
                                <div key={i.t} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-line">
                                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-bold text-white">{i.t}</div>
                                    <div className="text-[10px] text-text-secondary">{i.d}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <button 
                            onClick={() => setFunnelStep('email')}
                            className="w-full bg-accent text-white py-5 rounded-2xl font-black text-display text-lg shadow-xl hover:bg-accent-hover transition-all flex items-center justify-center gap-3"
                          >
                            下一步：查看行銷自動回覆流程 <ArrowRight className="w-6 h-6" />
                          </button>
                        </div>
                        
                        <div className="glass-panel p-8 hardware-border flex items-center gap-6">
                          <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
                            <CreditCard className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-white">想跳過學習直接購買？</div>
                            <div className="text-xs text-text-secondary">我們為您準備了現砍 $150 的創作者特惠</div>
                          </div>
                          <button onClick={() => setFunnelStep('sales')} className="ml-auto text-accent text-xs font-black uppercase tracking-widest hover:underline">
                            直接前往
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Preview Modal */}
              <AnimatePresence>
                {isPreviewOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsPreviewOpen(false)}
                      className="absolute inset-0 bg-bg/95 backdrop-blur-xl" 
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 40 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 40 }}
                      className="relative w-full max-w-5xl glass-panel hardware-border overflow-hidden"
                    >
                      <div className="p-6 border-b border-line flex justify-between items-center bg-card">
                        <div className="flex items-center gap-3">
                          <div className="bg-accent p-2 rounded-lg">
                            {previewContent === 'video' ? <Play className="w-4 h-4 text-white" /> : <FileText className="w-4 h-4 text-white" />}
                          </div>
                          <span className="font-black text-display text-lg">
                            {previewContent === 'video' ? '大師拍攝技巧 - 實戰動態預覽' : 'GoPro 拍攝大師手冊 - 內容試閱'}
                          </span>
                        </div>
                        <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:text-accent transition-colors">
                          <XCircle className="w-8 h-8" />
                        </button>
                      </div>

                      <div className="aspect-video bg-black relative">
                        {previewContent === 'video' ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-6">
                            <div className="w-24 h-24 rounded-full border-4 border-accent border-t-transparent animate-spin" />
                            <div className="space-y-2">
                              <h4 className="text-2xl font-black text-display">極限場景錄製技巧 #1: 坡道衝刺</h4>
                              <p className="text-text-secondary">正在加載 4K 高畫質預覽內容...</p>
                            </div>
                            {/* Placeholder for video player interface */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent flex items-center gap-6">
                              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <Play className="w-5 h-5 text-white fill-white" />
                              </div>
                              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div className="w-1/3 h-full bg-accent" />
                              </div>
                              <div className="text-[10px] font-black mono-value">01:24 / 04:50</div>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 overflow-y-auto p-12 bg-white">
                              <div className="max-w-2xl mx-auto space-y-12 text-black text-left">
                              <div className="flex gap-2 mb-8">
                                {EBOOK_CHAPTERS.map((_, idx) => (
                                  <button 
                                    key={idx}
                                    onClick={() => setCurrentChapter(idx)}
                                    className={`flex-1 h-1.5 rounded-full transition-all ${currentChapter === idx ? 'bg-accent' : 'bg-gray-200'}`}
                                  />
                                ))}
                              </div>
                              <div className="space-y-4 text-center">
                                <div className="text-[10px] text-accent font-black uppercase tracking-widest">CHAPTER 0{currentChapter + 1}</div>
                                <h1 className="text-4xl font-black">{EBOOK_CHAPTERS[currentChapter].title}</h1>
                              </div>
                              <img src={EBOOK_CHAPTERS[currentChapter].image} className="rounded-2xl shadow-xl w-full" />
                              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                                <p>{EBOOK_CHAPTERS[currentChapter].content}</p>
                              </div>

                              <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                                <button 
                                  disabled={currentChapter === 0}
                                  onClick={() => setCurrentChapter(prev => prev - 1)}
                                  className="px-6 py-2 rounded-xl border border-gray-200 text-sm font-bold disabled:opacity-30"
                                >
                                  上一章
                                </button>
                                {currentChapter < EBOOK_CHAPTERS.length - 1 ? (
                                  <button 
                                    onClick={() => setCurrentChapter(prev => prev + 1)}
                                    className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-all"
                                  >
                                    下一章
                                  </button>
                                ) : (
                                  <div className="p-4 bg-accent/5 rounded-2xl border-2 border-dashed border-accent/20 text-center space-y-3">
                                    <Lock className="w-8 h-8 text-accent mx-auto" />
                                    <div className="font-bold text-gray-500">其餘 45 頁已鎖定</div>
                                    <button 
                                      onClick={() => { setIsPreviewOpen(false); setFunnelStep('email'); }}
                                      className="bg-accent text-white px-6 py-2 rounded-lg font-bold text-sm"
                                    >
                                      查看解鎖方案
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {funnelStep === 'leads' && (
                <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8 text-left">
                    <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">
                      名單蒐集頁面 (Landing Page)
                    </div>
                    <h2 className="text-5xl font-black text-display leading-tight">準備好釋放<br />你的創作潛力了嗎？</h2>
                    <p className="text-xl text-text-secondary leading-relaxed font-light">
                      這本《GoPro 拍攝大師手冊》原本是我們實體課程的專屬教材（市價 $1,500），現在只需留下資料，即可免費獲取電子版精華。
                    </p>
                    <div className="space-y-6">
                      {[
                        '50+ 個專業運動攝影師的私藏參數',
                        '如何在極限環境中保持畫面穩定',
                        '從 0 到 1 的剪輯工作流程指南'
                      ].map(check => (
                        <div key={check} className="flex items-center gap-4">
                          <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center text-accent">
                            <Check className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-white">{check}</span>
                        </div>
                      ))}
                    </div>
                    <div className="glass-panel p-6 hardware-border flex items-center gap-4 bg-white/5">
                      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-black">
                        H
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white italic">"這是我看過最實用的 GoPro 指南，沒有廢話。"</div>
                        <div className="text-[10px] text-text-secondary font-black uppercase mt-1">—— 專業攝影師 Hank</div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-12 space-y-10 hardware-border text-center relative overflow-hidden bg-card">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl rounded-full -mr-16 -mt-16" />
                    <div className="space-y-4 relative">
                      <h2 className="text-3xl font-black text-display">領取免費贈品</h2>
                      <p className="text-text-secondary text-sm font-light">請輸入您的聯繫資訊，我們將立即將手冊發送到您的信箱。</p>
                    </div>
                    <form className="space-y-6 relative" onSubmit={(e) => {
                    e.preventDefault();
                    setIsGeneratingEbook(true);
                    setTimeout(() => {
                      setIsGeneratingEbook(false);
                      setFunnelStep('giveaway');
                      triggerToast('您的專屬手冊已生成！');
                    }, 3000);
                  }}>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">您的姓名</label>
                      <input 
                        required
                        type="text" 
                        placeholder="例如：林小明"
                        className="w-full bg-white/5 border border-line rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
                        value={leadInfo.name}
                        onChange={(e) => setLeadInfo({ ...leadInfo, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-2">電子郵件</label>
                      <input 
                        required
                        type="email" 
                        placeholder="yourname@example.com"
                        className="w-full bg-white/5 border border-line rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
                        value={leadInfo.email}
                        onChange={(e) => setLeadInfo({ ...leadInfo, email: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary font-light">
                      <input type="checkbox" className="w-4 h-4 rounded-md accent-accent" required />
                      我同意接收 GoProHub 的行銷訊息與優惠資訊
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-accent text-white py-5 rounded-2xl font-black text-display text-xl shadow-xl hover:bg-accent-hover transition-all flex items-center justify-center gap-3"
                    >
                      領取我的免費贈品 <ArrowRight className="w-6 h-6" />
                    </button>
                  </form>
                  <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em]">我們重視您的隱私，您可以隨時取消訂閱</p>
                </div>
                </div>
              )}

              {funnelStep === 'sales' && (
                <div className="space-y-20">
                  <div className="text-center space-y-4">
                    <div className="inline-block px-4 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-yellow-500/20">
                      限時特別優惠
                    </div>
                    <h2 className="text-6xl font-black text-display">為您的新技巧配備最強裝備</h2>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-4xl font-black text-display">HERO13 Black <span className="text-accent underline decoration-4 underline-offset-8">創作者套裝</span></h3>
                        <p className="text-lg text-text-secondary leading-relaxed font-light">
                          既然您已經獲得了專業拍攝技巧，現在只需要這台旗艦級相機，就能發揮 100% 的創意實力。
                        </p>
                      </div>
                      <div className="grid gap-4">
                        {[
                          { item: 'HERO13 Black 主機', val: '$399' },
                          { item: 'Volta 電池握把', val: '$129' },
                          { item: '媒體選配模組', val: '$79' },
                          { item: '燈光選配模組', val: '$49' },
                        ].map(p => (
                          <div key={p.item} className="flex justify-between items-center p-4 bg-white/2 border border-line rounded-2xl">
                            <span className="font-bold text-white">{p.item}</span>
                            <span className="mono-value text-text-secondary">{p.val}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center p-6 bg-accent/10 border-2 border-accent rounded-2xl">
                          <div>
                            <span className="font-black text-white text-xl block">總價值 $656</span>
                            <span className="text-accent font-black text-sm uppercase">今日限定折扣</span>
                          </div>
                          <span className="text-5xl font-black text-white mono-value">$499</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          addToCart({
                            id: 'funnel-bundle',
                            name: 'HERO13 創作者套裝',
                            price: 499,
                            image: 'https://picsum.photos/seed/bundle/800/600',
                            category: 'camera',
                            description: '限時折扣套裝',
                            stock: 5,
                            rating: 5.0
                          });
                          setActiveTab('cart');
                        }}
                        className="w-full bg-white text-black py-6 rounded-2xl font-black text-display text-2xl hover:bg-accent hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4"
                      >
                        立即搶購優惠套裝 <Zap className="w-7 h-7" />
                      </button>
                    </div>
                    <div>
                      <TiltCard>
                        <img src="https://picsum.photos/seed/gopro-funnel/800/1000" alt="GoPro Bundle" className="rounded-3xl shadow-[0_0_80px_rgba(0,174,239,0.2)] border-8 border-bg-secondary" />
                      </TiltCard>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { icon: Shield, title: '2 年全球保固', desc: '安心拍攝，不論在哪裡我們都為您守護' },
                      { icon: Clock, title: '24H 極速出貨', desc: '現在訂購，明天即可收到您的新裝備' },
                      { icon: MessageSquare, title: 'VIP 專屬客服', desc: '任何拍攝問題，我們都有專人為您解答' },
                    ].map(feat => (
                      <div key={feat.title} className="glass-panel p-8 hardware-border text-center space-y-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto">
                          <feat.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-xl text-display">{feat.title}</h4>
                        <p className="text-sm text-text-secondary font-light leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Added Tech Specs on Sales Page */}
                  <div className="space-y-10">
                    <h3 className="text-3xl font-black text-display text-center">為什麼選擇 HERO13 創作者套裝？</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { t: '5.3K60 + 4K120', d: '影院級解析度，捕捉驚人細節' },
                        { t: 'HyperSmooth 6.0', d: '榮獲艾美獎肯定的防震技術' },
                        { t: '防水達 10 米', d: '無需外殼，直達深海' },
                        { t: '藍牙音訊連接', d: '完美相容無線麥克風' }
                      ].map(spec => (
                        <div key={spec.t} className="p-6 bg-white/5 border border-line rounded-2xl space-y-2">
                          <div className="text-accent font-black text-lg">{spec.t}</div>
                          <div className="text-xs text-text-secondary">{spec.d}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sales Page Reviews */}
                  <div className="space-y-10">
                    <h3 className="text-3xl font-black text-display text-center">看看其他創作者怎麼說</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      {[
                        { n: '張啟明', r: 5, c: '自從拿到這組套裝，我的 Vlog 畫質提升了一個檔次。Volta 握把真的太好用了！' },
                        { n: '陳婉清', r: 5, c: '這本手冊教的參數搭配這台相機簡直無敵。夜間拍攝效果超乎想像。' }
                      ].map((rev, i) => (
                        <div key={i} className="glass-panel p-8 hardware-border flex gap-6">
                          <div className="w-12 h-12 bg-white/10 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                            {rev.n[0]}
                          </div>
                          <div className="space-y-3">
                            <div className="flex gap-1">
                              {[...Array(rev.r)].map((_, j) => <Star key={j} className="w-3 h-3 text-accent fill-accent" />)}
                            </div>
                            <p className="text-sm text-text-secondary italic">"{rev.c}"</p>
                            <div className="text-[10px] font-black text-white">{rev.n} ・ 已驗證買家</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-accent/20 p-12 rounded-[2rem] border border-accent/40 text-center space-y-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-accent/10 animate-pulse pointer-events-none" />
                    <div className="relative space-y-4">
                      <h3 className="text-4xl font-black text-display">不再猶豫，現在就是開始的時刻</h3>
                      <p className="text-text-secondary max-w-2xl mx-auto">
                        這項優惠僅保留給完成學習的創作者。當頁面關閉後，價格將恢復原價。
                      </p>
                    </div>
                    <button 
                       onClick={() => setActiveTab('cart')}
                       className="relative bg-white text-black px-12 py-6 rounded-2xl font-black text-2xl hover:bg-accent hover:text-white transition-all shadow-2xl"
                    >
                      立即擁有你的創作者套裝
                    </button>
                  </div>
                </div>
              )}

              {funnelStep === 'email' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="space-y-2">
                      <h3 className="text-4xl font-black text-display text-accent">多階層自動排程信</h3>
                      <p className="text-text-secondary">系統將根據使用者的動作，在接下來的 3 天內自動發送以下信件：</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 p-1 bg-white/5 border border-line rounded-2xl w-fit">
                    {FUNNEL_EMAILS.map((email, idx) => (
                      <button
                        key={email.id}
                        onClick={() => setEmailTemplate(
                          idx === 0 ? 'welcome' : 
                          idx === 1 ? 'tech' : 
                          idx === 2 ? 'case_study' : 
                          idx === 3 ? 'faq' : 'closing'
                        )}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all ${
                          (idx === 0 && emailTemplate === 'welcome') ||
                          (idx === 1 && emailTemplate === 'tech') ||
                          (idx === 2 && emailTemplate === 'case_study') ||
                          (idx === 3 && emailTemplate === 'faq') ||
                          (idx === 4 && emailTemplate === 'closing') 
                            ? 'bg-accent text-white shadow-xl' : 'text-text-secondary hover:text-white'
                        }`}
                      >
                        <Mail className="w-3 h-3" /> Day {email.day}: {email.goal}
                      </button>
                    ))}
                  </div>

                  <div className="glass-panel hardware-border overflow-hidden bg-white border-none">
                    <div className="bg-bg p-8 border-b border-line flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent p-2 rounded-lg">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black text-white text-sm">寄件者：GoProHub 官方團隊</span>
                      </div>
                      <div className="text-[10px] text-text-secondary uppercase tracking-widest font-black">
                        Subject: {
                          emailTemplate === 'welcome' ? FUNNEL_EMAILS[0].subject :
                          emailTemplate === 'tech' ? FUNNEL_EMAILS[1].subject :
                          emailTemplate === 'case_study' ? FUNNEL_EMAILS[2].subject :
                          emailTemplate === 'faq' ? FUNNEL_EMAILS[3].subject :
                          FUNNEL_EMAILS[4].subject
                        }
                      </div>
                    </div>

                    <div className="p-12 text-black space-y-8 font-sans">
                      <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 mb-8">
                        <div className="text-[10px] font-black text-accent uppercase mb-1">本信件策略：{
                          emailTemplate === 'welcome' ? FUNNEL_EMAILS[0].goal :
                          emailTemplate === 'tech' ? FUNNEL_EMAILS[1].goal :
                          emailTemplate === 'case_study' ? FUNNEL_EMAILS[2].goal :
                          emailTemplate === 'faq' ? FUNNEL_EMAILS[3].goal :
                          FUNNEL_EMAILS[4].goal
                        }</div>
                      </div>
                      {emailTemplate === 'welcome' && (
                        <>
                          <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-gray-900">嗨 {leadInfo.name || '冒險家'}，手冊已備妥！</h1>
                            <p className="text-gray-600 leading-relaxed text-lg">
                              很高興你能加入 GoProHub。拍攝大師手冊能幫助你避開 90% 的新手錯誤，這是你通往專業攝影的第一步。
                            </p>
                          </div>
                          <div className="p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center space-y-6">
                            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
                              <FileText className="w-8 h-8" />
                            </div>
                            <button className="bg-black text-white px-10 py-4 rounded-xl font-bold shadow-lg">
                              立即下載 PDF 手冊
                            </button>
                          </div>
                        </>
                      )}

                      {emailTemplate === 'tech' && (
                        <>
                          <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-gray-900">昨天看了手冊了嗎？這裡有個黑科技...</h1>
                            <p className="text-gray-600 leading-relaxed text-lg">
                              手冊沒寫的是：當你在海拔超過 3000 公尺拍攝時，電池的消耗速度會倍增。你必須關閉語音控制來節省能源。
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                              <div className="font-bold mb-2">💡 高海拔攝影技巧</div>
                              <p className="text-xs text-gray-500">如何讓電池在低溫下多撐 30% 時間？</p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                              <div className="font-bold mb-2">🎥 LOG 檔調色 LUT</div>
                              <p className="text-xs text-gray-500">專為 HERO13 開發的電影級濾鏡包。</p>
                            </div>
                          </div>
                        </>
                      )}

                      {emailTemplate === 'case_study' && (
                        <>
                          <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-gray-900">學會這些，他從新手變成了簽約攝影師</h1>
                            <p className="text-gray-600 leading-relaxed text-lg">
                              這裡有一段來自阿強的分享。他在一個月前還在為畫面不穩而煩惱，但自從嘗試了「三點定位法」後...
                            </p>
                          </div>
                          <div className="border-l-4 border-accent p-6 bg-gray-50 italic text-gray-600">
                            "這本手冊改變了我對構圖的理解。以前我只是在紀錄，現在我是在說故事。"
                          </div>
                          <img src="https://picsum.photos/seed/cs_case/600/300" className="rounded-xl w-full" />
                        </>
                      )}

                      {emailTemplate === 'faq' && (
                        <>
                          <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-gray-900">關於創作者套裝，大家最常問的問題</h1>
                            <p className="text-gray-600 leading-relaxed text-lg">
                              我們知道在入手旗艦裝備前，你可能有些疑慮。這裡幫你整理了最核心的解答。
                            </p>
                          </div>
                          <div className="space-y-3">
                            {[
                              { q: 'HERO13 跟 HERO12 的最大差別？', a: '更好的低光源處理與磁吸式固定座。' },
                              { q: '創作者套裝的保固多長？', a: '我們提供 2 年的全球聯保服務。' }
                            ].map(item => (
                              <div key={item.q} className="p-4 bg-gray-50 rounded-lg">
                                <div className="font-bold text-sm text-accent">Q: {item.q}</div>
                                <div className="text-xs text-gray-500 mt-1">A: {item.a}</div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {emailTemplate === 'closing' && (
                        <>
                          <div className="space-y-4 text-center">
                            <div className="inline-block px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded-full mb-4">
                              最後 24 小時
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">別讓技巧在設備上受限</h1>
                            <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
                              你的 75 折創作者套裝專屬連結即將失效。這是今年最低的價格，錯過不再。
                            </p>
                          </div>
                          <div className="p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200 text-center">
                            <div className="text-sm font-bold text-yellow-700 mb-2">專屬優惠碼</div>
                            <div className="text-3xl font-black tracking-widest text-black">MASTER_LIMIT_75</div>
                          </div>
                          <button 
                            onClick={() => setFunnelStep('sales')}
                            className="w-full bg-accent text-white py-5 rounded-2xl font-bold text-xl shadow-xl hover:scale-105 transition-all"
                          >
                            立即前往官網結帳
                          </button>
                        </>
                      )}

                      <div className="pt-8 border-t border-gray-100 text-center space-y-4">
                        <p className="text-xs text-gray-400">祝您拍攝愉快！ GoProHub 團隊</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : activeTab === 'startup' ? (
            <motion.div
              key="startup"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <AIStartupSystem triggerToast={triggerToast} />
            </motion.div>
          ) : (
            <motion.div
              key="gamification"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid lg:grid-cols-12 gap-10">
                {/* Left Column: Profile & Badges */}
                <div className="lg:col-span-4 space-y-10">
                  <div className="glass-panel p-10 space-y-8 hardware-border">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-accent flex items-center justify-center text-4xl font-black text-display shadow-2xl">
                          {user.name[0]}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-neon text-black text-[10px] font-black px-2 py-1 rounded-md mono-value">
                          PRO
                        </div>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-display">{user.name}</h3>
                        <p className="text-xs text-accent font-black uppercase tracking-[0.3em]">GoPro Explorer</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">
                        <span>Experience Points</span>
                        <span className="mono-value text-accent">{user.exp} / 5000</span>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-line p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(user.exp / 5000) * 100}%` }}
                          className="h-full bg-accent rounded-full shadow-[0_0_15px_rgba(0,174,239,0.5)]" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-10 space-y-8">
                    <h3 className="text-xl font-black text-display flex items-center gap-3">
                      <Award className="w-6 h-6 text-accent" />
                      Achievements
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      {BADGES.map((badge) => (
                        <div 
                          key={badge.id}
                          className={`p-6 rounded-2xl border flex flex-col items-center text-center gap-3 transition-all duration-500 group ${
                            badge.unlocked 
                              ? 'bg-accent/5 border-accent/30 shadow-lg' 
                              : 'bg-white/2 border-line opacity-30 grayscale'
                          }`}
                        >
                          <span className="text-4xl group-hover:scale-125 transition-transform">{badge.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest">{badge.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Middle Column: Shop & Charity */}
                <div className="lg:col-span-5 space-y-10">
                  <div className="glass-panel p-10 space-y-8">
                    <h3 className="text-xl font-black text-display flex items-center gap-3">
                      <ShoppingBag className="w-6 h-6 text-accent" />
                      Virtual Gear
                    </h3>
                    <div className="grid gap-6">
                      {VIRTUAL_ITEMS.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-6 bg-white/2 rounded-2xl border border-line hover:border-accent/30 transition-all group">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-line group-hover:border-accent/50 transition-colors">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-black text-lg text-display">{item.name}</div>
                              <div className="text-xs text-accent flex items-center gap-1.5 font-bold mono-value">
                                <Coins className="w-3.5 h-3.5" /> {item.price}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleBuyItem(item)}
                            className="bg-white text-black hover:bg-accent hover:text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                          >
                            Buy
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel p-10 space-y-8 bg-rose-500/5 border-rose-500/20 relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-500/10 blur-3xl rounded-full" />
                    <h3 className="text-xl font-black text-display flex items-center gap-3 text-rose-500">
                      <Heart className="w-6 h-6" />
                      Impact Center
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed font-light">
                      Convert your virtual achievements into real-world change. Every 100 points donated provides $1 to ocean conservation efforts.
                    </p>
                    <button 
                      onClick={handleDonate}
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white py-5 rounded-2xl font-black text-display flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-98 shadow-xl shadow-rose-500/20"
                    >
                      <Gift className="w-6 h-6" /> Donate 100 Points
                    </button>
                  </div>
                </div>

                {/* Right Column: Leaderboard */}
                <div className="lg:col-span-3 glass-panel p-10 space-y-8 hardware-border">
                  <h3 className="text-xl font-black text-display flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-accent" />
                    Global Rank
                  </h3>
                  <div className="space-y-2">
                    {LEADERBOARD.map((entry) => (
                      <div key={entry.rank} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group">
                        <div className="flex items-center gap-5">
                          <span className={`w-8 text-center font-black text-display text-2xl ${entry.rank <= 3 ? 'text-accent' : 'text-text-secondary opacity-30'}`}>
                            {entry.rank.toString().padStart(2, '0')}
                          </span>
                          <div>
                            <div className="font-black text-sm text-display group-hover:text-accent transition-colors">{entry.name}</div>
                            <div className="text-[9px] text-text-secondary uppercase font-black tracking-[0.2em] mono-value">LV.{entry.level}</div>
                          </div>
                        </div>
                        <div className="text-lg font-black text-accent mono-value">
                          {entry.points.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckingOut && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckingOut(false)}
              className="absolute inset-0 bg-bg/80 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-panel p-10 hardware-border space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-display">確認訂單</h3>
                <button onClick={() => setIsCheckingOut(false)} className="p-2 hover:text-accent transition-colors">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-accent">收件資訊</div>
                  <div className="grid gap-4">
                    <input type="text" placeholder="收件人姓名" className="bg-white/5 border border-line rounded-xl px-4 py-3 text-sm focus:border-accent outline-none transition-all" />
                    <input type="text" placeholder="收件地址" className="bg-white/5 border border-line rounded-xl px-4 py-3 text-sm focus:border-accent outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-accent">付款方式</div>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 rounded-xl border-2 border-accent bg-accent/10 text-xs font-black uppercase tracking-widest">信用卡</button>
                    <button className="p-4 rounded-xl border border-line bg-white/5 text-xs font-black uppercase tracking-widest text-text-secondary">貨到付款</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-line space-y-4">
                  <div className="flex justify-between text-xl font-black">
                    <span>應付總額</span>
                    <span className="text-accent mono-value">${cartTotal}</span>
                  </div>
                  <button 
                    onClick={() => {
                      triggerToast('訂單已成功送出！感謝您的購買。');
                      setCart([]);
                      setIsCheckingOut(false);
                      setActiveTab('reviews');
                    }}
                    className="w-full bg-accent text-white py-5 rounded-2xl font-black text-display shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-98 transition-all"
                  >
                    確認支付
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 100, x: '-50%' }}
            className="fixed bottom-12 left-1/2 bg-white text-black px-10 py-5 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] font-black text-display z-50 flex items-center gap-4 border-4 border-accent"
          >
            <Trophy className="w-8 h-8 text-accent" />
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Compare Button */}
      <AnimatePresence>
        {compareList.length > 0 && activeTab !== 'compare' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: 100 }}
            onClick={() => setActiveTab('compare')}
            className="fixed bottom-12 right-12 z-40 bg-white text-black hover:bg-accent hover:text-white p-6 rounded-3xl shadow-2xl flex items-center gap-4 group transition-all border-4 border-accent"
          >
            <div className="relative">
              <Share2 className="w-8 h-8" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white rounded-full text-[10px] flex items-center justify-center font-black border-2 border-white group-hover:border-accent">
                {compareList.length}
              </div>
            </div>
            <span className="font-black text-display uppercase tracking-widest overflow-hidden w-0 group-hover:w-24 transition-all duration-500 whitespace-nowrap">
              Compare
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="border-t border-line py-20 px-8 bg-card/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-line to-transparent" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Camera className="w-8 h-8 text-accent" />
              <span className="text-2xl font-black tracking-tighter text-display">GOPRO HUB</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed font-light">
              Your ultimate resource for action camera reviews, technical insights, and community-driven impact.
            </p>
            <div className="flex gap-4">
              <button className="p-3 bg-white/5 rounded-xl border border-line hover:border-accent transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-8">Equipment</h4>
            <ul className="text-sm text-text-secondary space-y-4 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">HERO13 Black</a></li>
              <li><a href="#" className="hover:text-white transition-colors">HERO12 Black</a></li>
              <li><a href="#" className="hover:text-white transition-colors">HERO11 Black</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-8">Ecosystem</h4>
            <ul className="text-sm text-text-secondary space-y-4 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Reward Points</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Achievements</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Virtual Gear</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-8">Mission</h4>
            <p className="text-xs text-text-secondary mb-8 leading-relaxed font-light">
              We partner with global environmental organizations to turn your passion for adventure into positive action.
            </p>
            <div className="flex items-center gap-3 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
              <Heart className="w-6 h-6 text-rose-500" />
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-rose-500">Total Donated</div>
                <div className="text-xl font-black text-display">$12,450.00</div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-[10px] text-text-secondary font-mono uppercase tracking-[0.4em]">
          © 2026 GoPro Professional Review Hub. Not affiliated with GoPro Inc.
        </div>
      </footer>

      <AIChat />
    </div>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
