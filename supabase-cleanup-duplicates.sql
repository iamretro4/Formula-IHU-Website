-- Cleanup script: Keep only the first submission per team
-- Run this in Supabase SQL Editor to remove duplicate submissions

-- Delete all submissions except the first one (by submitted_at) for each team
DELETE FROM quiz_submissions
WHERE id NOT IN (
  SELECT DISTINCT ON (team_email) id
  FROM quiz_submissions
  ORDER BY team_email, submitted_at ASC
);

-- Verify the cleanup
SELECT 
  team_email,
  COUNT(*) as submission_count,
  MIN(submitted_at) as first_submission,
  MAX(submitted_at) as last_submission
FROM quiz_submissions
GROUP BY team_email
HAVING COUNT(*) > 1;

-- This query should return no rows if cleanup was successful


