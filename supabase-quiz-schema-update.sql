-- Add new columns to quiz_submissions table
ALTER TABLE quiz_submissions 
ADD COLUMN IF NOT EXISTS vehicle_category TEXT,
ADD COLUMN IF NOT EXISTS preferred_team_number TEXT,
ADD COLUMN IF NOT EXISTS alternative_team_number TEXT,
ADD COLUMN IF NOT EXISTS fuel_type TEXT;

-- Add comment for vehicle_category
COMMENT ON COLUMN quiz_submissions.vehicle_category IS 'Vehicle category: EV or CV';
COMMENT ON COLUMN quiz_submissions.preferred_team_number IS 'Preferred team number (e.g., E88, C12)';
COMMENT ON COLUMN quiz_submissions.alternative_team_number IS 'Alternative team number if preferred is not available';
COMMENT ON COLUMN quiz_submissions.fuel_type IS 'Fuel type for CV teams (e.g., Gasoline, E85, etc.)';

