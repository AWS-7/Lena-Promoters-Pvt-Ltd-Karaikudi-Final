-- Add status column to enquiries table
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Add check constraint for status values
ALTER TABLE enquiries ADD CONSTRAINT status_check CHECK (status IN ('pending', 'verified'));

-- Update existing records to have default status
UPDATE enquiries SET status = 'pending' WHERE status IS NULL;
