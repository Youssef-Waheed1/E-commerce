-- ==============================
-- 1. اعمل الجداول دي في Supabase
-- ==============================

create table if not exists bags (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  category text default 'شنط',
  is_available boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  bag_id uuid references bags(id) on delete cascade,
  customer_name text not null,
  rating integer check (rating between 1 and 5),
  comment text,
  is_approved boolean default false,
  created_at timestamp default now()
);

create table if not exists settings (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null,
  updated_at timestamp default now()
);

-- الإعدادات الافتراضية (غير الأرقام لأرقامك الحقيقية)
insert into settings (key, value) values
  ('whatsapp_number', '201000000000'),
  ('vodafone_cash_number', '01000000000'),
  ('store_name', 'شنط بالخرز'),
  ('store_description', 'شنط يدوية مصنوعة بالخرز بأجمل التصاميم')
on conflict (key) do nothing;

-- ==============================
-- 2. تأمين الجداول (RLS)
-- ==============================

-- تأمين جدول الشنط
alter table bags enable row level security;
create policy "public read bags" on bags for select using (true);
create policy "admin write bags" on bags for all using (auth.role() = 'authenticated');

-- تأمين جدول التعليقات
alter table reviews enable row level security;
create policy "public insert reviews" on reviews for insert with check (true);
create policy "public read approved reviews" on reviews for select using (is_approved = true);
create policy "admin all reviews" on reviews for all using (auth.role() = 'authenticated');

-- تأمين جدول الإعدادات
alter table settings enable row level security;
create policy "public read settings" on settings for select using (true);
create policy "admin write settings" on settings for all using (auth.role() = 'authenticated');

-- ==============================
-- 3. Storage Bucket للصور
-- ==============================
-- روح Storage في Supabase واعمل bucket اسمه: bags-images وخليه Public

-- ==============================
-- 4. Storage Policy للصور
-- ==============================
-- بعد ما تعمل bucket اسمه bags-images وخليه Public، نفذ:

create policy "Public read images" on storage.objects
  for select using (bucket_id = 'bags-images');

create policy "Admin upload images" on storage.objects
  for insert with check (bucket_id = 'bags-images' AND auth.role() = 'authenticated');

create policy "Admin delete images" on storage.objects
  for delete using (bucket_id = 'bags-images' AND auth.role() = 'authenticated');
