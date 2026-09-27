export type RecipeCategory =
  | 'Breakfast'
  | 'Lunch'
  | 'Dinner'
  | 'Baking'
  | 'Air Fryer'
  | 'Sourdough'
  | 'Kenyan Recipes';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category?: string;
  notes?: string;
}

export interface InstructionStep {
  step: number;
  title?: string;
  text: string;
  tip?: string;
  durationMinutes?: number;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  category: RecipeCategory;
  image: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  rating: number;
  reviewCount: number;
  description: string;
  featured?: boolean;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  tips: string[];
  archived?: boolean;
  draft?: boolean;
}

export interface CategoryInfo {
  id: string;
  name: RecipeCategory;
  count: string;
  image: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoId: string;
  publishedAt: string;
  description?: string;
  series?: string;
  featured?: boolean;
  archived?: boolean;
  draft?: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string[];
  featured?: boolean;
  archived?: boolean;
  draft?: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
  source: string;
}

export interface Newsletter {
  id: string;
  subject: string;
  previewText: string;
  content: string;
  audience: string;
  sentAt?: string;
  recipientCount: number;
  openRate?: string;
  clickRate?: string;
  status: 'sent' | 'draft' | 'scheduled';
  featuredRecipeId?: string;
}

export type UserRole = 'Admin' | 'Chef' | 'Editor';
export type UserStatus = 'active' | 'pending' | 'suspended';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  avatar?: string;
  recipesCount?: number;
  articlesCount?: number;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  measurementUnit: 'Metric' | 'Imperial';
  autoApproveComments: boolean;
  enableRatings: boolean;
  smtpConfigured: boolean;
  welcomeEmailEnabled: boolean;
  enforce2FA: boolean;
  selectedCategories?: RecipeCategory[];
  chefPhoto?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  pinterestUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

export interface AnalyticsEvent {
  id: string;
  eventType: 'page_view' | 'recipe_view' | 'article_view' | 'video_view' | 'newsletter_signup' | 'contact_submit';
  itemId?: string;
  itemTitle?: string;
  path?: string;
  createdAt: string;
  userAgent?: string;
}

