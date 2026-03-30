export type UserRole = 'client' | 'admin';
export type Material = 'wood' | 'metal' | 'glass';
export type StairModel = 'mono' | 'zigzag' | 'console' | 'classic';
export type StairShape = 'straight' | 'l_shaped' | 'u_shaped' | 'spiral';
export type RailingType = 'wooden' | 'metal' | 'glass' | 'combo';
export type FinishType = 'basic' | 'premium' | 'designer';
export type OrderStatus =
  | 'new'
  | 'processing'
  | 'confirmed'
  | 'production'
  | 'ready'
  | 'installed'
  | 'completed'
  | 'cancelled';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  from_status?: OrderStatus | null;
  to_status: OrderStatus;
  comment?: string | null;
  created_at: string;
  created_by?: string | null;
}

export interface OrderParams {
  id: string;
  order_id: string;
  material: Material;
  steps_count: number;
  lighting: boolean;
  smart_light: boolean;
  extended_warranty: boolean;
  base_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  full_name: string;
  phone: string;
  address: string;
  notes?: string | null;
  admin_comment?: string | null;
  total_price: number;
  created_at: string;
  updated_at: string;
  params?: OrderParams | null;
  history?: OrderStatusHistory[];
}

export interface Review {
  id: string;
  user_id: string;
  author_name: string;
  rating: number;
  text: string;
  status: ReviewStatus;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  category: Material;
  slug?: string | null;
  is_featured?: boolean;
  display_order?: number;
  stair_model?: StairModel | null;
  stair_shape?: StairShape | null;
  railing_type?: RailingType | null;
  finish_type?: FinishType | null;
  image_url: string;
  price?: number | null;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string | null;
  price_from?: number | null;
  is_active: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  text: string;
  is_processed: boolean;
  created_at: string;
}

export type ChatSender = 'client' | 'manager' | 'system';
export type ChatSessionStatus = 'new' | 'active' | 'closed';

export interface ChatSession {
  id: string;
  client_token?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status: ChatSessionStatus;
  last_message?: string | null;
  last_sender?: ChatSender | null;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChatEntry {
  id: string;
  session_id: string;
  sender: ChatSender;
  text: string;
  created_at: string;
}

export interface CalculatorParams {
  material: Material;
  steps_count: number;
  lighting: boolean;
  smart_light: boolean;
  extended_warranty: boolean;
  stair_model?: StairModel;
  stair_shape?: StairShape;
  railing_type?: RailingType;
  finish_type?: FinishType;
  installation_floor?: 1 | 2 | 3;
  needs_measurement?: boolean;
}

export interface CalculatorResult {
  base_price: number;
  steps_cost: number;
  options_cost: number;
  model_cost: number;
  railing_cost: number;
  finish_cost: number;
  shape_cost: number;
  total: number;
}
