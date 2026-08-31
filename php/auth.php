<?php

function sendJson(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

function readJsonBody(): array
{
    $raw = file_get_contents('php://input');

    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);

    return is_array($data) ? $data : [];
}

function normalizeUser(array $user): array
{
    unset($user['password_hash'], $user['transaction_pin_hash'], $user['api_token']);

    return $user;
}

function normalizeEmail(string $email): string
{
    return strtolower(trim($email));
}

function normalizePhone(string $phone): string
{
    $normalized = preg_replace('/[^\d+]/', '', trim($phone));

    if ($normalized === '') {
        return '';
    }

    if (str_starts_with($normalized, '+')) {
        return '+' . preg_replace('/\D+/', '', substr($normalized, 1));
    }

    return preg_replace('/\D+/', '', $normalized);
}

function isValidPhoneNumber(string $phone): bool
{
    $normalized = normalizePhone($phone);

    return $normalized !== '' && preg_match('/^\+?[0-9]{10,15}$/', $normalized) === 1;
}

function generateToken(): string
{
    return bin2hex(random_bytes(32));
}

function getBearerToken(): ?string
{
    $candidateHeaders = [
        $_SERVER['HTTP_AUTHORIZATION'] ?? '',
        $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '',
        $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '',
    ];

    foreach ($candidateHeaders as $header) {
        if (preg_match('/Bearer\s+(\S+)/', $header, $matches)) {
            return $matches[1];
        }

        if ($header && preg_match('/^[A-Fa-f0-9]{64}$/', trim($header))) {
            return trim($header);
        }
    }

    if (!empty($_GET['token'])) {
        return trim((string) $_GET['token']);
    }

    return null;
}

function getAuthenticatedUser(): ?array
{
    $token = getBearerToken();

    if (!$token) {
        return null;
    }

    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare('SELECT * FROM users WHERE api_token = :token AND token_expires_at > NOW() LIMIT 1');
    $stmt->execute([':token' => $token]);
    $user = $stmt->fetch();

    return $user ?: null;
}

function requireAuth(): array
{
    $user = getAuthenticatedUser();

    if (!$user) {
        sendJson([
            'success' => false,
            'message' => 'Unauthorized. Please provide a valid token.',
        ], 401);
    }

    return $user;
}

function requireAdmin(): array
{
    $user = requireAuth();

    if ((int) ($user['is_admin'] ?? 0) !== 1) {
        sendJson([
            'success' => false,
            'message' => 'Forbidden. Admin access required.',
        ], 403);
    }

    return $user;
}

function hashPassword(string $password): string
{
    return password_hash($password, PASSWORD_BCRYPT);
}

function hashPin(string $pin): string
{
    return password_hash($pin, PASSWORD_BCRYPT);
}

function verifyPassword(string $password, string $hash): bool
{
    return password_verify($password, $hash);
}

function verifyPin(string $pin, string $hash): bool
{
    return password_verify($pin, $hash);
}

function createUserToken(PDO $pdo, int $userId): string
{
    $token = generateToken();
    $expiresAt = date('Y-m-d H:i:s', time() + 86400);

    $stmt = $pdo->prepare('UPDATE users SET api_token = :token, token_expires_at = :expires WHERE id = :id');
    $stmt->execute([
        ':token' => $token,
        ':expires' => $expiresAt,
        ':id' => $userId,
    ]);

    return $token;
}

function generateVerificationCode(): string
{
    return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
}

function createVerificationCode(PDO $pdo, int $userId): string
{
    // Delete any existing unused codes
    $pdo->prepare('DELETE FROM email_verification_codes WHERE user_id = :user_id AND verified_at IS NULL')
        ->execute([':user_id' => $userId]);
    
    $code = generateVerificationCode();
    $expiresAt = date('Y-m-d H:i:s', time() + 86400); // 24 hours
    
    $stmt = $pdo->prepare('INSERT INTO email_verification_codes (user_id, verification_code, expires_at) VALUES (:user_id, :code, :expires)');
    $stmt->execute([
        ':user_id' => $userId,
        ':code' => $code,
        ':expires' => $expiresAt,
    ]);
    
    return $code;
}

function verifyEmailCode(PDO $pdo, int $userId, string $code): bool
{
    $stmt = $pdo->prepare('
        SELECT id FROM email_verification_codes 
        WHERE user_id = :user_id 
        AND verification_code = :code 
        AND verified_at IS NULL 
        AND expires_at > NOW() 
        LIMIT 1
    ');
    $stmt->execute([
        ':user_id' => $userId,
        ':code' => trim($code),
    ]);
    
    $result = $stmt->fetch();
    
    if ($result) {
        // Mark as verified
        $updateStmt = $pdo->prepare('UPDATE email_verification_codes SET verified_at = NOW() WHERE id = :id');
        $updateStmt->execute([':id' => $result['id']]);
        
        // Update user status
        $userStmt = $pdo->prepare('UPDATE users SET email_verified = 1 WHERE id = :user_id');
        $userStmt->execute([':user_id' => $userId]);
        
        return true;
    }
    
    return false;
}

function createPasswordResetToken(PDO $pdo, int $userId): string
{
    // Delete any existing unused tokens
    $pdo->prepare('DELETE FROM password_reset_tokens WHERE user_id = :user_id AND used_at IS NULL')
        ->execute([':user_id' => $userId]);
    
    $code = generateVerificationCode();
    $token = generateToken();
    $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hour
    
    $stmt = $pdo->prepare('INSERT INTO password_reset_tokens (user_id, reset_code, reset_token, expires_at) VALUES (:user_id, :code, :token, :expires)');
    $stmt->execute([
        ':user_id' => $userId,
        ':code' => $code,
        ':token' => $token,
        ':expires' => $expiresAt,
    ]);
    
    return $code;
}

function verifyPasswordResetCode(PDO $pdo, int $userId, string $code): ?string
{
    $stmt = $pdo->prepare('
        SELECT reset_token FROM password_reset_tokens 
        WHERE user_id = :user_id 
        AND reset_code = :code 
        AND used_at IS NULL 
        AND expires_at > NOW() 
        LIMIT 1
    ');
    $stmt->execute([
        ':user_id' => $userId,
        ':code' => trim($code),
    ]);
    
    $result = $stmt->fetch();
    
    return $result ? $result['reset_token'] : null;
}

function resetPassword(PDO $pdo, int $userId, string $token, string $newPassword): bool
{
    $stmt = $pdo->prepare('
        SELECT id FROM password_reset_tokens 
        WHERE user_id = :user_id 
        AND reset_token = :token 
        AND used_at IS NULL 
        AND expires_at > NOW() 
        LIMIT 1
    ');
    $stmt->execute([
        ':user_id' => $userId,
        ':token' => $token,
    ]);
    
    $result = $stmt->fetch();
    
    if (!$result) {
        return false;
    }
    
    // Update password and mark token as used
    $pdo->prepare('UPDATE users SET password_hash = :password WHERE id = :user_id')
        ->execute([
            ':password' => hashPassword($newPassword),
            ':user_id' => $userId,
        ]);
    
    $pdo->prepare('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = :id')
        ->execute([':id' => $result['id']]);
    
    return true;
}
