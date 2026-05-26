import { GoProModel, Badge, VirtualItem, LeaderboardEntry, ShopProduct, GroupBuy } from './types';

export const GROUP_BUYS: GroupBuy[] = [
  {
    id: 'gb1',
    name: 'HERO13 Black 專業套裝組',
    price: 329,
    originalPrice: 399,
    image: 'https://picsum.photos/seed/gb1/800/600',
    targetCount: 50,
    currentCount: 32,
    endTime: '2026-04-15T23:59:59Z',
    platform: 'general',
    description: '限時團購！滿 50 人即享 82 折優惠。'
  },
  {
    id: 'gb2',
    name: 'GoPro 官方 FB 粉絲專屬團 - 配件大禮包',
    price: 88,
    originalPrice: 150,
    image: 'https://picsum.photos/seed/gb2/800/600',
    targetCount: 100,
    currentCount: 85,
    endTime: '2026-04-10T12:00:00Z',
    platform: 'facebook',
    description: 'FB 社團限定！加入社團領取專屬折扣碼。'
  },
  {
    id: 'gb3',
    name: 'LINE 社群限定 - Enduro 電池 4 入組',
    price: 69,
    originalPrice: 96,
    image: 'https://picsum.photos/seed/gb3/800/600',
    targetCount: 30,
    currentCount: 28,
    endTime: '2026-04-08T20:00:00Z',
    platform: 'line',
    description: 'LINE 社群快閃團！最後 2 組名額。'
  }
];

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'hero-13-black',
    name: 'GoPro HERO13 Black',
    price: 399,
    image: 'https://picsum.photos/seed/hero13/800/600',
    category: 'camera',
    description: '終極運動相機，具備 HB 系列鏡頭相容性和磁吸式固定座。',
    stock: 15,
    rating: 4.8
  },
  {
    id: 'hero-12-black',
    name: 'GoPro HERO12 Black',
    price: 349,
    image: 'https://picsum.photos/seed/hero12/800/600',
    category: 'camera',
    description: '專業級影像品質，具備 HDR 影片和更長的運行時間。',
    stock: 24,
    rating: 4.6
  },
  {
    id: 'hero-11-black',
    name: 'GoPro HERO11 Black',
    price: 299,
    image: 'https://picsum.photos/seed/hero11/800/600',
    category: 'camera',
    description: '多功能 8:7 感光元件，方便社交媒體裁剪。',
    stock: 8,
    rating: 4.5
  },
  {
    id: 'volta',
    name: 'Volta 電池握把',
    price: 129,
    image: 'https://picsum.photos/seed/volta/800/600',
    category: 'battery',
    description: '具備三腳架與遙控功能的電池握把。',
    stock: 45,
    rating: 4.7
  },
  {
    id: 'max-lens-mod',
    name: 'Max 鏡頭模組 2.0',
    price: 99,
    image: 'https://picsum.photos/seed/maxlens/800/600',
    category: 'mount',
    description: '提供極致超廣角視野。',
    stock: 12,
    rating: 4.9
  },
  {
    id: 'enduro-battery',
    name: 'Enduro 充電電池',
    price: 24,
    image: 'https://picsum.photos/seed/battery/800/600',
    category: 'battery',
    description: '在寒冷天氣下表現更佳，充電速度更快。',
    stock: 120,
    rating: 4.8
  },
  {
    id: 'chesty',
    name: 'Chesty 胸前固定帶',
    price: 39,
    image: 'https://picsum.photos/seed/chesty/800/600',
    category: 'mount',
    description: '沉浸式第一人稱視角拍攝必備。',
    stock: 60,
    rating: 4.6
  }
];

export const GOPRO_MODELS: GoProModel[] = [
  {
    id: 'hero-13-black',
    name: 'GoPro HERO13 Black',
    releaseYear: 2024,
    price: '$399',
    image: 'https://picsum.photos/seed/hero13/800/600',
    description: '終極運動相機，具備 HB 系列鏡頭相容性和磁吸式固定座。',
    specs: {
      resolution: '5.3K60 / 4K120',
      waterproof: '33ft (10m)',
      stabilization: 'HyperSmooth 6.0',
      battery: '1900mAh Enduro',
      sensor: '1/1.9" CMOS',
      fov: '156° (HyperView)',
      audio: '3-Mic with Wind Noise Reduction',
      weight: '154g'
    },
    pros: ['HB 系列鏡頭支援', '磁吸式固定座', '更長的電池續航力'],
    cons: ['感光元件升級幅度小', '配件價格較高'],
    rating: 4.8,
  },
  {
    id: 'hero-12-black',
    name: 'GoPro HERO12 Black',
    releaseYear: 2023,
    price: '$349',
    image: 'https://picsum.photos/seed/hero12/800/600',
    description: '專業級影像品質，具備 HDR 影片和更長的運行時間。',
    specs: {
      resolution: '5.3K60 / 4K120',
      waterproof: '33ft (10m)',
      stabilization: 'HyperSmooth 6.0',
      battery: '1720mAh Enduro',
      sensor: '1/1.9" CMOS',
      fov: '156° (HyperView)',
      audio: '3-Mic Processing',
      weight: '154g'
    },
    pros: ['HDR 影片', '藍牙音訊支援', '無 GPS（電池續航力更好）'],
    cons: ['無 GPS', '感光元件與 Hero 11 相同'],
    rating: 4.6,
  },
  {
    id: 'hero-11-black',
    name: 'GoPro HERO11 Black',
    releaseYear: 2022,
    price: '$299',
    image: 'https://picsum.photos/seed/hero11/800/600',
    description: '多功能 8:7 感光元件，方便社交媒體裁剪。',
    specs: {
      resolution: '5.3K60 / 2.7K240',
      waterproof: '33ft (10m)',
      stabilization: 'HyperSmooth 5.0',
      battery: '1720mAh Enduro',
      sensor: '1/1.9" CMOS',
      fov: '155° (SuperView)',
      audio: 'Stereo + RAW Audio',
      weight: '153g'
    },
    pros: ['8:7 感光元件', '10-bit 色彩', '內含 Enduro 電池'],
    cons: ['高解析度下易發熱', '介面偶爾有延遲'],
    rating: 4.5,
  },
];

