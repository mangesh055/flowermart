-- ==============================================================================
-- SANTOSH PUSHPA BHANDAR (संतोष पुष्प भंडार)
-- Database Migration: 001_initial_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABLE: admin_profiles
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2. TABLE: categories
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    name_marathi TEXT,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. TABLE: products
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    name_marathi TEXT,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    flower_type TEXT,
    occasion TEXT,
    sku TEXT UNIQUE,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    price_unit TEXT NOT NULL DEFAULT 'per_piece' CHECK (price_unit IN ('per_piece', 'per_pair', 'per_metre', 'per_set', 'per_kg', 'custom_quotation')),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    primary_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 4. TABLE: product_images
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. TABLE: orders
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_alternate_phone TEXT,
    fulfilment_type TEXT NOT NULL DEFAULT 'pickup' CHECK (fulfilment_type IN ('pickup', 'delivery')),
    delivery_address TEXT,
    required_date DATE NOT NULL,
    required_time TEXT,
    special_instructions TEXT,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_charge >= 0),
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
    advance_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (advance_paid >= 0),
    balance_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (balance_amount >= 0),
    payment_note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    admin_notes TEXT,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 6. TABLE: order_items
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    price_unit TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 7. TABLE: order_status_history
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    changed_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 8. TABLE: deliveries
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    delivery_address TEXT NOT NULL,
    delivery_date DATE NOT NULL,
    delivery_time TEXT,
    delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_person_name TEXT,
    delivery_person_phone TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'picked_up', 'out_for_delivery', 'delivered', 'failed')),
    maps_link TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 9. TABLE: custom_requests
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    occasion TEXT,
    reference_image_url TEXT,
    description TEXT,
    flower_preferences TEXT,
    preferred_colours TEXT,
    budget_min NUMERIC(10, 2),
    budget_max NUMERIC(10, 2),
    required_date DATE,
    additional_instructions TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'accepted', 'rejected', 'converted')),
    quoted_amount NUMERIC(10, 2),
    admin_notes TEXT,
    converted_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 10. TABLE: store_settings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name TEXT NOT NULL DEFAULT 'Santosh Pushpa Bhandar',
    store_name_marathi TEXT DEFAULT 'संतोष पुष्प भंडार',
    logo_url TEXT,
    whatsapp_number TEXT NOT NULL DEFAULT '919876543210',
    contact_number TEXT NOT NULL DEFAULT '+91 98765 43210',
    alternate_number TEXT,
    address TEXT NOT NULL DEFAULT 'Shop No. 4, Dadar Flower Market',
    address_marathi TEXT DEFAULT 'दुकान क्र. ४, दादर फूल बाजार',
    city TEXT DEFAULT 'Mumbai',
    state TEXT DEFAULT 'Maharashtra',
    pincode TEXT DEFAULT '400028',
    google_maps_link TEXT,
    opening_hours TEXT DEFAULT 'Mon - Sun: 5:00 AM - 10:00 PM',
    website_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    is_delivery_available BOOLEAN NOT NULL DEFAULT TRUE,
    default_delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    free_delivery_above NUMERIC(10, 2) DEFAULT 999.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 11. TABLE: activity_logs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_required_date ON public.orders(required_date);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON public.custom_requests(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_date ON public.deliveries(delivery_date);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid() AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public Read for Active Categories, Available Products & Store Settings
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Public can view available products" ON public.products
    FOR SELECT USING (is_available = TRUE OR public.is_admin());

CREATE POLICY "Public can view product images" ON public.product_images
    FOR SELECT USING (TRUE);

CREATE POLICY "Public can view store settings" ON public.store_settings
    FOR SELECT USING (TRUE);

-- Public can insert orders and order items
CREATE POLICY "Public can create orders" ON public.orders
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Public can create order items" ON public.order_items
    FOR INSERT WITH CHECK (TRUE);

-- Public can insert custom requests
CREATE POLICY "Public can create custom requests" ON public.custom_requests
    FOR INSERT WITH CHECK (TRUE);

-- Admins have full access to all tables
CREATE POLICY "Admins full access categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access products" ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access product images" ON public.product_images FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access order items" ON public.order_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access status history" ON public.order_status_history FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access deliveries" ON public.deliveries FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access custom requests" ON public.custom_requests FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access settings" ON public.store_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access profiles" ON public.admin_profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access logs" ON public.activity_logs FOR ALL USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- SEED INITIAL DATA: Categories & Default Store Settings
-- ------------------------------------------------------------------------------
INSERT INTO public.store_settings (
    store_name,
    store_name_marathi,
    whatsapp_number,
    contact_number,
    address,
    address_marathi,
    city,
    state,
    pincode,
    opening_hours,
    default_delivery_charge
) VALUES (
    'Santosh Pushpa Bhandar',
    'संतोष पुष्प भंडार',
    '919876543210',
    '+91 98765 43210',
    'Shop No. 4, Flower Market, Station Road, Dadar (West)',
    'दुकान क्र. ४, फूल बाजार, स्टेशन रोड, दादर (पश्चिम)',
    'Mumbai',
    'Maharashtra',
    '400028',
    'Mon - Sun: 5:00 AM - 10:00 PM',
    50.00
) ON CONFLICT DO NOTHING;

INSERT INTO public.categories (name, name_marathi, slug, description, display_order) VALUES
('Traditional Garlands', 'पारंपरिक हार', 'traditional-garlands', 'Classic marigold, sevanti and floral garlands for daily pooja and traditional rituals.', 1),
('Wedding Varmala', 'लग्न वरमाला', 'wedding-varmala', 'Exquisite designer varmala pairs with premium Dutch roses, orchids, and baby''s breath.', 2),
('Rose Garlands', 'गुलाबाचे हार', 'rose-garlands', 'Fragrant red, pink and pastel rose garlands handwoven to perfection.', 3),
('Jasmine Garlands', 'मोगरा / जाई-जुई हार', 'jasmine-garlands', 'Pure aromatic fresh jasmine (Mogra) and gajras for weddings and temple offerings.', 4),
('Pooja Garlands', 'पूजा हार', 'pooja-garlands', 'Auspicious sacred garlands specially created for deities, Satyanarayan, and Ganesh pooja.', 5),
('Mandap Decoration', 'मंडप सजावट', 'mandap-decoration', 'Floral torans, stage backdrops, and traditional pillars for marriage and cultural events.', 6),
('Car Decoration', 'कार सजावट', 'car-decoration', 'Fresh wedding and reception car floral styling with bouquets, ribbons and bonnet spreads.', 7),
('Custom Garlands', 'कस्टम / ऑर्डरनुसार हार', 'custom-garlands', 'Bespoke garlands customized according to your colour theme, length and flower preference.', 8)
ON CONFLICT (name) DO NOTHING;

