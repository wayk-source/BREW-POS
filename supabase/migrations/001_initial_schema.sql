-- =====================================================
-- BREW POS Database Schema
-- Based on database.md
-- =====================================================

-- Enable Row Level Security (RLS) on all tables
-- Note: You'll need to create appropriate policies after table creation

-- =====================================================
-- BUSINESS TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.business_name (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  store_name text NOT NULL,
  location text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT business_name_pkey PRIMARY KEY (id)
);

-- =====================================================
-- USER TABLES (Role-based)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_owner (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  username text UNIQUE,
  password text,
  store_id bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_owner_pkey PRIMARY KEY (id),
  CONSTRAINT user_owner_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.business_name(id)
);

CREATE TABLE IF NOT EXISTS public.user_manager (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  username text UNIQUE,
  password text,
  store_id bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_manager_pkey PRIMARY KEY (id),
  CONSTRAINT user_manager_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.business_name(id)
);

CREATE TABLE IF NOT EXISTS public.user_cashier (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  username text UNIQUE,
  password text,
  store_id bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_cashier_pkey PRIMARY KEY (id),
  CONSTRAINT user_cashier_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.business_name(id)
);

CREATE TABLE IF NOT EXISTS public.user_admin (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  username text UNIQUE,
  password text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_admin_pkey PRIMARY KEY (id)
);

-- =====================================================
-- PRODUCT & CATEGORY TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.Category (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  CONSTRAINT Category_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.product (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  item_name text NOT NULL,
  item_size text,
  item_price numeric NOT NULL CHECK (item_price >= 0::numeric),
  category_id bigint,
  CONSTRAINT product_pkey PRIMARY KEY (id),
  CONSTRAINT product_category_fk FOREIGN KEY (category_id) REFERENCES public.Category(id)
);

-- =====================================================
-- SALES TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.total_sales (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  code_title text NOT NULL UNIQUE,
  total numeric CHECK (total >= 0::numeric),
  CONSTRAINT total_sales_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.Record_sales (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  product_id bigint,
  code_title text NOT NULL,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  total_sales_id bigint,
  CONSTRAINT Record_sales_pkey PRIMARY KEY (id),
  CONSTRAINT record_sales_product_fk FOREIGN KEY (product_id) REFERENCES public.product(id),
  CONSTRAINT record_sales_total_fk FOREIGN KEY (total_sales_id) REFERENCES public.total_sales(id)
);

CREATE TABLE IF NOT EXISTS public.Receipt (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  total_id bigint,
  business_name_id bigint,
  CONSTRAINT Receipt_pkey PRIMARY KEY (id),
  CONSTRAINT Receipt_business_name_id_fkey FOREIGN KEY (business_name_id) REFERENCES public.business_name(id),
  CONSTRAINT Receipt_total_id_fkey FOREIGN KEY (total_id) REFERENCES public.total_sales(id)
);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample categories
INSERT INTO public.Category (name) VALUES
  ('Coffee'),
  ('Tea'),
  ('Pastries'),
  ('Sandwiches'),
  ('Add-ons')
ON CONFLICT DO NOTHING;

-- Insert sample products (requires category IDs to exist)
DO $$
DECLARE
  coffee_cat_id bigint;
  tea_cat_id bigint;
  pastry_cat_id bigint;
BEGIN
  SELECT id INTO coffee_cat_id FROM public.Category WHERE name = 'Coffee' LIMIT 1;
  SELECT id INTO tea_cat_id FROM public.Category WHERE name = 'Tea' LIMIT 1;
  SELECT id INTO pastry_cat_id FROM public.Category WHERE name = 'Pastries' LIMIT 1;

  IF coffee_cat_id IS NOT NULL THEN
    INSERT INTO public.product (item_name, item_price, category_id) VALUES
      ('Americano', 120, coffee_cat_id),
      ('Cappuccino', 160, coffee_cat_id),
      ('Latte', 180, coffee_cat_id),
      ('Espresso', 100, coffee_cat_id)
    ON CONFLICT DO NOTHING;
  END IF;

  IF tea_cat_id IS NOT NULL THEN
    INSERT INTO public.product (item_name, item_price, category_id) VALUES
      ('Green Tea', 80, tea_cat_id),
      ('Black Tea', 80, tea_cat_id)
    ON CONFLICT DO NOTHING;
  END IF;

  IF pastry_cat_id IS NOT NULL THEN
    INSERT INTO public.product (item_name, item_price, category_id) VALUES
      ('Croissant', 95, pastry_cat_id),
      ('Muffin', 105, pastry_cat_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =====================================================
-- INDEXES for better performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_business_name_store_name ON public.business_name(store_name);
CREATE INDEX IF NOT EXISTS idx_user_owner_store_id ON public.user_owner(store_id);
CREATE INDEX IF NOT EXISTS idx_user_manager_store_id ON public.user_manager(store_id);
CREATE INDEX IF NOT EXISTS idx_user_cashier_store_id ON public.user_cashier(store_id);
CREATE INDEX IF NOT EXISTS idx_product_category_id ON public.product(category_id);
CREATE INDEX IF NOT EXISTS idx_receipt_business_id ON public.Receipt(business_name_id);
CREATE INDEX IF NOT EXISTS idx_record_sales_total_id ON public.Record_sales(total_sales_id);

-- =====================================================
-- INSTRUCTIONS FOR RLS POLICIES
-- =====================================================
--
-- After creating the tables, you need to enable Row Level Security (RLS):
--
-- ALTER TABLE public.business_name ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_owner ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_manager ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_cashier ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_admin ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.product ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.Category ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.total_sales ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.Record_sales ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.Receipt ENABLE ROW LEVEL SECURITY;
--
-- For development, you can create permissive policies:
--
-- CREATE POLICY "Allow all for development" ON public.business_name
--   FOR ALL USING (true) WITH CHECK (true);
--
-- Repeat for all tables, or use the Supabase dashboard to create policies.
--
-- For production, create proper RLS policies that restrict access based on
-- the user's business (store_id) and role.
--
-- =====================================================

COMMIT;
