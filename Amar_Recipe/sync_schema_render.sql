-- Synchronize submission_requests table schema
-- Rename created_at to submission_date and add auditing columns

ALTER TABLE submission_requests RENAME COLUMN created_at TO submission_date;
ALTER TABLE submission_requests ADD COLUMN IF NOT EXISTS action_date TIMESTAMP DEFAULT NULL;
ALTER TABLE submission_requests ADD COLUMN IF NOT EXISTS admin_name VARCHAR(100) DEFAULT NULL;

-- Also check reports table just in case we need auditing there too
ALTER TABLE reports ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';
ALTER TABLE reports ADD COLUMN IF NOT EXISTS action_date TIMESTAMP DEFAULT NULL;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS admin_name VARCHAR(100) DEFAULT NULL;
