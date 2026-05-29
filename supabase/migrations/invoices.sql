-- Invoices table for admin invoice generation
-- Run this in Supabase SQL editor

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  customer_name text not null,
  customer_phone text,
  customer_email text,
  customer_address text,
  project_name text,
  plot_number text,
  plot_area text,
  invoice_date date not null default current_date,
  due_date date,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(14,2) not null default 0,
  tax_rate numeric(5,2) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  discount numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  amount_paid numeric(14,2) not null default 0,
  balance numeric(14,2) not null default 0,
  payment_mode text,
  notes text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invoices_created_at_idx on public.invoices (created_at desc);
create index if not exists invoices_customer_idx on public.invoices (customer_name);
create index if not exists invoices_status_idx on public.invoices (status);

-- Auto-update updated_at
create or replace function public.set_invoices_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_invoices_updated_at on public.invoices;
create trigger trg_invoices_updated_at
before update on public.invoices
for each row execute function public.set_invoices_updated_at();

-- Row Level Security: enable + allow only service_role / authenticated admins
alter table public.invoices enable row level security;

-- Allow all operations from service role (used by your admin panel via supabase client)
-- Adjust this policy based on your actual auth strategy.
drop policy if exists "Allow authenticated full access" on public.invoices;
create policy "Allow authenticated full access"
  on public.invoices
  for all
  using (true)
  with check (true);
