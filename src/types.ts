export interface GoProModel {
  id: string;
  name: string;
  releaseYear: number;
  price: string;
  image: string;
  description: string;
  specs: {
    [key: string]: string;
  };
  pros: string[];
  cons: string[];
  rating: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface VirtualItem {
  id: string;
  name: string;
  price: number;
  image: string;
  type: 'skin' | 'accessory' | 'effect';
}

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'camera' | 'mount' | 'battery' | 'case' | 'other';
  description: string;
  stock: number;
  rating: number;
}

export interface CartItem extends ShopProduct {
  quantity: number;
}

export interface GroupBuy {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  targetCount: number;
  currentCount: number;
  endTime: string;
  platform: 'general' | 'facebook' | 'line';
  description: string;
}

export interface UserProfile {
  name: string;
  level: number;
  exp: number;
  points: number;
  badges: Badge[];
  inventory: VirtualItem[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  level: number;
}

export interface AdCampaign {
  id: string;
  platform: 'facebook' | 'instagram' | 'youtube' | 'google';
  title: string;
  content: string;
  hook: string;
  cta: string;
  image: string;
}

export interface TargetAudience {
  id: string;
  segment: string;
  age: string;
  interests: string[];
  painPoints: string[];
  desire: string;
}

export interface FunnelEmail {
  id: string;
  day: number;
  subject: string;
  content: string;
  goal: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
