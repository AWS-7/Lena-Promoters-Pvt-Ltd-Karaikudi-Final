# Visitor Tracking Setup

## Step 1: Create the database table

Run this SQL in Supabase SQL Editor:

```sql
-- Visitor logs table
CREATE TABLE IF NOT EXISTS visitor_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text,
  cookie_id text,
  visit_date date NOT NULL,
  visit_count integer NOT NULL DEFAULT 1,
  first_visit timestamptz NOT NULL DEFAULT now(),
  last_visit timestamptz NOT NULL DEFAULT now(),
  device text CHECK (device IN ('mobile', 'desktop', 'tablet')),
  page text DEFAULT '/',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups by cookie + date (unique visitor tracking)
CREATE INDEX IF NOT EXISTS idx_visitor_logs_cookie_date
  ON visitor_logs(cookie_id, visit_date);

-- Index for IP fallback lookups
CREATE INDEX IF NOT EXISTS idx_visitor_logs_ip_date
  ON visitor_logs(ip_address, visit_date);

-- Index for date-range analytics queries
CREATE INDEX IF NOT EXISTS idx_visitor_logs_visit_date
  ON visitor_logs(visit_date DESC);

-- Index for device breakdown
CREATE INDEX IF NOT EXISTS idx_visitor_logs_device
  ON visitor_logs(device);
```

## Step 2: Done

The tracking system is active. Visit `/admin/analytics` to view visitor data.

## How it works

1. **Cookie**: A `lp_visitor_id` UUID cookie is set on first visit (expires in 30 days)
2. **IP Fallback**: If cookie is missing, IP address is used as identifier
3. **Daily Counting**: Each unique cookie+date combo counts as one "daily unique visitor"
4. **Visit Count**: Every page load increments the `visit_count` for that day
5. **Device Detection**: Automatically detects mobile/tablet/desktop from user agent
6. **Async**: Tracking fires 500ms after page load — never blocks rendering
