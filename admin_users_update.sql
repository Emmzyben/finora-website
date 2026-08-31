-- Add admin column if it does not exist
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_admin TINYINT(1) NOT NULL DEFAULT 0 AFTER account_status;

-- Optional: make a specific user an admin
-- Replace the email below with the admin account you want to use
UPDATE users
SET is_admin = 1
WHERE email = 'admin@finora.com';

-- Optional: verify the admin user
SELECT id, username, email, is_admin
FROM users
WHERE is_admin = 1;
