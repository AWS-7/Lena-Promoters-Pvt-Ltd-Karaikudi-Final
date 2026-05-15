-- Add image_url column to project_plots table
ALTER TABLE project_plots ADD COLUMN IF NOT EXISTS image_url TEXT;