export const BADGES: Badge[] = [
  { id: 'b1', name: '初學者', icon: '🌱', description: '完成第一次登入', unlocked: true },
  { id: 'b2', name: '評論家', icon: '✍️', description: '發表 5 篇評論', unlocked: false },
  { id: 'b3', name: '極限玩家', icon: '🏂', description: '分享 10 個運動影片', unlocked: false },
  { id: 'b4', name: '慈善大使', icon: '🤝', description: '捐贈積分超過 1000', unlocked: false },
];

export const VIRTUAL_ITEMS: VirtualItem[] = [
  { id: 'v1', name: '黃金相機框', price: 500, image: 'https://picsum.photos/seed/gold/100/100', type: 'skin' },
  { id: 'v2', name: '霓虹特效', price: 300, image: 'https://picsum.photos/seed/neon/100/100', type: 'effect' },
  { id: 'v3', name: '虛擬潛水鏡', price: 200, image: 'https://picsum.photos/seed/dive/100/100', type: 'accessory' },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Alex Action', points: 15400, level: 42 },
  { rank: 2, name: 'GoPro Guru', points: 12800, level: 38 },
  { rank: 3, name: 'Sky Diver', points: 11200, level: 35 },
  { rank: 4, name: 'Surf King', points: 9500, level: 29 },
  { rank: 5, name: 'Mountain Biker', points: 8700, level: 25 },
];

export const GROUP_BUY_LEADERBOARD = [
  { rank: 1, name: '團購達人 小王', count: 15, saved: 12500 },
  { rank: 2, name: '極限攝影師 阿強', count: 12, saved: 9800 },
  { rank: 3, name: 'GoPro 收藏家', count: 10, saved: 8200 },
  { rank: 4, name: '戶外愛好者', count: 8, saved: 6500 },
  { rank: 5, name: '新手玩家', count: 5, saved: 4200 },
];

import { AdCampaign, TargetAudience, FunnelEmail } from './types';

export const FUNNEL_ADS: AdCampaign[] = [
  {
    id: 'ad-fb-1',
    platform: 'facebook',
    title: '攝影師不說的秘密',
    content: '為什麼你的 GoPro 影片總是很晃？不是因為你沒買雲台，而是設定錯了！',
    hook: '避開 90% 新手的致命錯誤',
    cta: '立即領取手冊',
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ad-ig-1',
    platform: 'instagram',
    title: '極限視角解密',
    content: '想要拍出像 Red Bull 選手一樣的視角？其實只要一個磁吸配件。',
    hook: '釋放你的雙手，記錄真實轉瞬',
    cta: '查看實戰技巧',
    image: 'https://images.unsplash.com/photo-1544273677-242d72975859?auto=format&fit=crop&q=80&w=800'
  }
];

export const TARGET_AUDIENCES: TargetAudience[] = [
  {
    id: 'ta-1',
    segment: '極限運動愛好者',
    age: '18-35',
    interests: ['單車', '衝浪', '滑板', 'Red Bull'],
    painPoints: ['畫面晃動', '電池續航力不足', '關鍵時刻沒錄到'],
    desire: '拍出震撼人心的第一人稱大片，在社交媒體獲得讚賞。'
  },
  {
    id: 'ta-2',
    segment: '家庭紀錄者',
    age: '28-45',
    interests: ['親子旅行', '露營', 'Vlog', '生活記錄'],
    painPoints: ['器材太重', '容易損壞', '手機容量不夠'],
    desire: '輕鬆捕捉孩子最珍貴的成長瞬間，防水防摔不用擔心。'
  }
];

export const FUNNEL_EMAILS: FunnelEmail[] = [
  {
    id: 'email-0',
    day: 0,
    subject: '🎁 這是你要的《GoPro 拍攝大師手冊》！',
    content: '嗨，很高興認識你！手冊在附件，今天先教你最重要的一件事：5.3K 錄製設定。',
    goal: '建立信任並交付贈品'
  },
  {
    id: 'email-1',
    day: 1,
    subject: '🤯 為什麼你的電池總是很快就沒電？',
    content: '手冊雖然寫了設定，但沒寫的是——這個「隱藏開關」會偷走你 30% 的電力。',
    goal: '提供額外價值 (High Value Post)'
  },
  {
    id: 'email-2',
    day: 2,
    subject: '🎬 他靠這一招，影片點閱破百萬',
    content: '案例分享：阿強只改了一個配件位置，整個運鏡感就出來了。',
    goal: '社會認同 (Social Proof) 與渴望'
  },
  {
    id: 'email-3',
    day: 3,
    subject: '⚠️ 你的專屬優惠即將失效...',
    content: '這是我為新朋友準備的創作者套裝 75 折優惠，最後 24 小時。',
    goal: '建立稀缺性 (Scarcity) 與催單'
  },
  {
    id: 'email-4',
    day: 5,
    subject: '最後一封：再見，還是開始？',
    content: '如果你還沒決定，沒關係。但別讓你的冒險精神因設備受限。',
    goal: '最後留人或引導至官方社群'
  }
];
