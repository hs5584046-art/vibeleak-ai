create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  contact text not null,
  utr_reference text not null,
  tool_id text,
  tool_title text,
  score integer,
  amount numeric,
  upi_id text,
  report_json jsonb,
  status text default 'pending',
  created_at timestamptz default now(),
  approved_at timestamptz
);
