-- Quiz Submissions Table
-- Stores final quiz submissions from teams
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  team_email TEXT NOT NULL UNIQUE,
  time_taken INTEGER NOT NULL, -- Time in seconds
  score INTEGER NOT NULL,
  questions JSONB NOT NULL, -- Array of question objects
  answers JSONB NOT NULL, -- Object mapping question IDs to answers
  submitted BOOLEAN DEFAULT true,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
  -- Add submitted column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_submissions' AND column_name = 'submitted'
  ) THEN
    ALTER TABLE quiz_submissions ADD COLUMN submitted BOOLEAN DEFAULT true;
  END IF;

  -- Add submitted_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_submissions' AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE quiz_submissions ADD COLUMN submitted_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_submissions' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE quiz_submissions ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Quiz Progress Table
-- Stores temporary progress for teams who haven't submitted yet
CREATE TABLE IF NOT EXISTS quiz_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  team_email TEXT NOT NULL UNIQUE,
  answers JSONB DEFAULT '{}'::jsonb,
  start_time TIMESTAMPTZ NOT NULL,
  current_question INTEGER DEFAULT 1,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_email ON quiz_submissions(team_email);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_submitted ON quiz_submissions(submitted);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_submitted_at ON quiz_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_progress_email ON quiz_progress(team_email);

-- Update existing rows to have submitted = true if column was just added
UPDATE quiz_submissions SET submitted = true WHERE submitted IS NULL;

-- Enable Row Level Security (RLS) on tables
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow insert on quiz_submissions" ON quiz_submissions;
DROP POLICY IF EXISTS "Allow read own submission" ON quiz_submissions;
DROP POLICY IF EXISTS "Allow insert on quiz_progress" ON quiz_progress;
DROP POLICY IF EXISTS "Allow update on quiz_progress" ON quiz_progress;
DROP POLICY IF EXISTS "Allow read own progress" ON quiz_progress;
DROP POLICY IF EXISTS "Allow delete own progress" ON quiz_progress;

-- Policy: Allow anyone to insert quiz submissions
-- This is needed for teams to submit their quiz answers
CREATE POLICY "Allow insert on quiz_submissions" 
ON quiz_submissions 
FOR INSERT 
WITH CHECK (true);

-- Policy: Allow anyone to read submissions (for admin dashboard)
CREATE POLICY "Allow read own submission" 
ON quiz_submissions 
FOR SELECT 
USING (true);

-- Policy: Allow anyone to insert quiz progress
-- This is needed for teams to save their progress during the quiz
CREATE POLICY "Allow insert on quiz_progress" 
ON quiz_progress 
FOR INSERT 
WITH CHECK (true);

-- Policy: Allow anyone to update quiz progress
CREATE POLICY "Allow update on quiz_progress" 
ON quiz_progress 
FOR UPDATE 
USING (true);

-- Policy: Allow anyone to read quiz progress
-- This allows teams to restore their progress if they reload
CREATE POLICY "Allow read own progress" 
ON quiz_progress 
FOR SELECT 
USING (true);

-- Policy: Allow anyone to delete quiz progress
-- This is used when a team submits (to clean up progress)
CREATE POLICY "Allow delete own progress" 
ON quiz_progress 
FOR DELETE 
USING (true);

