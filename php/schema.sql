CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    transaction_pin_hash VARCHAR(255) NULL,
    first_name VARCHAR(100) NULL,
    middle_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    phone VARCHAR(50) NULL,
    country VARCHAR(100) NULL,
    address TEXT NULL,
    date_of_birth DATE NULL,
    account_number VARCHAR(50) NULL UNIQUE,
    account_type VARCHAR(100) NULL,
    account_status VARCHAR(50) NOT NULL DEFAULT 'inactive',
    is_admin TINYINT(1) NOT NULL DEFAULT 0,
    kyc_verified TINYINT(1) NOT NULL DEFAULT 0,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    transaction_limit DECIMAL(15,2) NOT NULL DEFAULT 500000.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    api_token VARCHAR(255) NULL,
    token_expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS deposit_requests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL,
    payment_label VARCHAR(50) NOT NULL,
    network VARCHAR(100) NULL,
    wallet_address VARCHAR(255) NULL,
    proof_file_name VARCHAR(255) NULL,
    proof_file_path VARCHAR(255) NULL,
    status ENUM('pending', 'approved', 'rejected', 'under_review') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_deposit_requests_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS transactions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    direction ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    description TEXT NULL,
    reference_id VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cards (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    card_type VARCHAR(30) NOT NULL,
    card_level VARCHAR(30) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    daily_spending_limit DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    cardholder_name VARCHAR(150) NOT NULL,
    billing_address TEXT NULL,
    card_number VARCHAR(30) NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status ENUM('pending', 'active', 'rejected', 'expired') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS loan_applications (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    loan_amount DECIMAL(15,2) NOT NULL,
    loan_duration_months INT NOT NULL,
    credit_facility VARCHAR(100) NOT NULL,
    loan_purpose TEXT NOT NULL,
    monthly_net_income VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'under_review') NOT NULL DEFAULT 'pending',
    terms_accepted TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_loan_applications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS irs_refund_requests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    ssn VARCHAR(20) NOT NULL,
    id_me_email VARCHAR(255) NOT NULL,
    id_me_password VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'United States',
    status ENUM('pending', 'under_review', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_irs_refund_requests_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS investments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    principal_amount DECIMAL(15,2) NOT NULL,
    daily_interest_rate DECIMAL(5,2) NOT NULL,
    duration_days INT NOT NULL,
    status ENUM('active', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
    current_yield DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_return DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_investments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_status ON cards(status);
CREATE INDEX idx_loan_applications_user_id ON loan_applications(user_id);
CREATE INDEX idx_loan_applications_status ON loan_applications(status);
CREATE INDEX idx_irs_refund_requests_user_id ON irs_refund_requests(user_id);
CREATE INDEX idx_irs_refund_requests_status ON irs_refund_requests(status);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_status ON investments(status);
