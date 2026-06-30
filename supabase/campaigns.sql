-- Festival / Campaign landing pages
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  headline TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  offer_text TEXT DEFAULT '',
  banner_url TEXT DEFAULT '',
  benefits JSONB NOT NULL DEFAULT '[]',
  project_ids JSONB NOT NULL DEFAULT '[]',
  start_date DATE,
  end_date DATE,
  whatsapp_message TEXT DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_slug ON campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON campaigns(active);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS allow_public_read_campaigns ON campaigns;
CREATE POLICY allow_public_read_campaigns ON campaigns
  FOR SELECT TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS allow_anon_manage_campaigns ON campaigns;
CREATE POLICY allow_anon_manage_campaigns ON campaigns
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Sample Pongal campaign (optional — edit dates/images after running)
INSERT INTO campaigns (
  slug, title, headline, subtitle, offer_text, banner_url, benefits,
  start_date, end_date, whatsapp_message, active
) VALUES (
  'pongal-2026',
  'Pongal Mega Offer 2026',
  'Buy 1 Plot, Get 1 Plot FREE!',
  'Limited-time Pongal celebration offer on DTCP approved plots in Karaikudi & Sivaganga.',
  'Valid for bookings made during the Pongal festival period. Terms apply.',
  '/hero-bg.jpg',
  '["Free Patta & Document registration","Complimentary Gold & Silver coin","Bank loan assistance","Free site visit & legal verification"]'::jsonb,
  CURRENT_DATE,
  (CURRENT_DATE + INTERVAL '14 days')::date,
  'Hi Lena Promoters, I am interested in the Pongal 2026 festival offer. Please share details.',
  true
) ON CONFLICT (slug) DO NOTHING;
