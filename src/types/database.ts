export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type PriceUnit = 'per_piece' | 'per_pair' | 'per_metre' | 'per_set' | 'per_kg' | 'custom_quotation'
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled'
export type FulfilmentType = 'pickup' | 'delivery'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type CustomRequestStatus = 'new' | 'contacted' | 'quoted' | 'accepted' | 'rejected' | 'converted'

export interface AdminProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  role: 'super_admin' | 'admin'
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  name_marathi?: string
  slug: string
  description?: string
  image_url?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text?: string
  display_order: number
  is_primary: boolean
  created_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  name_marathi?: string
  slug: string
  description?: string
  flower_type?: string
  occasion?: string
  sku?: string
  price: number
  price_unit: PriceUnit
  is_available: boolean
  is_featured: boolean
  display_order: number
  primary_image_url?: string
  created_at: string
  updated_at?: string
  
  // Relations
  category?: Category
  images?: ProductImage[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  product_name: string
  product_sku?: string
  price_unit: PriceUnit
  unit_price: number
  quantity: number
  line_total: number
}

export interface OrderStatusHistory {
  id: string
  order_id: string
  status: OrderStatus
  note?: string
  changed_by?: string
  created_at: string
}

export interface Delivery {
  id: string
  order_id: string
  delivery_address: string
  delivery_date: string
  delivery_time?: string
  delivery_charge: number
  delivery_person_name?: string
  delivery_person_phone?: string
  status: 'scheduled' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'failed'
  maps_link?: string
  notes?: string
  created_at: string
  updated_at?: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_alternate_phone?: string
  fulfilment_type: FulfilmentType
  delivery_address?: string
  required_date: string
  required_time?: string
  special_instructions?: string
  subtotal: number
  delivery_charge: number
  total_amount: number
  advance_paid?: number
  balance_amount?: number
  payment_note?: string
  status: OrderStatus
  payment_status: PaymentStatus
  admin_notes?: string
  idempotency_key?: string
  created_at: string
  updated_at?: string

  // Relations
  items?: OrderItem[]
  status_history?: OrderStatusHistory[]
  delivery?: Delivery
}

export interface CustomRequest {
  id: string
  request_number: string
  customer_name: string
  customer_phone: string
  occasion?: string
  reference_image_url?: string
  description?: string
  flower_preferences?: string
  preferred_colours?: string
  budget_min?: number
  budget_max?: number
  required_date?: string
  additional_instructions?: string
  status: CustomRequestStatus
  quoted_amount?: number
  admin_notes?: string
  converted_order_id?: string
  created_at: string
  updated_at?: string
}

export interface StoreSettings {
  id: string
  store_name: string
  store_name_marathi?: string
  logo_url?: string
  whatsapp_number: string
  contact_number: string
  alternate_number?: string
  address: string
  address_marathi?: string
  city?: string
  state?: string
  pincode?: string
  google_maps_link?: string
  opening_hours?: string
  website_url?: string
  instagram_url?: string
  facebook_url?: string
  is_delivery_available: boolean
  default_delivery_charge: number
  free_delivery_above?: number
  created_at: string
  updated_at?: string
}

export interface ActivityLog {
  id: string
  admin_id?: string
  action: string
  entity_type?: string
  entity_id?: string
  details?: Json
  created_at: string
}

// Client-side cart item
export interface CartItem {
  product_id: string
  product_name: string
  product_slug: string
  image_url?: string
  unit_price: number
  price_unit: PriceUnit
  quantity: number
  line_total: number
  customization_notes?: string
  required_date?: string
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  delivery_charge: number
  total: number
}

