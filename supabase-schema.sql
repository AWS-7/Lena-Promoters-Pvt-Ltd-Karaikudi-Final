-- Lena Promoters - Complete Supabase Schema
-- Run this in Supabase SQL Editor to set up all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROJECTS (Featured Projects section)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price TEXT NOT NULL,
  area_size TEXT NOT NULL,
  description TEXT NOT NULL,
  approval_status TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  backup_url TEXT DEFAULT '',
  featured BOOLEAN DEFAULT true,
  category TEXT DEFAULT 'government', -- government | local | ready
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SERVICES (Services section)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'file',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  backup_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. GALLERY
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  backup_url TEXT DEFAULT '',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. FAQ
CREATE TABLE IF NOT EXISTS faq (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PARTNERS
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  logo_url TEXT DEFAULT '',
  backup_logo_url TEXT DEFAULT '',
  website TEXT DEFAULT '',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CERTIFICATES
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  image_url TEXT NOT NULL,
  backup_url TEXT DEFAULT '',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. LEADS (Contact form + CRM)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  project_interest TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  notes TEXT DEFAULT '',
  follow_up_date TEXT DEFAULT '',
  admin_remarks TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. SITE SETTINGS (Footer, meta, contact info)
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT DEFAULT '',
  backup_logo_url TEXT DEFAULT '',
  phone TEXT NOT NULL DEFAULT '+91 98765 43210',
  email TEXT NOT NULL DEFAULT 'info@lenapromoters.com',
  address TEXT NOT NULL DEFAULT 'Karaikudi, Tamil Nadu',
  whatsapp TEXT NOT NULL DEFAULT '+91 98765 43210',
  facebook TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  youtube TEXT DEFAULT '',
  meta_title TEXT NOT NULL DEFAULT 'Lena Promoters - Premium Plots in Karaikudi',
  meta_description TEXT NOT NULL DEFAULT 'DTCP approved land layouts and plot sales in Karaikudi.',
  og_image TEXT DEFAULT '',
  backup_og_image TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. NOTIFICATIONS (Admin panel)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'lead',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. SITE VISIT BOOKINGS
CREATE TABLE IF NOT EXISTS site_visit_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  project_id TEXT DEFAULT '',
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. ENQUIRIES (Popup form submissions)
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT DEFAULT '',
  source TEXT DEFAULT 'website_popup',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. HOMEPAGE CONTENT (Dynamic sections)
CREATE TABLE IF NOT EXISTS homepage_content (
  section_key TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. PROJECT LAYOUTS (Layout Map)
CREATE TABLE IF NOT EXISTS project_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  backup_url TEXT DEFAULT '',
  width INTEGER DEFAULT 800,
  height INTEGER DEFAULT 600,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. PROJECT PLOTS (Layout Map plots)
CREATE TABLE IF NOT EXISTS project_plots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  layout_id UUID REFERENCES project_layouts(id) ON DELETE CASCADE,
  plot_number TEXT NOT NULL,
  x INTEGER DEFAULT 0,
  y INTEGER DEFAULT 0,
  width INTEGER DEFAULT 50,
  height INTEGER DEFAULT 50,
  sqft INTEGER DEFAULT 1200,
  facing TEXT DEFAULT 'East',
  price TEXT NOT NULL,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default settings
INSERT INTO settings (phone, email, address, whatsapp, meta_title, meta_description)
VALUES (
  '+91 98765 43210',
  'info@lenapromoters.com',
  'Karaikudi, Tamil Nadu, India',
  '+91 98765 43210',
  'Lena Promoters - Premium Plots in Karaikudi',
  'DTCP approved land layouts and plot sales in Karaikudi, Sivaganga. Trusted real estate partner since 2009.'
)
ON CONFLICT DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, location, price, area_size, description, approval_status, featured, category) VALUES
('Lena Nagar Phase 1', 'Karaikudi, Sivaganga', '8.5 Lakhs', '1200 sqft', 'DTCP approved layout with wide roads, gated entrance, and clear title plots near Karaikudi town.', 'DTCP Approved', true, 'government'),
('Lena Garden', 'Devakottai Road', '12 Lakhs', '2400 sqft', 'RERA registered premium residential plots with avenue trees, compound wall, and EB connection ready.', 'RERA Registered', true, 'government'),
('Lena Valley', 'Thirumayam', '5.5 Lakhs', '1000 sqft', 'Panchayat approved layout with peaceful surroundings and excellent road connectivity.', 'Panchayat Approved', true, 'local'),
('Lena Green City', 'Kottaiyur', '7 Lakhs', '1500 sqft', 'Local body approved plots with water and electricity facilities in a growing residential area.', 'Local Body Approved', true, 'local'),
('Lena Villa', 'Karaikudi Town', '45 Lakhs', '1800 sqft', 'Ready-to-move 2BHK independent house with modern design, car parking, and compound wall.', 'Ready to Move', true, 'ready'),
('Lena Residency', 'Devakottai', '38 Lakhs', '1500 sqft', 'Newly constructed 3BHK house with spacious rooms, modular kitchen, and garden space.', 'Under Construction', true, 'ready')
ON CONFLICT DO NOTHING;

-- Insert sample services
INSERT INTO services (title, description, icon, "order") VALUES
('Real Estate Consulting', 'Expert advice on property investment and market trends', 'bar-chart', 1),
('Property Exchange', 'Hassle-free property buying and selling services', 'hand-coins', 2),
('Bank Loan Assistance', 'Complete support for home and plot loans', 'landmark', 3),
('Construction Services', 'End-to-end building and renovation services', 'hard-hat', 4),
('Documentation Support', 'Legal verification and registration assistance', 'clipboard-check', 5),
('Legal Advisory', 'Property dispute resolution and legal consultation', 'scale', 6),
('Site Investigation', 'Professional land survey and feasibility analysis', 'search', 7)
ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (name, location, rating, message) VALUES
('Ramesh Kumar', 'Karaikudi', 5, 'Excellent service! Lena Promoters helped me find the perfect plot near Karaikudi. The DTCP approval process was smooth and hassle-free.'),
('Senthil Nathan', 'Chennai', 5, 'Very professional team. I invested in Lena Garden and the returns have been fantastic. Highly recommend for real estate investment.'),
('Priya Venkatesh', 'Madurai', 4, 'Great experience from start to finish. The site visit was well organized and all my questions were answered patiently.')
ON CONFLICT DO NOTHING;

-- Insert sample FAQ
INSERT INTO faq (question, answer, "order") VALUES
('What is DTCP approval and why is it important?', 'DTCP (Directorate of Town and Country Planning) approval ensures the layout follows government regulations. It guarantees clear legal title, proper road width, and essential amenities. All our layouts are DTCP approved.', 1),
('How do I book a site visit?', 'You can book a site visit through our website contact form or call us directly. We offer free site visits with our sales executives who will guide you through the property.', 2),
('Do you assist with bank loans?', 'Yes, we provide complete bank loan assistance. We have partnerships with major banks and can help you get the best interest rates for your plot or home loan.', 3),
('What documents will I receive after purchase?', 'You will receive Sale Deed, Encumbrance Certificate (EC), Patta, Chitta, and all NOCs. Our legal team ensures complete documentation.', 4),
('Can I resell the plot later?', 'Absolutely. All our plots come with clear titles and market appreciation potential. We also offer resale assistance through our Property Exchange service.', 5)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS) with policies for anonymous access
-- The app uses anon key for all Supabase operations (both frontend forms and admin panel)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts, then recreate
DROP POLICY IF EXISTS allow_all_anon_leads ON leads;
DROP POLICY IF EXISTS allow_all_anon_enquiries ON enquiries;
DROP POLICY IF EXISTS allow_all_anon_notifications ON notifications;
DROP POLICY IF EXISTS allow_anonymous_insert_leads ON leads;
DROP POLICY IF EXISTS allow_anonymous_insert_enquiries ON enquiries;
DROP POLICY IF EXISTS allow_anonymous_insert_notifications ON notifications;
DROP POLICY IF EXISTS allow_authenticated_read_leads ON leads;
DROP POLICY IF EXISTS allow_authenticated_read_enquiries ON enquiries;
DROP POLICY IF EXISTS allow_authenticated_read_notifications ON notifications;
DROP POLICY IF EXISTS allow_public_read_notifications ON notifications;
DROP POLICY IF EXISTS allow_public_read_leads ON leads;
DROP POLICY IF EXISTS allow_public_read_enquiries ON enquiries;

-- Allow all operations for anon role (website forms insert, admin panel reads/updates/deletes)
CREATE POLICY allow_all_anon_leads ON leads FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY allow_all_anon_enquiries ON enquiries FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY allow_all_anon_notifications ON notifications FOR ALL TO anon USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_services_order ON services("order");
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_site_visit_status ON site_visit_bookings(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);

-- ============================================
-- COMPLETE! All tables created with default data.
-- Next steps:
-- 1. Copy your Supabase URL and Anon Key to .env.local
-- 2. Set up Cloudinary for image uploads
-- 3. Deploy and test!
-- ============================================
