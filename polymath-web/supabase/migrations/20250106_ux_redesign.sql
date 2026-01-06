-- Polymath UX Redesign: Fresh Start Migration
-- Simplified model: binary read/not-read, one book at a time, queue system

-- Drop old tables we no longer need
DROP TABLE IF EXISTS polymath.books CASCADE;
DROP TABLE IF EXISTS polymath.daily_logs CASCADE;

-- Drop old functions (with full signatures to avoid ambiguity)
DROP FUNCTION IF EXISTS polymath.log_reading_session(TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT);
DROP FUNCTION IF EXISTS polymath.get_domain_recommendations(TEXT[]);

-- Recreate domain_progress with simplified schema
DROP TABLE IF EXISTS polymath.domain_progress CASCADE;
CREATE TABLE polymath.domain_progress (
  domain_id TEXT PRIMARY KEY REFERENCES polymath.domains(domain_id),
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'reading', 'read')),
  book_title TEXT,
  book_author TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reading queue table
DROP TABLE IF EXISTS polymath.reading_queue CASCADE;
CREATE TABLE polymath.reading_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id TEXT NOT NULL REFERENCES polymath.domains(domain_id),
  book_title TEXT NOT NULL,
  book_author TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(domain_id)
);

-- Create indexes
CREATE INDEX idx_domain_progress_status ON polymath.domain_progress(status);
CREATE INDEX idx_reading_queue_position ON polymath.reading_queue(position);

-- Enable RLS
ALTER TABLE polymath.domain_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE polymath.reading_queue ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (single-user app)
CREATE POLICY "Allow all on domain_progress" ON polymath.domain_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on reading_queue" ON polymath.reading_queue FOR ALL USING (true) WITH CHECK (true);

-- Grant access
GRANT ALL ON polymath.domain_progress TO anon, authenticated;
GRANT ALL ON polymath.reading_queue TO anon, authenticated;
