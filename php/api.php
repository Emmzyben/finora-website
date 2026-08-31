<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    error_log("PHP Error [$errno]: $errstr in $errfile on line $errline");
    return true;
});

set_exception_handler(function($exception) {
    error_log("Exception: " . $exception->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred.',
        'error' => $exception->getMessage(),
    ]);
    exit;
});

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/email-service.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? $_POST['action'] ?? null;

if (!$action) {
    sendJson([
        'success' => false,
        'message' => 'Missing action parameter.',
    ], 400);
}

$pdo = getDatabaseConnection();

switch ($action) {
    case 'signup':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $input = readJsonBody();

        $required = ['username', 'email', 'password', 'first_name', 'last_name', 'transaction_pin'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                sendJson(['success' => false, 'message' => "Missing required field: {$field}"], 400);
            }
        }

        $email = normalizeEmail((string) ($input['email'] ?? ''));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendJson(['success' => false, 'message' => 'Invalid email format.'], 400);
        }

        if (!preg_match('/^\d{4}$/', (string) $input['transaction_pin'])) {
            sendJson(['success' => false, 'message' => 'Transaction PIN must be exactly 4 numeric digits.'], 400);
        }

        $normalizedPhone = '';
        if (!empty($input['phone'])) {
            $normalizedPhone = normalizePhone((string) $input['phone']);
            if (!isValidPhoneNumber($normalizedPhone)) {
                sendJson(['success' => false, 'message' => 'Phone number must contain 10 to 15 digits and may include a leading +.'], 400);
            }
        }

        $username = trim($input['username']);

        $check = $pdo->prepare('SELECT id FROM users WHERE username = :username OR email = :email LIMIT 1');
        $check->execute([':username' => $username, ':email' => $email]);

        if ($check->fetch()) {
            sendJson(['success' => false, 'message' => 'Username or email already exists.'], 409);
        }

        $accountNumber = str_pad((string) random_int(0, 9999999999), 10, '0', STR_PAD_LEFT);
        $pin = isset($input['transaction_pin']) ? $input['transaction_pin'] : '0000';

        $stmt = $pdo->prepare('INSERT INTO users (
            username, email, password_hash, transaction_pin_hash, first_name, middle_name, last_name,
            phone, country, address, date_of_birth, account_number, account_type, account_status,
            kyc_verified, balance, transaction_limit, currency, is_active, created_at
        ) VALUES (
            :username, :email, :password_hash, :transaction_pin_hash, :first_name, :middle_name, :last_name,
            :phone, :country, :address, :date_of_birth, :account_number, :account_type, :account_status,
            :kyc_verified, :balance, :transaction_limit, :currency, :is_active, NOW()
        )');

        $stmt->execute([
            ':username' => $username,
            ':email' => $email,
            ':password_hash' => hashPassword($input['password']),
            ':transaction_pin_hash' => hashPin($pin),
            ':first_name' => trim($input['first_name']),
            ':middle_name' => trim($input['middle_name'] ?? ''),
            ':last_name' => trim($input['last_name']),
            ':phone' => $normalizedPhone,
            ':country' => trim($input['country'] ?? ''),
            ':address' => trim($input['address'] ?? ''),
            ':date_of_birth' => !empty($input['date_of_birth']) ? $input['date_of_birth'] : null,
            ':account_number' => $accountNumber,
            ':account_type' => trim($input['account_type'] ?? 'Checking'),
            ':account_status' => 'inactive',
            ':kyc_verified' => 0,
            ':balance' => 0.00,
            ':transaction_limit' => 500000.00,
            ':currency' => 'USD',
            ':is_active' => 1,
        ]);

        $userId = (int) $pdo->lastInsertId();
        $token = createUserToken($pdo, $userId);

        $user = $pdo->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $user->execute([':id' => $userId]);
        $savedUser = $user->fetch();

        // Send verification email
        $verificationCode = createVerificationCode($pdo, $userId);
        $emailService = new EmailService();
        $emailResult = $emailService->sendVerificationEmail(
            $savedUser['email'],
            $savedUser['first_name'] . ' ' . $savedUser['last_name'],
            $verificationCode
        );
        
        if (!$emailResult['success']) {
            error_log("Failed to send verification email to {$savedUser['email']}: " . $emailResult['message']);
        }

        sendJson([
            'success' => true,
            'message' => 'User created successfully. Please check your email to verify your account.',
            'token' => $token,
            'user' => normalizeUser($savedUser),
            'email_verification_required' => true,
            'email_sent_to' => $savedUser['email'],
        ], 201);

        break;

    case 'login':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $input = readJsonBody();

        $identifier = trim((string) ($input['email'] ?? $input['username'] ?? ''));
        $password = $input['password'] ?? '';

        if ($identifier === '' || $password === '') {
            sendJson(['success' => false, 'message' => 'Email/username and password are required.'], 400);
        }

        if (str_contains($identifier, '@')) {
            $identifier = normalizeEmail($identifier);
        }

        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email OR username = :username LIMIT 1');
        $stmt->execute([
            ':email' => $identifier,
            ':username' => $identifier,
        ]);
        $user = $stmt->fetch();

        if (!$user || !verifyPassword($password, $user['password_hash'])) {
            sendJson(['success' => false, 'message' => 'Invalid credentials.'], 401);
        }

        $token = createUserToken($pdo, (int) $user['id']);

        sendJson([
            'success' => true,
            'message' => 'Login successful.',
            'token' => $token,
            'user' => normalizeUser($user),
        ]);

        break;

    case 'me':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();
        sendJson([
            'success' => true,
            'user' => normalizeUser($user),
        ]);

        break;

    case 'change-password':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();
        $input = readJsonBody();

        $currentPassword = (string) ($input['current_password'] ?? '');
        $newPassword = (string) ($input['new_password'] ?? '');
        $confirmPassword = (string) ($input['confirm_new_password'] ?? '');

        if ($currentPassword === '' || $newPassword === '' || $confirmPassword === '') {
            sendJson(['success' => false, 'message' => 'Current password, new password, and confirmation are required.'], 400);
        }

        if (!verifyPassword($currentPassword, $user['password_hash'])) {
            sendJson(['success' => false, 'message' => 'Current password is incorrect.'], 401);
        }

        if (strlen($newPassword) < 8) {
            sendJson(['success' => false, 'message' => 'New password must be at least 8 characters long.'], 400);
        }

        if ($newPassword !== $confirmPassword) {
            sendJson(['success' => false, 'message' => 'New password and confirm password do not match.'], 400);
        }

        $pdo->prepare('UPDATE users SET password_hash = :password_hash WHERE id = :id')->execute([
            ':password_hash' => hashPassword($newPassword),
            ':id' => $user['id'],
        ]);

        sendJson([
            'success' => true,
            'message' => 'Password updated successfully.',
        ]);

        break;

    case 'change-pin':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();
        $input = readJsonBody();

        $currentPin = (string) ($input['current_pin'] ?? '');
        $newPin = (string) ($input['new_pin'] ?? '');
        $confirmPin = (string) ($input['confirm_new_pin'] ?? '');

        if ($currentPin === '' || $newPin === '' || $confirmPin === '') {
            sendJson(['success' => false, 'message' => 'Current PIN, new PIN, and confirmation are required.'], 400);
        }

        if (!verifyPin($currentPin, $user['transaction_pin_hash'] ?? '')) {
            sendJson(['success' => false, 'message' => 'Current PIN is incorrect.'], 401);
        }

        if (!preg_match('/^\d{4}$/', $newPin)) {
            sendJson(['success' => false, 'message' => 'New PIN must be exactly 4 numeric digits.'], 400);
        }

        if ($newPin !== $confirmPin) {
            sendJson(['success' => false, 'message' => 'New PIN and confirm PIN do not match.'], 400);
        }

        $pdo->prepare('UPDATE users SET transaction_pin_hash = :transaction_pin_hash WHERE id = :id')->execute([
            ':transaction_pin_hash' => hashPin($newPin),
            ':id' => $user['id'],
        ]);

        sendJson([
            'success' => true,
            'message' => 'Transaction PIN updated successfully.',
        ]);

        break;

    case 'profile':
        if ($method === 'GET') {
            $user = requireAuth();
            sendJson(['success' => true, 'user' => normalizeUser($user)]);
        }

        if ($method === 'PUT') {
            $user = requireAuth();
            $input = readJsonBody();

            $fields = [
                'first_name', 'middle_name', 'last_name', 'phone', 'country', 'address', 'date_of_birth', 'account_type'
            ];

            $updates = [];
            $params = ['id' => $user['id']];

            foreach ($fields as $field) {
                if (isset($input[$field]) && $input[$field] !== '') {
                    if ($field === 'phone') {
                        $phone = normalizePhone((string) $input[$field]);
                        if (!isValidPhoneNumber($phone)) {
                            sendJson(['success' => false, 'message' => 'Phone number must contain 10 to 15 digits and may include a leading +.'], 400);
                        }
                        $updates[] = "{$field} = :{$field}";
                        $params[":{$field}"] = $phone;
                        continue;
                    }

                    $updates[] = "{$field} = :{$field}";
                    $params[":{$field}"] = $input[$field];
                }
            }

            if (empty($updates)) {
                sendJson(['success' => false, 'message' => 'No profile fields to update.'], 400);
            }

            if (isset($input['email']) && trim((string) $input['email']) !== '') {
                $email = normalizeEmail((string) $input['email']);
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    sendJson(['success' => false, 'message' => 'Invalid email format.'], 400);
                }

                $emailCheck = $pdo->prepare('SELECT id FROM users WHERE email = :email AND id != :user_id LIMIT 1');
                $emailCheck->execute([':email' => $email, ':user_id' => $user['id']]);
                if ($emailCheck->fetch()) {
                    sendJson(['success' => false, 'message' => 'Email already in use.'], 409);
                }

                $updates[] = 'email = :email';
                $params[':email'] = $email;
            }

            $sql = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = :id';
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            $freshUser = $pdo->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
            $freshUser->execute([':id' => $user['id']]);
            $updatedUser = $freshUser->fetch();

            sendJson([
                'success' => true,
                'message' => 'Profile updated successfully.',
                'user' => normalizeUser($updatedUser),
            ]);
        }

        sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);

        break;

    case 'admin-dashboard':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $admin = requireAdmin();

        $pendingDepositsStmt = $pdo->prepare('SELECT COUNT(*) AS total FROM deposit_requests WHERE status = "pending"');
        $pendingDepositsStmt->execute();
        $pendingDeposits = (int) ($pendingDepositsStmt->fetch()['total'] ?? 0);

        $pendingTransfersStmt = $pdo->prepare('SELECT COUNT(*) AS total FROM transactions WHERE status = "pending" AND transaction_type IN ("transfer", "local_transfer", "wire_transfer", "paypal_transfer", "wise_transfer", "skrill_transfer", "venmo_transfer", "zelle_transfer", "revolut_transfer", "alipay_transfer", "wechatpay_transfer", "cashapp_transfer", "crypto_transfer")');
        $pendingTransfersStmt->execute();
        $pendingTransfers = (int) ($pendingTransfersStmt->fetch()['total'] ?? 0);

        $pendingLoansStmt = $pdo->prepare('SELECT COUNT(*) AS total FROM loan_applications WHERE status = "pending"');
        $pendingLoansStmt->execute();
        $pendingLoans = (int) ($pendingLoansStmt->fetch()['total'] ?? 0);

        $pendingCardsStmt = $pdo->prepare('SELECT COUNT(*) AS total FROM cards WHERE status = "pending"');
        $pendingCardsStmt->execute();
        $pendingCards = (int) ($pendingCardsStmt->fetch()['total'] ?? 0);

        $usersStmt = $pdo->query('SELECT COUNT(*) AS total FROM users');
        $userCount = (int) ($usersStmt->fetch()['total'] ?? 0);

        $totalBalanceStmt = $pdo->query('SELECT COALESCE(SUM(balance), 0) AS total FROM users');
        $totalBalance = (float) ($totalBalanceStmt->fetch()['total'] ?? 0);

        sendJson([
            'success' => true,
            'dashboard' => [
                'pending_deposits' => $pendingDeposits,
                'pending_transfers' => $pendingTransfers,
                'pending_loans' => $pendingLoans,
                'pending_cards' => $pendingCards,
                'total_users' => $userCount,
                'total_balance' => $totalBalance,
                'admin_name' => trim(($admin['first_name'] ?? '') . ' ' . ($admin['last_name'] ?? '')) ?: ($admin['username'] ?? 'Admin'),
            ],
        ]);

        break;

    case 'admin-users':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        requireAdmin();

        $stmt = $pdo->query('SELECT id, username, email, first_name, last_name, account_number, balance, country, is_admin FROM users ORDER BY created_at DESC LIMIT 200');
        sendJson([
            'success' => true,
            'users' => $stmt->fetchAll(),
        ]);

        break;

    case 'admin-deposit-requests':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        requireAdmin();

        $status = trim((string) ($_GET['status'] ?? 'pending'));
        $sql = 'SELECT dr.*, u.username, u.email, u.first_name, u.last_name, u.account_number FROM deposit_requests dr LEFT JOIN users u ON u.id = dr.user_id';
        $params = [];

        if ($status !== '') {
            $sql .= ' WHERE dr.status = :status';
            $params[':status'] = $status;
        }

        $sql .= ' ORDER BY dr.created_at DESC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        sendJson([
            'success' => true,
            'requests' => $stmt->fetchAll(),
        ]);

        break;

    case 'admin-approve-deposit':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        requireAdmin();
        $input = readJsonBody();
        $depositId = (int) ($input['id'] ?? 0);

        if ($depositId <= 0) {
            sendJson(['success' => false, 'message' => 'Deposit ID is required.'], 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM deposit_requests WHERE id = :id AND status = "pending" LIMIT 1');
        $stmt->execute([':id' => $depositId]);
        $deposit = $stmt->fetch();

        if (!$deposit) {
            sendJson(['success' => false, 'message' => 'Deposit request not found or not pending.'], 404);
        }

        $pdo->beginTransaction();

        $updateUser = $pdo->prepare('UPDATE users SET balance = balance + :amount WHERE id = :user_id');
        $updateUser->execute([
            ':amount' => (float) $deposit['amount'],
            ':user_id' => (int) $deposit['user_id'],
        ]);

        $updateRequest = $pdo->prepare('UPDATE deposit_requests SET status = "approved", updated_at = NOW() WHERE id = :id');
        $updateRequest->execute([':id' => $depositId]);

        $referenceId = 'DEP-APP-' . strtoupper(bin2hex(random_bytes(4))) . '-' . date('YmdHis');
        $transactionStmt = $pdo->prepare('INSERT INTO transactions (user_id, transaction_type, direction, amount, currency, status, description, reference_id, created_at) VALUES (:user_id, :transaction_type, :direction, :amount, :currency, :status, :description, :reference_id, NOW())');
        $transactionStmt->execute([
            ':user_id' => (int) $deposit['user_id'],
            ':transaction_type' => 'deposit',
            ':direction' => 'credit',
            ':amount' => (float) $deposit['amount'],
            ':currency' => $deposit['currency'] ?: 'USD',
            ':status' => 'completed',
            ':description' => 'Admin approved deposit request',
            ':reference_id' => $referenceId,
        ]);

        $pdo->commit();

        sendJson([
            'success' => true,
            'message' => 'Deposit approved and user balance updated.',
            'request_id' => $depositId,
        ]);

        break;

    case 'admin-loan-applications':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        requireAdmin();

        $status = trim((string) ($_GET['status'] ?? 'pending'));
        $sql = 'SELECT la.*, u.username, u.email, u.first_name, u.last_name, u.account_number FROM loan_applications la LEFT JOIN users u ON u.id = la.user_id';
        $params = [];

        if ($status !== '') {
            $sql .= ' WHERE la.status = :status';
            $params[':status'] = $status;
        }

        $sql .= ' ORDER BY la.created_at DESC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        sendJson([
            'success' => true,
            'applications' => $stmt->fetchAll(),
        ]);

        break;

    case 'admin-approve-loan':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        requireAdmin();
        $input = readJsonBody();
        $loanId = (int) ($input['id'] ?? 0);

        if ($loanId <= 0) {
            sendJson(['success' => false, 'message' => 'Loan ID is required.'], 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM loan_applications WHERE id = :id AND status = "pending" LIMIT 1');
        $stmt->execute([':id' => $loanId]);
        $loan = $stmt->fetch();

        if (!$loan) {
            sendJson(['success' => false, 'message' => 'Loan application not found or not pending.'], 404);
        }

        $pdo->beginTransaction();

        $updateLoan = $pdo->prepare('UPDATE loan_applications SET status = "approved", updated_at = NOW() WHERE id = :id');
        $updateLoan->execute([':id' => $loanId]);

        $updateBalance = $pdo->prepare('UPDATE users SET balance = balance + :amount WHERE id = :user_id');
        $updateBalance->execute([
            ':amount' => (float) $loan['loan_amount'],
            ':user_id' => (int) $loan['user_id'],
        ]);

        $referenceId = 'LOAN-APP-' . strtoupper(bin2hex(random_bytes(4))) . '-' . date('YmdHis');
        $transactionStmt = $pdo->prepare('INSERT INTO transactions (user_id, transaction_type, direction, amount, currency, status, description, reference_id, created_at) VALUES (:user_id, :transaction_type, :direction, :amount, :currency, :status, :description, :reference_id, NOW())');
        $transactionStmt->execute([
            ':user_id' => (int) $loan['user_id'],
            ':transaction_type' => 'loan',
            ':direction' => 'credit',
            ':amount' => (float) $loan['loan_amount'],
            ':currency' => 'USD',
            ':status' => 'completed',
            ':description' => 'Admin approved loan disbursement',
            ':reference_id' => $referenceId,
        ]);

        $pdo->commit();

        sendJson([
            'success' => true,
            'message' => 'Loan approved and disbursed to user account.',
            'application_id' => $loanId,
        ]);

        break;

    case 'admin-card-requests':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        requireAdmin();

        $status = trim((string) ($_GET['status'] ?? 'pending'));
        $sql = 'SELECT c.*, u.username, u.email, u.first_name, u.last_name, u.account_number FROM cards c LEFT JOIN users u ON u.id = c.user_id';
        $params = [];

        if ($status !== '') {
            $sql .= ' WHERE c.status = :status';
            $params[':status'] = $status;
        }

        $sql .= ' ORDER BY c.created_at DESC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        sendJson([
            'success' => true,
            'cards' => $stmt->fetchAll(),
        ]);

        break;

    case 'admin-approve-card':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        requireAdmin();
        $input = readJsonBody();
        $cardId = (int) ($input['id'] ?? 0);

        if ($cardId <= 0) {
            sendJson(['success' => false, 'message' => 'Card ID is required.'], 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM cards WHERE id = :id AND status = "pending" LIMIT 1');
        $stmt->execute([':id' => $cardId]);
        $card = $stmt->fetch();

        if (!$card) {
            sendJson(['success' => false, 'message' => 'Card request not found or not pending.'], 404);
        }

        $cardNumber = $card['card_number'] ?: 'FIN-' . strtoupper(bin2hex(random_bytes(4))) . '-' . str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
        $updateStmt = $pdo->prepare('UPDATE cards SET status = "active", card_number = :card_number, updated_at = NOW() WHERE id = :id');
        $updateStmt->execute([
            ':card_number' => $cardNumber,
            ':id' => $cardId,
        ]);

        sendJson([
            'success' => true,
            'message' => 'Card request approved and card activated.',
            'card_id' => $cardId,
        ]);

        break;

    case 'admin-transfer-requests':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        requireAdmin();

        $status = trim((string) ($_GET['status'] ?? 'pending'));
        $sql = 'SELECT t.*, u.username, u.email, u.first_name, u.last_name, u.account_number FROM transactions t LEFT JOIN users u ON u.id = t.user_id WHERE t.status = :status AND t.transaction_type IN ("transfer", "local_transfer", "wire_transfer", "paypal_transfer", "wise_transfer", "skrill_transfer", "venmo_transfer", "zelle_transfer", "revolut_transfer", "alipay_transfer", "wechatpay_transfer", "cashapp_transfer", "crypto_transfer") ORDER BY t.created_at DESC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':status' => $status]);

        sendJson([
            'success' => true,
            'transactions' => $stmt->fetchAll(),
        ]);

        break;

    case 'admin-approve-transfer':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        requireAdmin();
        $input = readJsonBody();
        $transactionId = (int) ($input['id'] ?? 0);

        if ($transactionId <= 0) {
            sendJson(['success' => false, 'message' => 'Transaction ID is required.'], 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM transactions WHERE id = :id AND status = "pending" LIMIT 1');
        $stmt->execute([':id' => $transactionId]);
        $transaction = $stmt->fetch();

        if (!$transaction) {
            sendJson(['success' => false, 'message' => 'Transfer request not found or not pending.'], 404);
        }

        $updateStmt = $pdo->prepare('UPDATE transactions SET status = "completed" WHERE id = :id');
        $updateStmt->execute([':id' => $transactionId]);

        sendJson([
            'success' => true,
            'message' => 'Transfer approved and marked completed.',
            'transaction_id' => $transactionId,
        ]);

        break;

    case 'admin-update-balance':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        requireAdmin();
        $input = readJsonBody();
        $userId = (int) ($input['user_id'] ?? 0);
        $amount = (float) ($input['amount'] ?? 0);
        $direction = strtolower(trim((string) ($input['direction'] ?? 'credit')));

        if ($userId <= 0) {
            sendJson(['success' => false, 'message' => 'User ID is required.'], 400);
        }

        if ($amount <= 0) {
            sendJson(['success' => false, 'message' => 'Amount must be greater than zero.'], 400);
        }

        if (!in_array($direction, ['credit', 'debit'], true)) {
            sendJson(['success' => false, 'message' => 'Direction must be credit or debit.'], 400);
        }

        $userStmt = $pdo->prepare('SELECT id, balance FROM users WHERE id = :id LIMIT 1');
        $userStmt->execute([':id' => $userId]);
        $user = $userStmt->fetch();

        if (!$user) {
            sendJson(['success' => false, 'message' => 'User not found.'], 404);
        }

        if ($direction === 'debit' && (float) $user['balance'] < $amount) {
            sendJson(['success' => false, 'message' => 'Cannot debit more than the available user balance.'], 400);
        }

        $pdo->beginTransaction();

        $signedAmount = $direction === 'credit' ? $amount : -$amount;
        $updateBalance = $pdo->prepare('UPDATE users SET balance = balance + :delta WHERE id = :id');
        $updateBalance->execute([
            ':delta' => $signedAmount,
            ':id' => $userId,
        ]);

        $referenceId = 'BAL-ADJ-' . strtoupper(bin2hex(random_bytes(4))) . '-' . date('YmdHis');
        $txnStmt = $pdo->prepare('INSERT INTO transactions (user_id, transaction_type, direction, amount, currency, status, description, reference_id, created_at) VALUES (:user_id, :transaction_type, :direction, :amount, :currency, :status, :description, :reference_id, NOW())');
        $txnStmt->execute([
            ':user_id' => $userId,
            ':transaction_type' => 'deposit',
            ':direction' => $direction,
            ':amount' => $amount,
            ':currency' => 'USD',
            ':status' => 'completed',
            ':description' => 'Manual balance adjustment by admin',
            ':reference_id' => $referenceId,
        ]);

        $pdo->commit();

        sendJson([
            'success' => true,
            'message' => 'User balance updated successfully.',
            'user_id' => $userId,
            'direction' => $direction,
            'amount' => $amount,
        ]);

        break;

    case 'dashboard':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();

        $incomeStmt = $pdo->prepare('SELECT COALESCE(SUM(amount), 0) AS total_income FROM transactions WHERE user_id = :user_id AND transaction_type IN ("deposit", "refund", "transfer") AND direction = "credit"');
        $incomeStmt->execute([':user_id' => $user['id']]);
        $income = (float) ($incomeStmt->fetch()['total_income'] ?? 0);

        $outgoingStmt = $pdo->prepare('SELECT COALESCE(SUM(amount), 0) AS total_outgoing FROM transactions WHERE user_id = :user_id AND transaction_type IN ("withdrawal", "transfer", "fee", "loan") AND direction = "debit"');
        $outgoingStmt->execute([':user_id' => $user['id']]);
        $outgoing = (float) ($outgoingStmt->fetch()['total_outgoing'] ?? 0);

        sendJson([
            'success' => true,
            'dashboard' => [
                'account_number' => $user['account_number'],
                'account_type' => $user['account_type'],
                'account_status' => $user['account_status'],
                'balance' => (float) $user['balance'],
                'transaction_limit' => (float) $user['transaction_limit'],
                'monthly_income' => $income,
                'monthly_outgoing' => $outgoing,
                'currency' => $user['currency'],
                'full_name' => trim(($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? '')),
            ],
        ]);

        break;

    case 'cards':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();

        $stmt = $pdo->prepare('SELECT * FROM cards WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->execute([':user_id' => $user['id']]);
        $cards = $stmt->fetchAll();

        sendJson([
            'success' => true,
            'cards' => $cards,
            'active_cards' => count(array_filter($cards, fn($card) => ($card['status'] ?? '') === 'active')),
            'pending_cards' => count(array_filter($cards, fn($card) => ($card['status'] ?? '') === 'pending')),
            'total_balance' => array_reduce($cards, fn($total, $card) => $total + (float) ($card['balance'] ?? 0), 0.0),
        ]);

        break;

    case 'apply-card':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();
        $input = readJsonBody();

        $required = ['card_type', 'card_level', 'currency', 'daily_spending_limit', 'cardholder_name', 'billing_address'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || trim((string) $input[$field]) === '') {
                sendJson(['success' => false, 'message' => "Missing required field: {$field}"], 400);
            }
        }

        $cardType = trim((string) $input['card_type']);
        $cardLevel = trim((string) $input['card_level']);
        $currency = strtoupper(trim((string) $input['currency']));
        $dailySpendingLimit = (float) $input['daily_spending_limit'];
        $cardholderName = trim((string) $input['cardholder_name']);
        $billingAddress = trim((string) $input['billing_address']);

        if (!in_array($cardType, ['visa', 'mastercard', 'amex'], true)) {
            sendJson(['success' => false, 'message' => 'Invalid card type selected.'], 400);
        }

        if ($dailySpendingLimit <= 0) {
            sendJson(['success' => false, 'message' => 'Daily spending limit must be greater than zero.'], 400);
        }

        $cardNumber = 'FIN-' . strtoupper(bin2hex(random_bytes(4))) . '-' . str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT);

        $stmt = $pdo->prepare('INSERT INTO cards (
            user_id, card_type, card_level, currency, daily_spending_limit,
            cardholder_name, billing_address, card_number, balance, status, created_at
        ) VALUES (
            :user_id, :card_type, :card_level, :currency, :daily_spending_limit,
            :cardholder_name, :billing_address, :card_number, :balance, :status, NOW()
        )');

        $stmt->execute([
            ':user_id' => $user['id'],
            ':card_type' => $cardType,
            ':card_level' => $cardLevel,
            ':currency' => $currency,
            ':daily_spending_limit' => $dailySpendingLimit,
            ':cardholder_name' => $cardholderName,
            ':billing_address' => $billingAddress,
            ':card_number' => $cardNumber,
            ':balance' => 0.00,
            ':status' => 'pending',
        ]);

        $cardId = (int) $pdo->lastInsertId();
        $fetchStmt = $pdo->prepare('SELECT * FROM cards WHERE id = :id LIMIT 1');
        $fetchStmt->execute([':id' => $cardId]);
        $card = $fetchStmt->fetch();

        sendJson([
            'success' => true,
            'message' => 'Card application submitted successfully.',
            'card' => $card,
        ], 201);

        break;

    case 'loan-applications':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();

        $stmt = $pdo->prepare('SELECT * FROM loan_applications WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->execute([':user_id' => $user['id']]);
        $loans = $stmt->fetchAll();

        sendJson([
            'success' => true,
            'loan_applications' => $loans,
        ]);

        break;

    case 'apply-loan':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();
        $input = readJsonBody();

        $required = ['loan_amount', 'loan_duration_months', 'credit_facility', 'loan_purpose', 'monthly_net_income', 'terms_accepted'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || trim((string) $input[$field]) === '') {
                sendJson(['success' => false, 'message' => "Missing required field: {$field}"], 400);
            }
        }

        $loanAmount = (float) $input['loan_amount'];
        $loanDurationMonths = (int) $input['loan_duration_months'];
        $creditFacility = trim((string) $input['credit_facility']);
        $loanPurpose = trim((string) $input['loan_purpose']);
        $monthlyNetIncome = trim((string) $input['monthly_net_income']);
        $termsAccepted = !empty($input['terms_accepted']) && (bool) $input['terms_accepted'];

        if ($loanAmount <= 0) {
            sendJson(['success' => false, 'message' => 'Loan amount must be greater than zero.'], 400);
        }

        if ($loanDurationMonths <= 0) {
            sendJson(['success' => false, 'message' => 'Loan duration must be greater than zero.'], 400);
        }

        if (!$termsAccepted) {
            sendJson(['success' => false, 'message' => 'You must accept the terms and conditions.'], 400);
        }

        $stmt = $pdo->prepare('INSERT INTO loan_applications (
            user_id, loan_amount, loan_duration_months, credit_facility, loan_purpose, monthly_net_income, terms_accepted, status, created_at
        ) VALUES (
            :user_id, :loan_amount, :loan_duration_months, :credit_facility, :loan_purpose, :monthly_net_income, :terms_accepted, :status, NOW()
        )');

        $stmt->execute([
            ':user_id' => $user['id'],
            ':loan_amount' => $loanAmount,
            ':loan_duration_months' => $loanDurationMonths,
            ':credit_facility' => $creditFacility,
            ':loan_purpose' => $loanPurpose,
            ':monthly_net_income' => $monthlyNetIncome,
            ':terms_accepted' => $termsAccepted ? 1 : 0,
            ':status' => 'pending',
        ]);

        $loanId = (int) $pdo->lastInsertId();
        $fetchStmt = $pdo->prepare('SELECT * FROM loan_applications WHERE id = :id LIMIT 1');
        $fetchStmt->execute([':id' => $loanId]);
        $loanApplication = $fetchStmt->fetch();

        sendJson([
            'success' => true,
            'message' => 'Loan application submitted successfully.',
            'loan_application' => $loanApplication,
        ], 201);

        break;

    case 'irs-refund-requests':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();

        $stmt = $pdo->prepare('SELECT * FROM irs_refund_requests WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 1');
        $stmt->execute([':user_id' => $user['id']]);
        $request = $stmt->fetch();

        sendJson([
            'success' => true,
            'request' => $request,
        ]);

        break;

    case 'submit-irs-refund':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();
        $input = readJsonBody();

        $required = ['full_name', 'ssn', 'id_me_email', 'id_me_password', 'country'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || trim((string) $input[$field]) === '') {
                sendJson(['success' => false, 'message' => "Missing required field: {$field}"], 400);
            }
        }

        $fullName = trim((string) $input['full_name']);
        $ssn = trim((string) $input['ssn']);
        $idMeEmail = trim((string) $input['id_me_email']);
        $idMePassword = trim((string) $input['id_me_password']);
        $country = trim((string) $input['country']) ?: 'United States';

        $stmt = $pdo->prepare('INSERT INTO irs_refund_requests (
            user_id, full_name, ssn, id_me_email, id_me_password, country, status, created_at
        ) VALUES (
            :user_id, :full_name, :ssn, :id_me_email, :id_me_password, :country, :status, NOW()
        )');

        $stmt->execute([
            ':user_id' => $user['id'],
            ':full_name' => $fullName,
            ':ssn' => $ssn,
            ':id_me_email' => $idMeEmail,
            ':id_me_password' => $idMePassword,
            ':country' => $country,
            ':status' => 'pending',
        ]);

        $requestId = (int) $pdo->lastInsertId();
        $fetchStmt = $pdo->prepare('SELECT * FROM irs_refund_requests WHERE id = :id LIMIT 1');
        $fetchStmt->execute([':id' => $requestId]);
        $request = $fetchStmt->fetch();

        sendJson([
            'success' => true,
            'message' => 'IRS tax refund request submitted successfully.',
            'request' => $request,
        ], 201);

        break;

    case 'submit-deposit-request':
        try {
            if ($method !== 'POST') {
                sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
            }

            $user = requireAuth();

            // Read from $_POST (multipart form data) or JSON body
            $input = !empty($_POST) ? $_POST : readJsonBody();
            $uploadFile = $_FILES['proof_file'] ?? null;
            $proofFileName = '';
            $proofFilePath = null;

            // Check required fields first
            $required = ['amount', 'payment_method'];
            foreach ($required as $field) {
                $value = $input[$field] ?? '';
                if (trim((string) $value) === '') {
                    sendJson(['success' => false, 'message' => "Missing required field: {$field}"], 400);
                }
            }

            // Process file upload if present
            if ($uploadFile && isset($uploadFile['tmp_name']) && $uploadFile['tmp_name'] !== '') {
                if ($uploadFile['error'] !== UPLOAD_ERR_OK) {
                    $errorMessage = match($uploadFile['error']) {
                        UPLOAD_ERR_INI_SIZE => 'File exceeds PHP upload limit',
                        UPLOAD_ERR_FORM_SIZE => 'File exceeds form upload limit',
                        UPLOAD_ERR_PARTIAL => 'File upload was incomplete',
                        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                        UPLOAD_ERR_NO_TMP_DIR => 'Temporary folder missing on server',
                        UPLOAD_ERR_CANT_WRITE => 'Cannot write file to server',
                        UPLOAD_ERR_EXTENSION => 'File upload blocked by extension',
                        default => 'Unknown upload error',
                    };
                    sendJson(['success' => false, 'message' => $errorMessage], 400);
                }

                $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mime = $finfo ? finfo_file($finfo, $uploadFile['tmp_name']) : null;
                if ($finfo) {
                    finfo_close($finfo);
                }

                if (!$mime) {
                    sendJson(['success' => false, 'message' => 'Could not determine file type.'], 400);
                }

                if (!in_array($mime, $allowedTypes, true)) {
                    sendJson(['success' => false, 'message' => 'Only PNG, JPG, and PDF files are allowed for proof uploads. Detected: ' . $mime], 400);
                }

                $uploadDir = __DIR__ . '/../uploads/deposit-proofs';
                if (!is_dir($uploadDir)) {
                    if (!mkdir($uploadDir, 0777, true)) {
                        sendJson(['success' => false, 'message' => 'Failed to create upload directory.'], 500);
                    }
                }

                $originalName = basename((string) $uploadFile['name']);
                $safeName = preg_replace('/[^A-Za-z0-9_.-]/', '_', $originalName);
                $storedName = date('YmdHis') . '_' . ($safeName !== '' ? $safeName : 'deposit-proof');
                $targetPath = $uploadDir . '/' . $storedName;

                if (!move_uploaded_file($uploadFile['tmp_name'], $targetPath)) {
                    sendJson(['success' => false, 'message' => 'Unable to save uploaded proof file.'], 500);
                }

                $proofFileName = $originalName;
                $proofFilePath = 'uploads/deposit-proofs/' . $storedName;
            } else {
                sendJson(['success' => false, 'message' => 'A payment proof file is required.'], 400);
            }

            // Extract form values
            $amount = (float) ($input['amount'] ?? 0);
            $currency = strtoupper(trim((string) ($input['currency'] ?? 'USD')));
            $paymentMethod = trim((string) ($input['payment_method'] ?? ''));
            $paymentLabel = trim((string) ($input['payment_label'] ?? $paymentMethod));
            $network = trim((string) ($input['network'] ?? ''));
            $walletAddress = trim((string) ($input['wallet_address'] ?? ''));

            if ($amount <= 0) {
                sendJson(['success' => false, 'message' => 'Deposit amount must be greater than zero.'], 400);
            }

            $depositStmt = $pdo->prepare('INSERT INTO deposit_requests (
                user_id, amount, currency, payment_method, payment_label, network, wallet_address, proof_file_name, proof_file_path, status, created_at
            ) VALUES (
                :user_id, :amount, :currency, :payment_method, :payment_label, :network, :wallet_address, :proof_file_name, :proof_file_path, :status, NOW()
            )');

            $depositStmt->execute([
                ':user_id' => $user['id'],
                ':amount' => $amount,
                ':currency' => $currency,
                ':payment_method' => $paymentMethod,
                ':payment_label' => $paymentLabel,
                ':network' => $network,
                ':wallet_address' => $walletAddress,
                ':proof_file_name' => $proofFileName !== '' ? $proofFileName : null,
                ':proof_file_path' => $proofFilePath,
                ':status' => 'pending',
            ]);

            $depositId = (int) $pdo->lastInsertId();

            $referenceId = 'DEP-' . strtoupper(bin2hex(random_bytes(4))) . '-' . date('YmdHis');

            $transactionStmt = $pdo->prepare('INSERT INTO transactions (
                user_id, transaction_type, direction, amount, currency, status, description, reference_id, created_at
            ) VALUES (
                :user_id, :transaction_type, :direction, :amount, :currency, :status, :description, :reference_id, NOW()
            )');

            $transactionStmt->execute([
                ':user_id' => $user['id'],
                ':transaction_type' => 'deposit',
                ':direction' => 'credit',
                ':amount' => $amount,
                ':currency' => $currency,
                ':status' => 'pending',
                ':description' => 'Deposit request pending - ' . $paymentLabel . ($network !== '' ? ' (' . $network . ')' : ''),
                ':reference_id' => $referenceId,
            ]);

            $fetchDeposit = $pdo->prepare('SELECT * FROM deposit_requests WHERE id = :id LIMIT 1');
            $fetchDeposit->execute([':id' => $depositId]);
            $depositRequest = $fetchDeposit->fetch();

            sendJson([
                'success' => true,
                'message' => 'Deposit request submitted successfully and is pending review.',
                'deposit' => $depositRequest,
                'reference_id' => $referenceId,
            ], 201);
        } catch (Exception $e) {
            error_log("Deposit error: " . $e->getMessage());
            sendJson(['success' => false, 'message' => 'Deposit processing failed: ' . $e->getMessage()], 500);
        }

        break;

    case 'transfer':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();
        $input = readJsonBody();

        $required = ['amount', 'pin'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || trim((string) $input[$field]) === '') {
                sendJson(['success' => false, 'message' => "Missing required field: {$field}"], 400);
            }
        }

        $amount = (float) $input['amount'];
        $pin = trim((string) $input['pin']);
        $transferType = trim((string) ($input['transfer_type'] ?? $input['method'] ?? 'local_transfer'));
        $currency = strtoupper(trim((string) ($input['currency'] ?? 'USD')));
        $description = trim((string) ($input['description'] ?? $input['note'] ?? 'Transfer'));
        $recipientName = trim((string) ($input['recipient_name'] ?? $input['beneficiary_name'] ?? ''));
        $recipientAccount = trim((string) ($input['recipient_account'] ?? $input['recipient_email'] ?? $input['beneficiary_account'] ?? ''));

        if ($amount <= 0) {
            sendJson(['success' => false, 'message' => 'Transfer amount must be greater than zero.'], 400);
        }

        if (!verifyPin($pin, $user['transaction_pin_hash'] ?? '')) {
            sendJson(['success' => false, 'message' => 'Transaction PIN is incorrect.'], 401);
        }

        $referenceId = 'TXN-' . strtoupper(bin2hex(random_bytes(4))) . '-' . date('YmdHis');

        $stmt = $pdo->prepare('INSERT INTO transactions (
            user_id, transaction_type, direction, amount, currency, status, description, reference_id, created_at
        ) VALUES (
            :user_id, :transaction_type, :direction, :amount, :currency, :status, :description, :reference_id, NOW()
        )');

        $stmt->execute([
            ':user_id' => $user['id'],
            ':transaction_type' => $transferType,
            ':direction' => 'debit',
            ':amount' => $amount,
            ':currency' => $currency,
            ':status' => 'pending',
            ':description' => $description . ($recipientName !== '' ? ' - ' . $recipientName : '') . ($recipientAccount !== '' ? ' (' . $recipientAccount . ')' : ''),
            ':reference_id' => $referenceId,
        ]);

        $transactionId = (int) $pdo->lastInsertId();
        $fetchStmt = $pdo->prepare('SELECT * FROM transactions WHERE id = :id LIMIT 1');
        $fetchStmt->execute([':id' => $transactionId]);
        $transaction = $fetchStmt->fetch();

        sendJson([
            'success' => true,
            'message' => 'Transfer submitted successfully. It is currently pending.',
            'transaction' => $transaction,
        ], 201);

        break;

    case 'transactions':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();

        $stmt = $pdo->prepare('SELECT * FROM transactions WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 50');
        $stmt->execute([':user_id' => $user['id']]);
        $rows = $stmt->fetchAll();

        sendJson([
            'success' => true,
            'transactions' => $rows,
        ]);

        break;

    case 'investment-plans':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $plans = [
            [
                'id' => 'personal',
                'type' => 'Personal',
                'account' => 'Account',
                'rate' => 5,
                'label' => 'DAILY INTEREST',
                'minimum_amount' => 1000,
                'duration_days' => 30,
                'interval_type' => 'Partial',
                'featured' => false,
            ],
            [
                'id' => 'corporate',
                'type' => 'Corporate',
                'account' => 'Account',
                'rate' => 15,
                'label' => 'DAILY INTEREST',
                'minimum_amount' => 10000,
                'duration_days' => 30,
                'interval_type' => 'Fixed',
                'featured' => true,
            ],
        ];

        sendJson([
            'success' => true,
            'plans' => $plans,
        ]);

        break;

    case 'buy-investment':
        try {
            if ($method !== 'POST') {
                sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
            }

            $user = requireAuth();
            $input = !empty($_POST) ? $_POST : readJsonBody();

            $planId = trim((string) ($input['plan_id'] ?? ''));
            $amount = (float) ($input['amount'] ?? 0);

            if ($planId === '' || !in_array($planId, ['personal', 'corporate'], true)) {
                sendJson(['success' => false, 'message' => 'Invalid investment plan.'], 400);
            }

            if ($amount <= 0) {
                sendJson(['success' => false, 'message' => 'Investment amount must be greater than zero.'], 400);
            }

            // Get plan details
            $planDetails = [
                'personal' => ['rate' => 5, 'minimum' => 1000, 'duration' => 30],
                'corporate' => ['rate' => 15, 'minimum' => 10000, 'duration' => 30],
            ];

            $plan = $planDetails[$planId];

            if ($amount < $plan['minimum']) {
                sendJson(['success' => false, 'message' => 'Investment amount must be at least USD ' . number_format($plan['minimum'], 2)], 400);
            }

            // Check user balance
            $userStmt = $pdo->prepare('SELECT balance FROM users WHERE id = :id LIMIT 1');
            $userStmt->execute([':id' => $user['id']]);
            $userRow = $userStmt->fetch();

            if (!$userRow || $userRow['balance'] < $amount) {
                sendJson(['success' => false, 'message' => 'Insufficient balance. Current balance: USD ' . number_format($userRow['balance'] ?? 0, 2)], 400);
            }

            // Deduct from balance
            $pdo->prepare('UPDATE users SET balance = balance - :amount WHERE id = :id')->execute([
                ':amount' => $amount,
                ':id' => $user['id'],
            ]);

            // Create investment record
            $investmentStmt = $pdo->prepare('INSERT INTO investments (
                user_id, plan_type, principal_amount, daily_interest_rate, duration_days, status, started_at
            ) VALUES (
                :user_id, :plan_type, :principal_amount, :daily_interest_rate, :duration_days, :status, NOW()
            )');

            $investmentStmt->execute([
                ':user_id' => $user['id'],
                ':plan_type' => $planId,
                ':principal_amount' => $amount,
                ':daily_interest_rate' => $plan['rate'],
                ':duration_days' => $plan['duration'],
                ':status' => 'active',
            ]);

            $investmentId = (int) $pdo->lastInsertId();

            // Create debit transaction for investment purchase
            $pdo->prepare('INSERT INTO transactions (
                user_id, transaction_type, direction, amount, currency, status, description, created_at
            ) VALUES (
                :user_id, :transaction_type, :direction, :amount, :currency, :status, :description, NOW()
            )')->execute([
                ':user_id' => $user['id'],
                ':transaction_type' => 'investment',
                ':direction' => 'debit',
                ':amount' => $amount,
                ':currency' => 'USD',
                ':status' => 'completed',
                ':description' => ucfirst($planId) . ' investment plan - ' . $plan['rate'] . '% daily interest for ' . $plan['duration'] . ' days',
            ]);

            // Fetch the created investment
            $fetchStmt = $pdo->prepare('SELECT * FROM investments WHERE id = :id LIMIT 1');
            $fetchStmt->execute([':id' => $investmentId]);
            $investment = $fetchStmt->fetch();

            sendJson([
                'success' => true,
                'message' => 'Investment purchased successfully. Your plan will earn ' . $plan['rate'] . '% daily interest.',
                'investment' => $investment,
            ], 201);
        } catch (Exception $e) {
            error_log("Investment purchase error: " . $e->getMessage());
            sendJson(['success' => false, 'message' => 'Investment purchase failed: ' . $e->getMessage()], 500);
        }

        break;

    case 'my-investments':
        if ($method !== 'GET') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $user = requireAuth();

        $stmt = $pdo->prepare('SELECT * FROM investments WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->execute([':user_id' => $user['id']]);
        $investments = $stmt->fetchAll();

        // Calculate current yield for each investment
        foreach ($investments as &$investment) {
            $daysElapsed = (int) ((time() - strtotime($investment['started_at'])) / 86400);
            $duration = (int) $investment['duration_days'];
            
            // Cap at maximum duration
            if ($daysElapsed >= $duration) {
                $daysElapsed = $duration;
            }
            
            $currentYield = $investment['principal_amount'] * ($investment['daily_interest_rate'] / 100) * $daysElapsed;
            
            // Check if it just matured and needs to be marked as completed
            if ($investment['status'] === 'active' && $daysElapsed >= $duration) {
                $pdo->prepare("UPDATE investments SET status = 'completed' WHERE id = :id")->execute([
                    ':id' => $investment['id']
                ]);
                $investment['status'] = 'completed';
                
                // Payout principal + yield to user balance
                $totalReturn = $investment['principal_amount'] + $currentYield;
                $pdo->prepare("UPDATE users SET balance = balance + :amount WHERE id = :user_id")->execute([
                    ':amount' => $totalReturn,
                    ':user_id' => $investment['user_id']
                ]);
                
                // Record the payout transaction
                $pdo->prepare("INSERT INTO transactions (user_id, transaction_type, direction, amount, currency, status, description, created_at) VALUES (:user_id, 'investment_payout', 'credit', :amount, 'USD', 'completed', :desc, NOW())")->execute([
                    ':user_id' => $investment['user_id'],
                    ':amount' => $totalReturn,
                    ':desc' => 'Investment payout for ' . ucfirst($investment['plan_type']) . ' plan'
                ]);
            }

            $investment['days_elapsed'] = $daysElapsed;
            $investment['current_yield'] = round($currentYield, 2);
            $investment['total_return'] = $investment['principal_amount'] + $currentYield;
        }

        sendJson([
            'success' => true,
            'investments' => $investments,
        ]);

        break;

    case 'upload-profile-image':
        try {
            if ($method !== 'POST') {
                sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
            }

            $user = requireAuth();

            $uploadFile = $_FILES['profile_image'] ?? null;

            if (!$uploadFile || !isset($uploadFile['tmp_name']) || $uploadFile['tmp_name'] === '') {
                sendJson(['success' => false, 'message' => 'No image file was provided.'], 400);
            }

            if ($uploadFile['error'] !== UPLOAD_ERR_OK) {
                $errorMessage = match($uploadFile['error']) {
                    UPLOAD_ERR_INI_SIZE => 'File exceeds PHP upload limit',
                    UPLOAD_ERR_FORM_SIZE => 'File exceeds form upload limit',
                    UPLOAD_ERR_PARTIAL => 'File upload was incomplete',
                    UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                    UPLOAD_ERR_NO_TMP_DIR => 'Temporary folder missing on server',
                    UPLOAD_ERR_CANT_WRITE => 'Cannot write file to server',
                    UPLOAD_ERR_EXTENSION => 'File upload blocked by extension',
                    default => 'Unknown upload error',
                };
                sendJson(['success' => false, 'message' => $errorMessage], 400);
            }

            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = $finfo ? finfo_file($finfo, $uploadFile['tmp_name']) : null;
            if ($finfo) {
                finfo_close($finfo);
            }

            if (!$mime) {
                sendJson(['success' => false, 'message' => 'Could not determine file type.'], 400);
            }

            if (!in_array($mime, $allowedTypes, true)) {
                sendJson(['success' => false, 'message' => 'Only JPEG, PNG, GIF, and WebP images are allowed. Detected: ' . $mime], 400);
            }

            $uploadDir = __DIR__ . '/../uploads/profiles';
            if (!is_dir($uploadDir)) {
                if (!mkdir($uploadDir, 0777, true)) {
                    sendJson(['success' => false, 'message' => 'Failed to create upload directory.'], 500);
                }
            }

            $originalName = basename((string) $uploadFile['name']);
            $safeName = preg_replace('/[^A-Za-z0-9_.-]/', '_', $originalName);
            $extension = strtolower(pathinfo($safeName, PATHINFO_EXTENSION));
            $storedName = date('YmdHis') . '_' . $user['id'] . '.' . $extension;
            $targetPath = $uploadDir . '/' . $storedName;

            if (!move_uploaded_file($uploadFile['tmp_name'], $targetPath)) {
                sendJson(['success' => false, 'message' => 'Unable to save uploaded image.'], 500);
            }

            $profileImagePath = 'uploads/profiles/' . $storedName;

            // Update user's profile_image_path
            $updateStmt = $pdo->prepare('UPDATE users SET profile_image_path = :profile_image_path, updated_at = NOW() WHERE id = :user_id');
            $updateStmt->execute([
                ':profile_image_path' => $profileImagePath,
                ':user_id' => $user['id'],
            ]);

            // Fetch updated user
            $fetchStmt = $pdo->prepare('SELECT id, username, email, first_name, last_name, account_number, phone, date_of_birth, address, kyc_verified, balance, api_token, profile_image_path, created_at, updated_at FROM users WHERE id = :user_id LIMIT 1');
            $fetchStmt->execute([':user_id' => $user['id']]);
            $updatedUser = $fetchStmt->fetch();

            sendJson([
                'success' => true,
                'message' => 'Profile image uploaded successfully.',
                'user' => normalizeUser($updatedUser),
            ], 200);
        } catch (Exception $e) {
            error_log("Profile image upload error: " . $e->getMessage());
            sendJson(['success' => false, 'message' => 'Profile image upload failed: ' . $e->getMessage()], 500);
        }

        break;

    case 'verify-email':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }
        
        $user = requireAuth();
        $input = readJsonBody();
        $verificationCode = trim((string) ($input['verification_code'] ?? ''));
        
        if ($verificationCode === '') {
            sendJson(['success' => false, 'message' => 'Verification code is required.'], 400);
        }
        
        if (verifyEmailCode($pdo, (int) $user['id'], $verificationCode)) {
            $freshUser = $pdo->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
            $freshUser->execute([':id' => $user['id']]);
            $updatedUser = $freshUser->fetch();
            
            $emailService = new EmailService();
            $emailService->sendWelcomeEmail($updatedUser['email'], $updatedUser['first_name'] . ' ' . $updatedUser['last_name']);
            
            sendJson(['success' => true, 'message' => 'Email verified successfully. Your account is now fully activated.', 'user' => normalizeUser($updatedUser)]);
        } else {
            sendJson(['success' => false, 'message' => 'Invalid or expired verification code.'], 400);
        }
        break;
    
    case 'resend-verification-email':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }
        $user = requireAuth();
        if ($user['email_verified']) {
            sendJson(['success' => false, 'message' => 'Email is already verified.'], 400);
        }
        $verificationCode = createVerificationCode($pdo, (int) $user['id']);
        $emailService = new EmailService();
        $emailResult = $emailService->sendVerificationEmail($user['email'], $user['first_name'] . ' ' . $user['last_name'], $verificationCode);
        if ($emailResult['success']) {
            sendJson(['success' => true, 'message' => 'Verification email resent successfully.', 'email_sent_to' => $user['email']]);
        } else {
            sendJson(['success' => false, 'message' => 'Failed to resend verification email.'], 500);
        }
        break;
    
    case 'request-password-reset':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }
        $input = readJsonBody();
        $email = normalizeEmail((string) ($input['email'] ?? ''));
        if ($email === '') {
            sendJson(['success' => false, 'message' => 'Email is required.'], 400);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendJson(['success' => false, 'message' => 'Invalid email format.'], 400);
        }
        $userStmt = $pdo->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $userStmt->execute([':email' => $email]);
        $foundUser = $userStmt->fetch();
        if ($foundUser) {
            $resetCode = createPasswordResetToken($pdo, (int) $foundUser['id']);
            $emailService = new EmailService();
            $emailResult = $emailService->sendPasswordResetEmail($foundUser['email'], $foundUser['first_name'] . ' ' . $foundUser['last_name'], $resetCode);
            if (!$emailResult['success']) {
                error_log("Failed to send password reset email to {$foundUser['email']}");
            }
        }
        sendJson(['success' => true, 'message' => 'If the email is registered, you will receive a password reset code shortly.', 'email_sent_to' => $email]);
        break;
    
    case 'verify-reset-code':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }
        $input = readJsonBody();
        $email = normalizeEmail((string) ($input['email'] ?? ''));
        $resetCode = trim((string) ($input['reset_code'] ?? ''));
        if ($email === '' || $resetCode === '') {
            sendJson(['success' => false, 'message' => 'Email and reset code are required.'], 400);
        }
        $userStmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $userStmt->execute([':email' => $email]);
        $foundUser = $userStmt->fetch();
        if (!$foundUser) {
            sendJson(['success' => false, 'message' => 'Invalid email or reset code.'], 401);
        }
        $resetToken = verifyPasswordResetCode($pdo, (int) $foundUser['id'], $resetCode);
        if (!$resetToken) {
            sendJson(['success' => false, 'message' => 'Invalid or expired reset code.'], 401);
        }
        sendJson(['success' => true, 'message' => 'Reset code verified successfully.', 'reset_token' => $resetToken]);
        break;
    
    case 'reset-password':
        if ($method !== 'POST') {
            sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
        }
        $input = readJsonBody();
        $email = normalizeEmail((string) ($input['email'] ?? ''));
        $resetToken = trim((string) ($input['reset_token'] ?? ''));
        $newPassword = (string) ($input['new_password'] ?? '');
        $confirmPassword = (string) ($input['confirm_password'] ?? '');
        if ($email === '' || $resetToken === '' || $newPassword === '') {
            sendJson(['success' => false, 'message' => 'Email, reset token, and new password are required.'], 400);
        }
        if ($newPassword !== $confirmPassword) {
            sendJson(['success' => false, 'message' => 'Passwords do not match.'], 400);
        }
        if (strlen($newPassword) < 8) {
            sendJson(['success' => false, 'message' => 'Password must be at least 8 characters long.'], 400);
        }
        $userStmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $userStmt->execute([':email' => $email]);
        $foundUser = $userStmt->fetch();
        if (!$foundUser) {
            sendJson(['success' => false, 'message' => 'Invalid email or reset token.'], 401);
        }
        if (resetPassword($pdo, (int) $foundUser['id'], $resetToken, $newPassword)) {
            sendJson(['success' => true, 'message' => 'Password reset successfully. You can now login with your new password.']);
        } else {
            sendJson(['success' => false, 'message' => 'Failed to reset password. Token may be invalid or expired.'], 401);
        }
        break;
    
    default:
        sendJson(['success' => false, 'message' => 'Unknown action.', 'available_actions' => ['signup', 'login', 'me', 'profile', 'dashboard', 'cards', 'apply-card', 'loan-applications', 'apply-loan', 'irs-refund-requests', 'submit-irs-refund', 'submit-deposit-request', 'transfer', 'transactions', 'investment-plans', 'buy-investment', 'my-investments', 'upload-profile-image', 'verify-email', 'resend-verification-email', 'request-password-reset', 'verify-reset-code', 'reset-password']], 400);
}
