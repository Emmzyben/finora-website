<?php
require_once __DIR__ . '/php/db.php';

$pdo = getDatabaseConnection();

try {
    // Check if profile_image_path column already exists
    $columns = $pdo->query("SHOW COLUMNS FROM users LIKE 'profile_image_path'")->fetchAll();
    
    if (empty($columns)) {
        $pdo->exec('ALTER TABLE users ADD COLUMN profile_image_path VARCHAR(255) NULL AFTER api_token');
        echo 'Column profile_image_path added successfully.';
    } else {
        echo 'Column profile_image_path already exists.';
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
