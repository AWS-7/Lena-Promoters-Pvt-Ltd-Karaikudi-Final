# Lena Promoters - Environment Setup

## Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

## Supabase Database Schema

Run the following SQL in your Supabase SQL Editor to create all required tables:

```sql
-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price TEXT NOT NULL,
  area_size TEXT NOT NULL,
  description TEXT,
  approval_status TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Services Table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials Table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  message TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery Table
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FAQ Table
CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Partners Table
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Certificates Table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  image_url TEXT,
  order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leads Table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings Table (single row)
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url TEXT,
  phone TEXT DEFAULT '+91 98765 43210',
  email TEXT DEFAULT 'info@lenapromoters.com',
  address TEXT DEFAULT 'Karaikudi, Tamil Nadu',
  whatsapp TEXT DEFAULT '+91 98765 43210',
  facebook TEXT,
  instagram TEXT,
  youtube TEXT,
  meta_title TEXT DEFAULT 'Lena Promoters Private Limited',
  meta_description TEXT DEFAULT 'Premium DTCP approved plots in Karaikudi',
  og_image TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings
INSERT INTO settings (phone, email, address, whatsapp, meta_title, meta_description)
VALUES ('+91 98765 43210', 'info@lenapromoters.com', 'Karaikudi, Tamil Nadu', '+91 98765 43210', 'Lena Promoters Private Limited', 'Premium DTCP approved plots in Karaikudi, Tamil Nadu');

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'lead',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Google Reviews Table
CREATE TABLE google_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_image TEXT,
  rating INTEGER DEFAULT 5,
  text TEXT NOT NULL,
  review_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Site Visit Bookings Table
CREATE TABLE site_visit_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  project_id TEXT,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Project Layouts Table
CREATE TABLE project_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  width INTEGER DEFAULT 800,
  height INTEGER DEFAULT 600,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Project Plots Table
CREATE TABLE project_plots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layout_id TEXT NOT NULL,
  plot_number TEXT NOT NULL,
  x INTEGER DEFAULT 0,
  y INTEGER DEFAULT 0,
  width INTEGER DEFAULT 80,
  height INTEGER DEFAULT 60,
  sqft INTEGER DEFAULT 1200,
  facing TEXT DEFAULT 'East',
  price TEXT DEFAULT '0',
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Row Level Security (RLS)

Enable RLS on all tables and allow anonymous read access for the frontend:

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads
CREATE POLICY "Allow anonymous read" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON services FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON faq FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON partners FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON certificates FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON settings FOR SELECT USING (true);

-- Allow anonymous inserts for leads (contact form)
CREATE POLICY "Allow anonymous insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous read" ON leads FOR SELECT USING (true);

-- New tables RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visit_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_plots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read" ON notifications FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON google_reviews FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON site_visit_bookings FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON project_layouts FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON project_plots FOR SELECT USING (true);

-- Allow anonymous inserts for notifications, bookings, and leads
CREATE POLICY "Allow anonymous insert" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert" ON site_visit_bookings FOR INSERT WITH CHECK (true);
```

## Admin Panel Access

The admin panel is available at `/admin/`. To protect it in production, add authentication using Supabase Auth or a simple password gate.
