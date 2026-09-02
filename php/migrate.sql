-- ============================================================
-- migrate.sql — Run this on your Hostinger database to fix
-- missing tables/columns that cause 500 errors on signup.
-- Safe to run multiple times (uses IF NOT EXISTS / IF NOT EXISTS).
-- ============================================================

-- 1. Add missing email_verified column to users (if not already there)
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS email_verified TINYINT(1) NOT NULL DEFAULT 0;

-- 2. Create email_verification_codes table
CREATE TABLE IF NOT EXISTS email_verification_codes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    verification_code VARCHAR(10) NOT NULL,
    expires_at DATETIME NOT NULL,
    verified_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_email_verification_codes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    reset_code VARCHAR(10) NOT NULL,
    reset_token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Indexes (ignore errors if they already exist)
CREATE INDEX IF NOT EXISTS idx_email_verification_codes_user_id ON email_verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
