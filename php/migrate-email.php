<?php
require_once __DIR__ . '/db.php';

$pdo = getDatabaseConnection();

try {
    // Add email_verified column to users table
    $columns = $pdo->query("SHOW COLUMNS FROM users LIKE 'email_verified'")->fetchAll();
    if (empty($columns)) {
        $pdo->exec('ALTER TABLE users ADD COLUMN email_verified TINYINT(1) NOT NULL DEFAULT 0 AFTER kyc_verified');
        echo "✓ Added email_verified column to users table\n";
    } else {
        echo "✓ email_verified column already exists\n";
    }

    // Create email_verification_codes table
    $pdo->exec('CREATE TABLE IF NOT EXISTS email_verification_codes (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        verification_code VARCHAR(6) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME NOT NULL,
        verified_at TIMESTAMP NULL,
        CONSTRAINT fk_email_verification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_code (user_id, verification_code),
        INDEX idx_expires (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
    echo "✓ Created email_verification_codes table\n";

    // Create password_reset_tokens table
    $pdo->exec('CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        reset_code VARCHAR(6) NOT NULL,
        reset_token VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME NOT NULL,
        used_at TIMESTAMP NULL,
        CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_code (user_id, reset_code),
        INDEX idx_token (reset_token),
        INDEX idx_expires (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
    echo "✓ Created password_reset_tokens table\n";

    echo "\n✓ Migration completed successfully!\n";
} catch (Exception $e) {
    echo "✗ Migration error: " . $e->getMessage() . "\n";
    exit(1);
}
