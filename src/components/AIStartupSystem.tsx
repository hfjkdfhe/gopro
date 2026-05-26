import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Radio, 
  User as UserIcon, 
  Gift, 
  Mail, 
  Layout, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  Layers, 
  Settings, 
  Code, 
  Smartphone, 
  Laptop, 
  RotateCcw, 
  Play, 
  Lock, 
  RefreshCw, 
  FileText, 
  Users, 
  Check, 
  CheckCircle2,
  ExternalLink,
  Zap,
  Shield,
  ThumbsUp,
  Sliders,
  AlertCircle,
  TrendingDown,
  ShoppingBag,
  ArrowRight,
  Database,
  Terminal,
  MessageSquare
} from 'lucide-react';

// Interfaces for our Startup Designer
interface StepDetail {
  id: number;
  title: string;
  subtitle: string;
  icon: any;
}

interface AIStartupSystemProps {
  triggerToast?: (msg: string) => void;
}

export function AIStartupSystem({ triggerToast: parentTriggerToast }: AIStartupSystemProps) {
  const [localToast, setLocalToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    if (parentTriggerToast) {
      parentTriggerToast(msg);
    } else {
      setLocalToast(msg);
      setTimeout(() => setLocalToast(null), 3000);
    }
  };
  // Navigation for Steps
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Design Input States
  const [role, setRole] = useState<'copywriter' | 'media_buyer' | 'growth_hacker'>('copywriter');
  const [target, setTarget] = useState<'cac_reduction' | 'conversion_boost' | 'aov_increase'>('conversion_boost');
  const [task, setTask] = useState<string>('自動生成 GoPro 5.3K 高格率運動手冊與 Day 0-5 肥皂劇轉單信件');
  const [scale, setScale] = useState<'small' | 'large'>('small');
  const [aiEngine, setAiEngine] = useState<'gemini' | 'gpt4' | 'ai_studio'>('ai_studio');
  
  // Interactive Simulation variables
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizingProgress, setOptimizingProgress] = useState<number>(0);
  const [optimizationLogs, setOptimizationLogs] = useState<string[]>([]);
  const [refinementStage, setRefinementStage] = useState<'initial' | 'first_pass' | 'final'>('initial');

  // Input States for the Store/App Simulator (Step 6 / Final Output)
  const [simName, setSimName] = useState<string>('阿偉');
  const [simEmail, setSimEmail] = useState<string>('a-wei@adventure.com');
  const [simAudience, setSimAudience] = useState<'extreme' | 'family'>('extreme');
  const [simCurrentMail, setSimCurrentMail] = useState<number>(0);
  const [simUnlockedChapter, setSimUnlockedChapter] = useState<number>(0);
  const [simHasOrdered, setSimHasOrdered] = useState<boolean>(false);
  const [simEbookFeedback, setSimEbookFeedback] = useState<string>('');
  const [simActiveTab, setSimActiveTab] = useState<'store' | 'ebook' | 'emails'>('store');

  // Predictor configurations based on Inputs
  const [predictedBaseCTR, setPredictedBaseCTR] = useState<number>(1.8);
  const [predictedBoostCTR, setPredictedBoostCTR] = useState<number>(4.9);
  const [predictedBaseCVR, setPredictedBaseCVR] = useState<number>(1.2);
  const [predictedBoostCVR, setPredictedBoostCVR] = useState<number>(3.6);
  const [estimatedCAC, setEstimatedCAC] = useState<number>(350);
  const [estimatedLTV, setEstimatedLTV] = useState<number>(4500);

  // Re-run predictions dynamically when variables change
  useEffect(() => {
    let baseCtr = scale === 'small' ? 1.5 : 2.2;
    let multiplierCtr = aiEngine === 'ai_studio' ? 2.8 : aiEngine === 'gemini' ? 2.5 : 2.2;
    let baseCvr = scale === 'small' ? 0.9 : 1.4;
    let multiplierCvr = target === 'conversion_boost' ? 3.1 : target === 'cac_reduction' ? 2.4 : 2.0;

    setPredictedBaseCTR(Number(baseCtr.toFixed(1)));
    setPredictedBoostCTR(Number((baseCtr * multiplierCtr).toFixed(1)));
    setPredictedBaseCVR(Number(baseCvr.toFixed(1)));
    setPredictedBoostCVR(Number((baseCvr * multiplierCvr).toFixed(1)));

    let calculatedCAC = scale === 'small' ? 450 : 250;
    if (target === 'cac_reduction') calculatedCAC = Math.round(calculatedCAC * 0.65);
    if (aiEngine === 'ai_studio') calculatedCAC = Math.round(calculatedCAC * 0.75);
    setEstimatedCAC(calculatedCAC);

    let calculatedLTV = scale === 'small' ? 5200 : 3800;
    if (target === 'aov_increase') calculatedLTV = Math.round(calculatedLTV * 1.35);
    setEstimatedLTV(calculatedLTV);
  }, [scale, aiEngine, target]);

  // Handle the active optimization process simulation
  const handleOptimizationRun = () => {
    setIsOptimizing(true);
    setOptimizingProgress(0);
    setOptimizationLogs(['[INITIALIZE] 啟動 AI 系統優化引擎暨意圖解析...', '[INPUT] 載入角色任務 ' + role + ' | 目標: ' + target]);
    
    const interval = setInterval(() => {
      setOptimizingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          setRefinementStage('final');
          setOptimizationLogs(logs => [
            ...logs,
            '[SUCCESS] 系統模型優化完成！指標已重新整理。',
            `[FEEDBACK_LOOP] 產出最終回饋指標：預估 CTR 提升至 ${predictedBoostCTR}%，轉化率提升至 ${predictedBoostCVR}%。`
          ]);
          return 100;
        }
        
        const next = prev + 10;
        
        // Push live simulated logs
        if (next === 20) {
          setOptimizationLogs(logs => [...logs, '[PARSING] 深入分析 GoPro 官方論壇 85,000 條使用者評價痛點...']);
        }
        if (next === 40) {
          setOptimizationLogs(logs => [...logs, '[PROMPT_TUNING] 對齊 Gemini AI Studio 策略，重新編譯肥皂劇信件標題 (Day 0-Day 5)...']);
        }
        if (next === 60) {
          setOptimizationLogs(logs => [...logs, '[REFINEMENT] 針對極限運動 TA 調整防震與 10-Bit 色彩痛點，優化第一章 5.3K 錄影設定內容。']);
        }
        if (next === 80) {
          setOptimizationLogs(logs => [...logs, '[SIMULATION] 執行 500 次 A/B 測試廣告模擬，自動剔除點閱率低於 2% 之備選素材。']);
        }
        
        return next;
      });
    }, 300);
  };

  const stepsList: StepDetail[] = [
    { id: 1, title: '第一步：數據預測', subtitle: 'AI 商業成效預測與演算', icon: TrendingUp },
    { id: 2, title: '第二步：即時互動', subtitle: 'AI 即時聊天與事件自動化', icon: MessageSquare },
    { id: 3, title: '第三步：系統設計', subtitle: '角色、目標、任務與優化回饋', icon: Cpu },
    { id: 4, title: '第四步：切入點選擇', subtitle: '大型 vs 小型電商架構選擇', icon: Layers },
    { id: 5, title: '第五步：AI 平台整合', subtitle: 'Gemini, GPT & AI Studio 部署', icon: Code },
    { id: 6, title: '第六步：落地端 preview', subtitle: '互動式網站與 App 模擬器', icon: Smartphone }
  ];

  return (
    <div className="space-y-12">
      {/* Upper header */}
      <div className="relative p-12 rounded-[2.5rem] overflow-hidden glass-panel hardware-border bg-gradient-to-r from-accent/10 to-transparent">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-3xl space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-black uppercase tracking-[0.2em] animate-pulse">
            <Cpu className="w-4 h-4" /> E-COMMERCE AUTOPILOT
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-display leading-tight tracking-tight">
            GoPro <span className="text-accent">AI 創業戰略 & 自動銷售系統</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed font-light">
            融合預測分析、多代理系統設計、大型與微型電商切入戰略，以及 Google Gemini/AI Studio 整合。請選擇下方步驟，探索領先的自動化零售王國！
          </p>
        </div>
      </div>

      {/* Main Framework Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stepsList.map(step => (
          <button 
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`p-5 rounded-2xl flex flex-col items-start gap-3 transition-all text-left relative overflow-hidden group ${
              currentStep === step.id 
                ? 'bg-accent text-white shadow-xl shadow-accent/20 border-accent' 
                : 'bg-white/5 border border-line text-text-secondary hover:bg-white/15'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${currentStep === step.id ? 'bg-white/20 text-white' : 'bg-white/5 text-accent'}`}>
              <step.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Step {step.id}</div>
              <div className={`font-black text-sm tracking-tight ${currentStep === step.id ? 'text-white' : 'text-white'}`}>{step.title.split('：')[1]}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Configuration Hub Overlay and Step Renderer */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Control Panel - Configure E-commerce inputs */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="glass-panel p-8 hardware-border space-y-8">
            <h3 className="text-xl font-black text-display flex items-center gap-2">
              <Settings className="w-5 h-5 text-accent" /> 系統設定中樞
            </h3>
            
            {/* Input 1: Role */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-accent uppercase tracking-widest">系統指定角色 (Role)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'copywriter', label: '文案管家', desc: '撰寫高轉化信' },
                  { id: 'media_buyer', label: '智能投手', desc: '配置高 ROI 廣告' },
                  { id: 'growth_hacker', label: '黑客代理', desc: '自動化增長鏈' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id as any)}
                    className={`p-3 rounded-xl border text-xs text-center font-bold flex flex-col gap-1 transition-all ${
                      role === r.id ? 'bg-accent/15 border-accent text-white' : 'bg-white/5 border-line text-text-secondary hover:text-white'
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className="text-[8px] opacity-60 font-light leading-none">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Target */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-accent uppercase tracking-widest">核心商業目標 (Target)</label>
              <div className="space-y-2">
                {[
                  { id: 'conversion_boost', label: '轉換狂飆', desc: '運用「肥皂劇自動回覆信任鏈」突破 3.5% 交易轉換率' },
                  { id: 'cac_reduction', label: '獲客極小化', desc: '以「5.3K 單相機調校手冊」做免費贈品，降低獲客成本' },
                  { id: 'aov_increase', label: '客單價翻倍', desc: '加裝 Volta 與磁吸濾鏡等旗艦模組進行動態追加銷售' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTarget(t.id as any)}
                    className={`w-full p-3.5 rounded-xl border text-left font-bold transition-all flex items-start gap-3 ${
                      target === t.id ? 'bg-accent/15 border-accent text-white' : 'bg-white/5 border-line text-text-secondary hover:text-white'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${target === t.id ? 'bg-accent' : 'bg-text-secondary'}`} />
                    <div>
                      <div className="text-xs text-white leading-none">{t.label}</div>
                      <div className="text-[9px] text-text-secondary mt-1 font-light">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: AI Engine */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-accent uppercase tracking-widest">核心 AI 模型技術 (AI Engine)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ai_studio', label: 'Gemini Studio', active: true },
                  { id: 'gemini', label: 'Gemini 1.5 Pro', active: true },
                  { id: 'gpt4', label: 'GPT-4o API', active: true }
                ].map(eng => (
                  <button
                    key={eng.id}
                    onClick={() => setAiEngine(eng.id as any)}
                    className={`p-3 rounded-xl border text-[10px] text-center font-black transition-all ${
                      aiEngine === eng.id ? 'bg-accent text-white border-accent' : 'bg-white/5 border-line text-text-secondary hover:text-white'
                    }`}
                  >
                    {eng.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 4: Task Input Box */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-accent uppercase tracking-widest">目前排程任務 (Task)</label>
              <textarea 
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full h-24 p-3 bg-white/5 border border-line rounded-xl text-xs text-white focus:outline-none focus:border-accent text-left resize-none font-medium leading-relaxed"
              />
            </div>

            {/* Scale Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-accent">電子商務切入規模</span>
                <span className="text-white">{scale === 'small' ? '小型 (DTC/個人個人)' : '大型 (電商平台/全渠道)'}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setScale('small')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${scale === 'small' ? 'bg-accent/25 text-white border border-accent' : 'bg-white/5 text-text-secondary'}`}
                >
                  小型 DTC 漏斗
                </button>
                <button 
                  onClick={() => setScale('large')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${scale === 'large' ? 'bg-accent/25 text-white border border-accent' : 'bg-white/5 text-text-secondary'}`}
                >
                  大型品牌網店
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Forecast Widget */}
          <div className="glass-panel p-6 hardware-border bg-gradient-to-br from-accent/5 to-transparent space-y-4">
            <div className="text-[10px] font-black text-accent uppercase tracking-widest">AI 自動預測成效</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-xl text-center">
                <div className="text-[10px] text-text-secondary">轉換率 (CVR)</div>
                <div className="text-xl font-black text-accent mt-0.5">{predictedBoostCVR}%</div>
                <div className="text-[8px] text-text-secondary line-through">原本 {predictedBaseCVR}%</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-center">
                <div className="text-[10px] text-text-secondary">點擊率 (CTR)</div>
                <div className="text-xl font-black text-accent mt-0.5">{predictedBoostCTR}%</div>
                <div className="text-[8px] text-text-secondary line-through">原本 {predictedBaseCTR}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Panel based on current selected step */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: PREDICTION */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-8"
              >
                <div className="glass-panel p-10 hardware-border space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 text-left">
                      <div className="text-[10px] font-black text-accent uppercase tracking-widest">STEP 01 // PREDICTION FRAMEWORK</div>
                      <h2 className="text-3xl font-black text-display">第一步：數據預測與成效演算</h2>
                      <p className="text-text-secondary text-sm">利用對話與歷史點擊數據，AI 提前估算推廣模型能達致之銷售成效，保障創業團隊之預算。</p>
                    </div>
                  </div>

                  {/* Main Predictive stats detail */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white/5 border border-line rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-xl rounded-full" />
                      <div className="text-xs text-text-secondary font-bold uppercase tracking-widest">客戶終身價值 (LTV)</div>
                      <div className="text-3xl font-black text-white mt-2 font-mono">${estimatedLTV.toLocaleString()}</div>
                      <p className="text-[10px] text-text-secondary mt-2">基於預測購置 GoPro Volta 專屬配件配插率</p>
                    </div>

                    <div className="p-6 bg-white/5 border border-line rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-xl rounded-full" />
                      <div className="text-xs text-text-secondary font-bold uppercase tracking-widest">客戶獲取成本 (CAC)</div>
                      <div className="text-3xl font-black text-white mt-2 font-mono">${estimatedCAC.toLocaleString()}</div>
                      <p className="text-[10px] text-text-secondary mt-2">高黏著度手冊預計將大幅降低原本 40% 的名單成本</p>
                    </div>

                    <div className="p-6 bg-white/5 border border-line rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-xl rounded-full" />
                      <div className="text-xs text-text-secondary font-bold uppercase tracking-widest">損益兩平點 (BEP)</div>
                      <div className="text-3xl font-black text-white mt-2 font-mono">
                        {Math.ceil(estimatedCAC / (estimatedLTV * 0.4))} 件/日
                      </div>
                      <p className="text-[10px] text-text-secondary mt-2">利用電商精準數據，自動回推所需最少銷量</p>
                    </div>
                  </div>

                  {/* Visual charts simulation - Predicted conversion booster */}
                  <div className="p-8 bg-white/[0.02] border border-line rounded-3xl space-y-6">
                    <h4 className="font-black text-sm text-white uppercase tracking-wider">實時 AI 對比預測指標</h4>
                    
                    {/* Progress 1: CTR */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-text-secondary">廣告點擊率 (CTR)</span>
                        <div className="flex gap-3">
                          <span className="line-through text-gray-500">{predictedBaseCTR}%</span>
                          <span className="text-accent font-black">{predictedBoostCTR}% (AI Studio 優化後)</span>
                        </div>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                        <div style={{ width: `${(predictedBaseCTR/15)*100}%` }} className="bg-gray-600 h-full" />
                        <div style={{ width: `${((predictedBoostCTR - predictedBaseCTR)/15)*100}%` }} className="bg-accent h-full animate-pulse" />
                      </div>
                    </div>

                    {/* Progress 2: CVR */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-text-secondary">名單成單轉換率 (CVR)</span>
                        <div className="flex gap-3">
                          <span className="line-through text-gray-500">{predictedBaseCVR}%</span>
                          <span className="text-accent font-black">{predictedBoostCVR}% (肥皂劇序列優化後)</span>
                        </div>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                        <div style={{ width: `${(predictedBaseCVR/10)*100}%` }} className="bg-gray-600 h-full" />
                        <div style={{ width: `${((predictedBoostCVR - predictedBaseCVR)/10)*100}%` }} className="bg-accent h-full animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Insights block */}
                  <div className="p-6 bg-accent/5 border border-line rounded-2xl text-left flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-sm text-white">AI 預測洞察建議</h5>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        當前選取了 <span className="text-accent font-bold">{scale === 'small' ? '小型 DTC 漏斗' : '大型品牌網店'}</span>。
                        配合 <span className="text-accent font-bold">{aiEngine === 'ai_studio' ? 'Gemini AI Studio' : '其他大語言模型'}</span> 編寫手冊。
                        預期透過 HyperSmooth 6.0 特效掛鉤與隨後連續 5 天的自動化關聯信，整體轉化率能大幅改善。
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: MULTI-AGENT RESPONSE */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-8"
              >
                <div className="glass-panel p-10 hardware-border space-y-8">
                  <div className="space-y-2 text-left">
                    <div className="text-[10px] font-black text-accent uppercase tracking-widest">STEP 02 // REAL-TIME INTERACTION</div>
                    <h2 className="text-3xl font-black text-display">第二步：AI 自動化、互動與即時化</h2>
                    <p className="text-text-secondary text-sm">透過無縫 webhook 與 AI 模組，即時接收新顧客動態，並於十微秒內進行意圖剖析及自動化郵件/LINE 投送。</p>
                  </div>

                  {/* Immediate responder simulation card */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left side: Simulated inquiry console */}
                    <div className="p-6 bg-white/[0.02] border border-line rounded-2xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-line">
                        <span className="text-xs font-black text-white">顧客即時意圖測試</span>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs text-text-secondary">選擇一個顧客情境，測試 AI 如何在數十毫秒內完成自動化個人信件調試：</p>
                        
                        <div className="space-y-2">
                          <button 
                            onClick={() => {
                              setSimName('小明');
                              setSimEmail('ming@climb.tw');
                              setSimAudience('extreme');
                              setSimCurrentMail(1);
                              triggerToast('已模擬：熱愛登山的小明領取了指南。');
                            }}
                            className="w-full p-3 bg-white/5 hover:bg-white/10 text-left rounded-xl text-xs border border-line flex items-center justify-between"
                          >
                            <span>⛰️ 登山極限客小明：苦惱 GoPro 電池低溫續航</span>
                            <ChevronRight className="w-4 h-4 text-accent" />
                          </button>

                          <button 
                            onClick={() => {
                              setSimName('莉雅');
                              setSimEmail('liya@campingfamily.com');
                              setSimAudience('family');
                              setSimCurrentMail(2);
                              triggerToast('已模擬：露營媽媽莉雅領取了指南。');
                            }}
                            className="w-full p-3 bg-white/5 hover:bg-white/10 text-left rounded-xl text-xs border border-line flex items-center justify-between"
                          >
                            <span>⛺ 露營家庭莉雅：苦惱機身防護、手機容量不足</span>
                            <ChevronRight className="w-4 h-4 text-accent" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Auto responsive results */}
                    <div className="p-6 bg-white/[0.03] border border-dashed border-accent/20 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-3 text-left">
                        <div className="inline-block px-2 py-0.5 bg-accent/20 border border-accent/30 rounded text-[9px] font-black text-accent uppercase">
                          AI 即時調和模版 ( AR 引擎發信中)
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="text-white font-bold">訂閱者：<span className="text-accent">{simName}</span> ({simEmail})</div>
                          <div className="text-white font-bold">偏好主題：<span className="text-accent">{simAudience === 'extreme' ? '高山運動 / 極限運動設定' : '休閒自駕 / 生活紀錄'}</span></div>
                        </div>
                        <div className="p-4 bg-black/60 rounded-xl font-mono text-[11px] text-accent border border-line space-y-2 max-h-[160px] overflow-y-auto">
                          <div className="text-gray-500 font-sans"># 根據訂閱者特質，AI 即時精細微調信件：</div>
                          <div className="text-white">
                            {simAudience === 'extreme' 
                              ? `「嗨 ${simName}，你常年在酷寒山頂拍攝，我們懂電池秒跌的痛！手冊第一章解鎖了在 3000m 海拔自動關閉語音對焦的黑特設定，這可讓 Volta 壽命大增 35%...」`
                              : `「哈囉 ${simName}！帶孩子出門露營手忙腳亂，哪有時間調整複雜光圈？請快看手冊第二章，我們用一個小磁吸口，教你如何在 0.1 秒單手扣穩，不再害怕相機滑落水中...」`
                            }
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-line flex items-center justify-between">
                        <span className="text-[10px] text-text-secondary">AR 多渠道交付信：完成時間 0.08 秒</span>
                        <div className="flex gap-1 text-xs font-bold text-accent">
                          <Check className="w-4 h-4" /> 交付成功
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SYSTEM DESIGN (INPUT/PROCESS/OUTPUT) */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-8"
              >
                <div className="glass-panel p-10 hardware-border space-y-8">
                  <div className="space-y-2 text-left">
                    <div className="text-[10px] font-black text-accent uppercase tracking-widest">STEP 03 // DETAILED SYSTEM INFRASTRUCTURE</div>
                    <h2 className="text-3xl font-black text-display">第三步：創業系統架構設計</h2>
                    <p className="text-text-secondary text-sm">一個完整的自動化創業流程必須遵循 Input、Process 與 Output 循環優化結構，以確保流量與銷售轉換成倍增長。</p>
                  </div>

                  {/* Input -> Process -> Output interactive boxes */}
                  <div className="grid md:grid-cols-3 gap-6 relative">
                    {/* Input Container */}
                    <div className="p-6 bg-white/[0.02] border border-line rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 text-accent">
                        <Database className="w-5 h-5" />
                        <h4 className="font-black text-sm uppercase tracking-wider">A. 輸入端 (INPUT)</h4>
                      </div>
                      <div className="space-y-3 text-xs text-text-secondary">
                        <div className="p-3 bg-black/40 rounded-xl space-y-1">
                          <div className="text-[9px] font-black text-white uppercase">指定角色 (Role)</div>
                          <div className="text-accent font-mono capitalize">{role} Assistant</div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl space-y-1">
                          <div className="text-[9px] font-black text-white uppercase">核心目標 (Target)</div>
                          <div className="text-accent font-mono capitalize">{target.replace('_', ' ')}</div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl space-y-1">
                          <div className="text-[9px] font-black text-white uppercase">即時任務 (Task)</div>
                          <div className="text-white text-[10px] line-clamp-2">{task}</div>
                        </div>
                      </div>
                    </div>

                    {/* Process Container (Optimization Core) */}
                    <div className="p-6 bg-[#D11E8E]/5 border border-[#D11E8E]/20 rounded-2xl space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#D11E8E]/10 blur-xl rounded-full" />
                      <div className="flex items-center gap-2 text-[#D11E8E]">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <h4 className="font-black text-sm uppercase tracking-wider text-white">B. 優化端 (PROCESS)</h4>
                      </div>
                      <div className="space-y-3 text-xs">
                        <p className="text-text-secondary text-[11px]">
                          <strong>「優化在優化」核心引擎</strong>：根據前幾天的 A/B 點擊數據與郵件加載反饋，AI 自動修正標籤與手冊大綱。
                        </p>
                        
                        {isOptimizing ? (
                          <div className="space-y-2">
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                              <div style={{ width: `${optimizingProgress}%` }} className="bg-[#D11E8E] h-full" />
                            </div>
                            <span className="text-[9px] text-white">正在部署增強 Prompt ({optimizingProgress}%)</span>
                          </div>
                        ) : (
                          <button 
                            onClick={handleOptimizationRun}
                            className="w-full bg-[#D11E8E] hover:bg-[#b01676] text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                          >
                            點擊執行 AI 二次優化
                          </button>
                        )}

                        <div className="p-2.5 bg-black/60 rounded-lg max-h-[80px] overflow-y-auto font-mono text-[9px] text-[#D11E8E] leading-loose">
                          {optimizationLogs.map((log, i) => (
                            <div key={i}>{log}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Output Container */}
                    <div className="p-6 bg-white/[0.02] border border-line rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="w-5 h-5" />
                        <h4 className="font-black text-sm uppercase tracking-wider">C. 輸出端 (OUTPUT)</h4>
                      </div>
                      <div className="space-y-3 text-xs text-text-secondary">
                        <div className="p-3 bg-black/40 rounded-xl space-y-1">
                          <div className="text-[9px] font-black text-white uppercase">最終結果 (Result)</div>
                          <div className="text-green-400 font-bold">100% 機型與信件生合完成</div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl space-y-1">
                          <div className="text-[9px] font-black text-white uppercase">自動修正機制 (Correction)</div>
                          <div className="text-white text-[10px]">
                            {refinementStage === 'initial' 
                              ? '未執行二次精煉' 
                              : '修正文案細節，強化 Volta / 磁吸濾鏡加購暗示'
                            }
                          </div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl space-y-1">
                          <div className="text-[9px] font-black text-white uppercase">冷啟動回饋 (Feedback)</div>
                          <div className="text-white text-[10px]">顧客閱讀進度自動存回 vectorDB 供下次微調</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SCALE CORE (LARGE VS SMALL E-COMMERCE) */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-8"
              >
                <div className="glass-panel p-10 hardware-border space-y-8">
                  <div className="space-y-2 text-left">
                    <div className="text-[10px] font-black text-accent uppercase tracking-widest">STEP 04 // ENTRY POINTS COMPARISON</div>
                    <h2 className="text-3xl font-black text-display">第四步：大/小規模電子商務切入點</h2>
                    <p className="text-text-secondary text-sm">您可以選擇從大型成熟平台切入，或者選擇快速靈活、低成本的小型 DTC 漏斗自動發信模式。</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Option 1: Large Ecommerce */}
                    <div className={`p-8 rounded-[2rem] border transition-all space-y-6 ${
                      scale === 'large' ? 'bg-accent/10 border-accent' : 'bg-white/5 border-line'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded text-text-secondary font-black">PLATFORM RETAIL</span>
                          <h4 className="text-2xl font-black text-display text-white mt-1">大型電子商務切入</h4>
                        </div>
                        <Layers className="w-8 h-8 text-accent" />
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-xs text-text-secondary leading-relaxed">
                          整合亞馬遜 (Amazon)、蝦皮 (Shopee) 與 Shopify 官網。以大批發模式與完整的 API webhooks 庫存系統、物流系統整合。適合已有初始資金及想要多渠道覆蓋的品牌。
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs py-1.5 border-b border-line">
                            <span className="text-text-secondary">技術儲備要求</span>
                            <span className="text-white font-bold">極高 (需要後端 Server & Webhook)</span>
                          </div>
                          <div className="flex justify-between text-xs py-1.5 border-b border-line">
                            <span className="text-text-secondary">行銷預期預算</span>
                            <span className="text-white font-bold">每日 $500 - $5,000 USD</span>
                          </div>
                          <div className="flex justify-between text-xs py-1.5 border-b border-line">
                            <span className="text-text-secondary">營銷重點</span>
                            <span className="text-white font-bold">Lookalike 廣告、大流量自然評價沉澱</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => { setScale('large'); triggerToast('已切換至：大型電商架構。'); }}
                        className="w-full py-3 bg-white text-black font-black text-xs uppercase rounded-xl hover:bg-accent hover:text-white transition-all"
                      >
                        切換到大型電商切入模式
                      </button>
                    </div>

                    {/* Option 2: Small Ecommerce */}
                    <div className={`p-8 rounded-[2rem] border transition-all space-y-6 ${
                      scale === 'small' ? 'bg-accent/10 border-accent' : 'bg-white/5 border-line'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded text-text-secondary font-black">LEAD GENERATION</span>
                          <h4 className="text-2xl font-black text-display text-white mt-1">小型/DTC 自動化行銷</h4>
                        </div>
                        <Target className="w-8 h-8 text-accent" />
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-xs text-text-secondary leading-relaxed">
                          利用單一精美頁面 Landing Page 進行「名單捕獲」，再用 AR (自動回覆信件、LINE/TG 機器人) 進行「5天追蹤信」。適合自媒體、個人創業者與新創微型團隊。
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs py-1.5 border-b border-line">
                            <span className="text-text-secondary">技術儲備要求</span>
                            <span className="text-white font-bold">極低 (套版 + 簡單 AI API 即可)</span>
                          </div>
                          <div className="flex justify-between text-xs py-1.5 border-b border-line">
                            <span className="text-text-secondary">行銷預期預算</span>
                            <span className="text-white font-bold">每日 $20 - $100 USD</span>
                          </div>
                          <div className="flex justify-between text-xs py-1.5 border-b border-line">
                            <span className="text-text-secondary">營銷重點</span>
                            <span className="text-white font-bold">細分群組極致痛點手冊，肥皂劇轉單信</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => { setScale('small'); triggerToast('已切換至：小型 DTC 漏斗。'); }}
                        className="w-full py-3 bg-white text-black font-black text-xs uppercase rounded-xl hover:bg-accent hover:text-white transition-all"
                      >
                        切換到小型 / DTC 個人電商模式
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: AI PLATFORM INTEGRATION */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 0, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-8"
              >
                <div className="glass-panel p-10 hardware-border space-y-8">
                  <div className="space-y-2 text-left">
                    <div className="text-[10px] font-black text-accent uppercase tracking-widest">STEP 05 // SYSTEM API CODE & BLUEPRINT</div>
                    <h2 className="text-3xl font-black text-display">第五步：AI 工具應用與 API 整合部署</h2>
                    <p className="text-text-secondary text-sm">將 GPT, Gemini Pro 系列以及 AI Studio API 直接封裝至 GoPro 自動化銷售系統。以下提供完整代碼框架：</p>
                  </div>

                  {/* System code wrapper and template options */}
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white/5 border border-line rounded-lg text-xs font-mono text-accent"># SDK/TS</span>
                      <span className="px-3 py-1 bg-white/5 border border-line rounded-lg text-xs font-mono text-accent"># Node.js</span>
                      <span className="px-3 py-1 bg-white/5 border border-line rounded-lg text-xs font-mono text-accent"># GoogleGenAI</span>
                      <span className="px-3 py-1 bg-white/5 border border-line rounded-lg text-xs font-mono text-accent"># AutoPilot Agent</span>
                    </div>

                    <div className="p-6 bg-black rounded-2xl border border-line font-mono text-xs text-left text-text-secondary space-y-4 max-h-[350px] overflow-y-auto leading-relaxed">
                      <div className="text-gray-500">// 1. 引用 Google AI SDK 與初始化 (Lazy Initialization)</div>
                      <div className="text-white">import {"{"} GoogleGenAI {"}"} from "@google/genai";</div>
                      <div className="text-white">const ai = new GoogleGenAI({"{"} apiKey: process.env.GEMINI_API_KEY {"}"});</div>
                      
                      <br />
                      <div className="text-gray-500">// 2. 自動化肥皂劇行銷信件生成函數</div>
                      <div className="text-white">
                        export async function generateSoapOperaEmail(day: number, userName: string, preference: string) {"{"}
                      </div>
                      <div className="text-green-400">
                        &nbsp;&nbsp;const prompt = `你是一位世界級 GoPro 自媒體營銷專家。現在要寫給新名單 
                        {"${userName}"} 的 Day {"${day}"} 自動行銷信件。<br />
                        &nbsp;&nbsp;用戶痛點/偏好為: {"${preference}"}。<br />
                        &nbsp;&nbsp;請遵循肥皂劇敘事法(Soap Opera Sequence)，利用戲劇化開頭介紹 GoPro Volta 的特點，最後留下懸念暗示明天有更大驚喜。`;
                      </div>
                      
                      <div className="text-white">&nbsp;&nbsp;try {"{"}</div>
                      <div className="text-white">
                        &nbsp;&nbsp;&nbsp;&nbsp;const response = await ai.models.generateContent({"{"}
                      </div>
                      <div className="text-white">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;model: 'gemini-2.5-flash',</div>
                      <div className="text-white">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;contents: prompt,</div>
                      <div className="text-white">&nbsp;&nbsp;&nbsp;&nbsp;{"}"});</div>
                      <div className="text-white">&nbsp;&nbsp;&nbsp;&nbsp;return response.text;</div>
                      <div className="text-white">&nbsp;&nbsp;{"}"} catch (error) {"{"}</div>
                      <div className="text-white">&nbsp;&nbsp;&nbsp;&nbsp;console.error("發送失敗", error);</div>
                      <div className="text-white">&nbsp;&nbsp;{"}"}</div>
                      <div className="text-white">{"}"}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: SIMULATION WORKSPACE / PLATFORM APP DEMO */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-8"
              >
                {/* Visual smartphone or desktop viewer */}
                <div className="glass-panel p-8 hardware-border space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-line gap-4">
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-accent font-black uppercase tracking-widest">STEP 06 // DEPLOYED SYSTEM MULTI-VIEWPREVIEW</span>
                      <h4 className="text-text text-2xl font-black">第六步：極速落地自動銷售網站與 App 模擬</h4>
                      <p className="text-xs text-text-secondary">透過下方的手機模控版，直接與 AI 生成之最終 GoPro 站點和 Day 0-5 郵件投送鏈進行即時互動測試！</p>
                    </div>

                    <div className="flex gap-1.5 p-1 bg-white/5 border border-line rounded-xl">
                      <button 
                        onClick={() => setSimActiveTab('store')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${simActiveTab === 'store' ? 'bg-accent text-white' : 'text-text-secondary hover:text-white'}`}
                      >
                        DTC 購物頁
                      </button>
                      <button 
                        onClick={() => setSimActiveTab('ebook')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${simActiveTab === 'ebook' ? 'bg-accent text-white' : 'text-text-secondary hover:text-white'}`}
                      >
                        電子手冊 (.PDF)
                      </button>
                      <button 
                        onClick={() => setSimActiveTab('emails')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${simActiveTab === 'emails' ? 'bg-accent text-white' : 'text-text-secondary hover:text-white'}`}
                      >
                        AR 發信箱 ({simCurrentMail} 封已發送)
                      </button>
                    </div>
                  </div>

                  {/* Simulated App / Web Viewer Body */}
                  <div className="grid md:grid-cols-12 gap-6 items-stretch">
                    {/* User profile configuration for simulator */}
                    <div className="md:col-span-4 p-5 bg-white/5 border border-line rounded-2xl flex flex-col justify-between">
                      <div className="space-y-4 text-left">
                        <div className="text-[10px] font-black text-accent uppercase tracking-widest">模擬器測試環境</div>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[9px] text-text-secondary uppercase">測試者稱呼</label>
                            <input 
                              type="text" 
                              value={simName}
                              onChange={(e) => setSimName(e.target.value)}
                              className="w-full bg-white/5 border border-line rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-accent"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] text-text-secondary uppercase">測試電子郵件</label>
                            <input 
                              type="text" 
                              value={simEmail}
                              onChange={(e) => setSimEmail(e.target.value)}
                              className="w-full bg-white/5 border border-line rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-accent"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] text-text-secondary uppercase">定位族群屬性</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => { setSimAudience('extreme'); triggerToast('已設為：極限玩家。'); }}
                                className={`py-2 rounded-xl text-[10px] font-bold ${simAudience === 'extreme' ? 'bg-accent text-white border border-accent' : 'bg-white/5 text-text-secondary'}`}
                              >
                                ⛰️ 極限滑雪/攀岩
                              </button>
                              <button 
                                onClick={() => { setSimAudience('family'); triggerToast('已設為：休閒露營。'); }}
                                className={`py-2 rounded-xl text-[10px] font-bold ${simAudience === 'family' ? 'bg-accent text-white border border-accent' : 'bg-white/5 text-text-secondary'}`}
                              >
                                ⛺ 親子露營/Vlog
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-line space-y-2">
                        <div className="text-[9px] text-text-secondary font-bold uppercase">模擬器狀態回饋</div>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => {
                              setSimCurrentMail(prev => prev + 1);
                              triggerToast(`模擬發送：第 ${simCurrentMail + 1} 封自動肥皂劇行銷信。`);
                            }}
                            className="py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-black transition-all"
                          >
                            自動派信
                          </button>
                          <button 
                            onClick={() => {
                              setSimName('小何');
                              setSimEmail('he@sport.com');
                              setSimAudience('extreme');
                              setSimCurrentMail(0);
                              setSimUnlockedChapter(0);
                              setSimHasOrdered(false);
                              triggerToast('環境已重設為冷啟動。');
                            }}
                            className="py-2.5 bg-white/5 hover:bg-white/10 text-white border border-line rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> 重置環境
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Viewport viewport screen */}
                    <div className="md:col-span-8 bg-[#121214] border border-line rounded-3xl overflow-hidden shadow-2xl min-h-[400px] flex flex-col justify-between">
                      {/* Viewport Header */}
                      <div className="bg-[#1e1e24] px-6 py-3 flex items-center justify-between border-b border-line text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 bg-red-500 rounded-full" />
                          <div className="w-3.5 h-3.5 bg-yellow-500 rounded-full" />
                          <div className="w-3.5 h-3.5 bg-green-500 rounded-full" />
                        </div>
                        <div className="bg-black/40 px-6 py-1 rounded-full border border-line text-[10px] text-gray-400 font-mono w-72 truncate text-center">
                          https://goprohub.ai-startup/preview?user={simName}
                        </div>
                        <div className="text-[9px] bg-accent/20 text-accent font-black px-2 py-0.5 rounded uppercase font-mono">
                          {simActiveTab === 'store' ? 'DTC Store' : simActiveTab === 'ebook' ? 'E-Book PDF' : 'E-Mail Logs'}
                        </div>
                      </div>

                      {/* Viewport Main dynamic core */}
                      <div className="p-8 flex-1 overflow-y-auto max-h-[320px] text-left">
                        {/* VIEWPORT TAB 1: STORE FRONT */}
                        {simActiveTab === 'store' && (
                          <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-line">
                              <div>
                                <h5 className="font-extrabold text-sm text-accent">HERO13 Black 限時創作者精選</h5>
                                <p className="text-[10px] text-text-secondary leading-relaxed">包含 Volta 電池把手 + 磁吸相機背扣 + 實戰專業調校電子手冊 (.PDF)</p>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-400 line-through">$24,500</div>
                                <div className="text-md font-black text-white">$17,900</div>
                              </div>
                            </div>

                            <p className="text-xs text-text-secondary font-light">
                              親愛的 <span className="text-accent font-bold">{simName}</span>：感謝您使用手冊！這台是專為
                              <span className="text-white font-bold"> {simAudience === 'extreme' ? '高海拔與極速運動攝錄' : '家庭戶外活動與精彩記錄'}</span> 
                              量身定作之神器，Volta 握把能讓您在低溫下多拍出 35% 神級畫面。
                            </p>

                            {simHasOrdered ? (
                              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-green-400 font-black text-sm flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-5 h-5" /> 恭喜您！已付款完成。AI 回饋系統已將推薦參數記錄至您的庫存。
                              </div>
                            ) : (
                              <button 
                                onClick={() => {
                                  setSimHasOrdered(true);
                                  triggerToast('模擬訂購成功！觸發 AI 成效回饋。');
                                }}
                                className="w-full bg-accent hover:bg-accent-hover text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02]"
                              >
                                <ShoppingBag className="w-4 h-4" /> 點擊此處立即購買 ($17,900)
                              </button>
                            )}
                          </div>
                        )}

                        {/* VIEWPORT TAB 2: EBOOK PDF READER */}
                        {simActiveTab === 'ebook' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs pb-2 border-b border-line">
                              <span className="font-black text-accent font-mono uppercase">《GoPro 拍攝大師手冊》隨機閱讀器</span>
                              <span className="text-gray-400 font-bold">頁面 {simUnlockedChapter + 1} / 3</span>
                            </div>

                            <div className="bg-white text-black p-5 rounded-xl space-y-3 font-sans">
                              {/* Page Content depending on chapter */}
                              {simUnlockedChapter === 0 && (
                                <div className="space-y-2">
                                  <h6 className="font-bold text-sm text-gray-900">第一章：手動配置 5.3K 電視影級畫面設定 (名單：{simName})</h6>
                                  <p className="text-xs text-gray-600 leading-relaxed">
                                    注意：對於 {simAudience === 'extreme' ? '高低空極致防震' : '日常手舉行走錄製'}，
                                    請強制開啟 HyperSmooth 6.0 並調至 10-Bit 色彩。在極限晃動下，記得配備 Volta 手動延伸桿扣。
                                  </p>
                                </div>
                              )}
                              {simUnlockedChapter === 1 && (
                                <div className="space-y-2">
                                  <h6 className="font-bold text-sm text-gray-900">第二章：如何避免機身散熱不均而自動斷電</h6>
                                  <p className="text-xs text-gray-600 leading-relaxed">
                                    當長時間錄製高解析畫幅時，請卸下內建側門蓋板，換成外接供電蓋口，直接使用 Volta 供電。如此能減少 15% 機內溫升。
                                  </p>
                                </div>
                              )}
                              {simUnlockedChapter === 2 && (
                                <div className="space-y-2">
                                  <h6 className="font-bold text-sm text-gray-900">第三章：如何利用三點POV架高鏡頭錄製電影視野</h6>
                                  <p className="text-xs text-gray-600 leading-relaxed">
                                    當雙手不便操作(如衝浪或騎行)時，運用胸帶或咬嘴。鏡頭夾角水平向下調整 15 度，正好把載具或雙手拍進來。
                                  </p>
                                </div>
                              )}

                              <div className="flex justify-between pt-4 border-t border-gray-100">
                                <button 
                                  disabled={simUnlockedChapter === 0}
                                  onClick={() => setSimUnlockedChapter(prev => Math.max(0, prev - 1))}
                                  className="text-[10px] font-bold text-gray-500 hover:text-black disabled:opacity-30"
                                >
                                  上一頁
                                </button>
                                <button 
                                  disabled={simUnlockedChapter === 2}
                                  onClick={() => setSimUnlockedChapter(prev => Math.min(2, prev + 1))}
                                  className="text-[10px] font-bold text-accent hover:underline disabled:opacity-30"
                                >
                                  下一頁
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* VIEWPORT TAB 3: SOAP EMAILS LOGS */}
                        {simActiveTab === 'emails' && (
                          <div className="space-y-4 font-mono text-xs">
                            <div className="text-[10px] text-text-secondary pb-1.5 border-b border-line uppercase font-bold">
                              肥皂劇信件排程序列 (Soap Opera Dispatch Log)
                            </div>
                            
                            <div className="space-y-3">
                              {/* Day 0 */}
                              <div className={`p-4 rounded-xl border ${simCurrentMail >= 1 ? 'bg-accent/10 border-accent/40 text-white' : 'bg-white/5 border-line opacity-50'}`}>
                                <div className="flex justify-between text-[10px]">
                                  <span className="font-black text-accent uppercase">DAY 0 - 歡迎信件與手冊派送</span>
                                  {simCurrentMail >= 1 && <span className="text-green-400">● SENT SUCCESS</span>}
                                </div>
                                <div className="font-sans font-bold text-xs mt-1">標題：🎁 嗨！{simName}，這是你想學的 GoPro 拍攝手冊</div>
                              </div>

                              {/* Day 1 */}
                              <div className={`p-4 rounded-xl border ${simCurrentMail >= 2 ? 'bg-accent/10 border-accent/40 text-white' : 'bg-white/5 border-line opacity-50'}`}>
                                <div className="flex justify-between text-[10px]">
                                  <span className="font-black text-accent uppercase">DAY 1 - 提出核心衝突、解決痛點</span>
                                  {simCurrentMail >= 2 && <span className="text-green-400">● SENT SUCCESS</span>}
                                </div>
                                <div className="font-sans font-bold text-xs mt-1">標題：🤯 為什麼 90% 新手在 {simAudience === 'extreme' ? '山頂顛簸拍攝' : '手持旅行生活錄影'} 時快門常抓不穩？</div>
                              </div>

                              {/* Day 3 */}
                              <div className={`p-4 rounded-xl border ${simCurrentMail >= 3 ? 'bg-accent/10 border-accent/40 text-white' : 'bg-white/5 border-line opacity-50'}`}>
                                <div className="flex justify-between text-[10px]">
                                  <span className="font-black text-accent uppercase">DAY 3 - 提出驚人解決方案 & 加點優惠</span>
                                  {simCurrentMail >= 3 && <span className="text-green-400">● SENT SUCCESS</span>}
                                </div>
                                <div className="font-sans font-bold text-xs mt-1">標題：🎬 原本平凡露營影片，阿強「只多按了一次開關」就吸引百萬觀看！</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Viewport footer panel */}
                      <div className="bg-[#1a1a20] px-8 py-3.5 border-t border-line flex justify-between items-center text-[10px] text-text-secondary font-mono">
                        <span>技術驅動：Google Gemini API</span>
                        <span>自動化電商測試模塊 V1.0 - 完美編譯</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {localToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 bg-accent text-white px-6 py-4 rounded-xl shadow-2xl font-black text-sm z-50 border border-white/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            {localToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
