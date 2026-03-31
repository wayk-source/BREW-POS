-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Category (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  CONSTRAINT Category_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Receipt (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  total_id bigint,
  business_name_id bigint,
  CONSTRAINT Receipt_pkey PRIMARY KEY (id),
  CONSTRAINT Receipt_business_name_id_fkey FOREIGN KEY (business_name_id) REFERENCES public.business_name(id),
  CONSTRAINT Receipt_total_id_fkey FOREIGN KEY (total_id) REFERENCES public.total_sales(id)
);
CREATE TABLE public.Record_sales (
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
CREATE TABLE public.business_name (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  store_name text NOT NULL,
  location text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT business_name_pkey PRIMARY KEY (id)
);
CREATE TABLE public.product (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  item_name text NOT NULL,
  item_size text,
  item_price numeric NOT NULL CHECK (item_price >= 0::numeric),
  category_id bigint,
  CONSTRAINT product_pkey PRIMARY KEY (id),
  CONSTRAINT product_category_fk FOREIGN KEY (category_id) REFERENCES public.Category(id)
);
CREATE TABLE public.total_sales (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  code_title text NOT NULL UNIQUE,
  total numeric CHECK (total >= 0::numeric),
  CONSTRAINT total_sales_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_admin (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  username text UNIQUE,
  password text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_admin_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_cashier (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  username text UNIQUE,
  password text,
  store_id bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_cashier_pkey PRIMARY KEY (id),
  CONSTRAINT user_cashier_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.business_name(id)
);
CREATE TABLE public.user_manager (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  username text UNIQUE,
  password text,
  store_id bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_manager_pkey PRIMARY KEY (id),
  CONSTRAINT user_manager_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.business_name(id)
);
CREATE TABLE public.user_owner (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  username text UNIQUE,
  password text,
  store_id bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_owner_pkey PRIMARY KEY (id),
  CONSTRAINT user_owner_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.business_name(id)
);