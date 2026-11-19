create extension if not exists pgcrypto;
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 description text not null,
 category text not null default 'business',
 icon text not null default '✦',
 monthly_price_cents integer check(monthly_price_cents is null or monthly_price_cents>=0),
 license_price_cents integer check(license_price_cents is null or license_price_cents>=0),
 is_active boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.products enable row level security;
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select using(is_active=true);
insert into public.products(name,description,category,icon,monthly_price_cents,license_price_cents,is_active) values
('Shop Manager Pro','Manage inventory, sales, suppliers and daily shop performance.','retail','▦',1500,9900,false),
('Hotel Manager Pro','Organise reservations, rooms, guest details and billing.','management','⌂',2500,14900,false),
('School Manager Pro','Manage students, classes, attendance, grades and fees.','management','▤',2000,12900,false),
('Restaurant POS','Take orders, manage tables, track sales and simplify checkout.','retail','◈',1200,7900,false),
('Business CRM','Keep customer records, follow leads and organise your sales pipeline.','business','◎',1000,5900,false),
('Pharmacy Manager','Track medicines, stock levels, suppliers and point-of-sale activity.','business','✚',1500,9900,false),
('Real Estate Manager','Organise property listings, enquiries, clients and rental records.','management','⌂',2000,12900,false);
-- Keep products inactive until each product is actually built and tested.
