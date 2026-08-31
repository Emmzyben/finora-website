<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

$pdo = getDatabaseConnection();

echo "=== Security API Test ===\n\n";

// Create test user
echo "1. Creating test user...\n";
$testEmail = 'securitytest@example.com';
$testUsername = 'securitytest';
$testPassword = 'SecurePass123';
$testPin = '1234';

// Check if user exists
$check = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$check->execute([$testEmail]);
$existingUser = $check->fetch();

if (!$existingUser) {
    $stmt = $pdo->prepare('INSERT INTO users (
        username, email, password_hash, transaction_pin_hash, first_name, last_name,
        account_number, account_type, account_status, kyc_verified, balance,
        transaction_limit, currency, is_active, created_at
    ) VALUES (
        :username, :email, :password_hash, :transaction_pin_hash, :first_name, :last_name,
        :account_number, :account_type, :account_status, :kyc_verified, :balance,
        :transaction_limit, :currency, :is_active, NOW()
    )');

    $stmt->execute([
        ':username' => $testUsername,
        ':email' => $testEmail,
        ':password_hash' => hashPassword($testPassword),
        ':transaction_pin_hash' => hashPin($testPin),
        ':first_name' => 'Security',
        ':last_name' => 'Test',
        ':account_number' => str_pad((string) random_int(0, 9999999999), 10, '0', STR_PAD_LEFT),
        ':account_type' => 'Checking',
        ':account_status' => 'active',
        ':kyc_verified' => 1,
        ':balance' => 1000.00,
        ':transaction_limit' => 500000.00,
        ':currency' => 'USD',
        ':is_active' => 1,
    ]);

    echo "✓ Test user created: $testEmail\n";
    $userId = (int) $pdo->lastInsertId();
} else {
    echo "✓ Test user already exists: $testEmail\n";
    $userStmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $userStmt->execute([$testEmail]);
    $user = $userStmt->fetch();
    $userId = $user['id'];
}

// Log in to get token
echo "\n2. Logging in to get token...\n";
$token = createUserToken($pdo, $userId);
echo "✓ Token created: " . substr($token, 0, 20) . "...\n";

// Test password change
echo "\n3. Testing password change API...\n";
$newPassword = 'NewSecurePass456';

$testBody = json_encode([
    'current_password' => $testPassword,
    'new_password' => $newPassword,
    'confirm_new_password' => $newPassword,
]);

$ch = curl_init('http://localhost/finora/php/api.php?action=change-password&token=' . $token);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $testBody);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);
if ($httpCode === 200 && $result['success']) {
    echo "✓ Password change successful: " . $result['message'] . "\n";
} else {
    echo "✗ Password change failed (" . $httpCode . "): " . ($result['message'] ?? 'Unknown error') . "\n";
}

// Test PIN change
echo "\n4. Testing PIN change API...\n";
$newPin = '9876';

$testBody = json_encode([
    'current_pin' => $testPin,
    'new_pin' => $newPin,
    'confirm_new_pin' => $newPin,
]);

$ch = curl_init('http://localhost/finora/php/api.php?action=change-pin&token=' . $token);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $testBody);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);
if ($httpCode === 200 && $result['success']) {
    echo "✓ PIN change successful: " . $result['message'] . "\n";
} else {
    echo "✗ PIN change failed (" . $httpCode . "): " . ($result['message'] ?? 'Unknown error') . "\n";
}

echo "\n=== Test Complete ===\n";
?>
