# Email Verification & Password Reset Implementation Guide

## Overview
This document covers the email verification system and password reset functionality implemented in Finora, including database schema, API endpoints, and frontend integration steps.

## Database Changes

### New Tables Created
1. **email_verification_codes** - Stores temporary verification codes for email confirmation
   - `id` - Primary key
   - `user_id` - References users table
   - `verification_code` - 6-digit code (expires in 24 hours)
   - `created_at` - Timestamp
   - `expires_at` - Code expiration time
   - `verified_at` - When code was verified

2. **password_reset_tokens** - Stores password reset tokens
   - `id` - Primary key
   - `user_id` - References users table  
   - `reset_code` - 6-digit code
   - `reset_token` - Unique token (expires in 1 hour)
   - `created_at` - Timestamp
   - `expires_at` - Token expiration time
   - `used_at` - When token was used

### Modified Tables
- **users** table - Added `email_verified` column (TINYINT, default 0)

### Migration
Run `php/migrate-email.php` to set up these tables:
```bash
php php/migrate-email.php
```

## Configuration

### Email Service Setup (php/email-service.php)
The application uses the Connecta email API at:
```text
https://connecta.uk/send_email2.php
```

The service sends a form POST containing these required fields:
```text
email   Recipient email address
subject Email subject
message HTML email body
```

No SendGrid API key or frontend email credential is required. The endpoint must be reachable from the PHP backend, and PHP cURL must be enabled.

## Backend API Endpoints

### 1. Signup (Modified)
**POST** `/php/api.php?action=signup`

**Response:**
```json
{
    "success": true,
    "message": "User created successfully. Please check your email to verify your account.",
    "token": "...",
    "user": {...},
    "email_verification_required": true,
    "email_sent_to": "user@example.com"
}
```

**Changes:**
- Now sends verification email automatically
- User can login but has limited functionality until email is verified
- Returns `email_verification_required: true` flag

---

### 2. Verify Email
**POST** `/php/api.php?action=verify-email`
**Requires:** Authentication token

**Request Body:**
```json
{
    "verification_code": "123456"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Email verified successfully. Your account is now fully activated.",
    "user": {...}
}
```

**Process:**
1. User receives 6-digit code via email
2. User enters code within 24-hour window
3. Code is validated and marked as verified
4. Welcome email is sent
5. User account is fully activated

---

### 3. Resend Verification Email
**POST** `/php/api.php?action=resend-verification-email`
**Requires:** Authentication token

**Response:**
```json
{
    "success": true,
    "message": "Verification email resent successfully.",
    "email_sent_to": "user@example.com"
}
```

**Rules:**
- Only works for unverified emails
- Generates new code each time
- Previous codes are invalidated

---

### 4. Request Password Reset
**POST** `/php/api.php?action=request-password-reset`
**Authentication:** Not required

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

**Response:**
```json
{
    "success": true,
    "message": "If the email is registered, you will receive a password reset code shortly.",
    "email_sent_to": "user@example.com"
}
```

**Security:**
- Always returns success (doesn't reveal if email exists)
- Generates 6-digit code + unique token
- Code expires in 1 hour
- Only one active reset token per user

---

### 5. Verify Reset Code
**POST** `/php/api.php?action=verify-reset-code`
**Authentication:** Not required

**Request Body:**
```json
{
    "email": "user@example.com",
    "reset_code": "123456"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Reset code verified successfully.",
    "reset_token": "..."
}
```

**Process:**
1. User submits email and code received
2. Code is validated against database
3. Unique reset_token is returned
4. Token must be used within reset flow

---

### 6. Reset Password
**POST** `/php/api.php?action=reset-password`
**Authentication:** Not required

**Request Body:**
```json
{
    "email": "user@example.com",
    "reset_token": "...",
    "new_password": "NewPassword123!",
    "confirm_password": "NewPassword123!"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Password reset successfully. You can now login with your new password."
}
```

**Requirements:**
- Password minimum 8 characters
- Passwords must match
- Token must not be expired (1 hour)
- Token can only be used once

---

## Helper Functions (php/auth.php)

```php
// Generate 6-digit verification code
generateVerificationCode(): string

// Create verification code for user
createVerificationCode(PDO $pdo, int $userId): string

// Verify email code and activate email
verifyEmailCode(PDO $pdo, int $userId, string $code): bool

// Create password reset token
createPasswordResetToken(PDO $pdo, int $userId): string

// Verify reset code is valid
verifyPasswordResetCode(PDO $pdo, int $userId, string $code): ?string

// Reset password with token
resetPassword(PDO $pdo, int $userId, string $token, string $newPassword): bool
```

---

## Frontend Integration

### Frontend Components Needed

#### 1. EmailVerificationModal.jsx
Show after signup until email is verified
```jsx
function EmailVerificationModal({ email, onVerified }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    
    const handleVerify = async () => {
        const response = await apiRequest('verify-email', {
            verification_code: code
        });
        
        if (response.success) {
            onVerified(response.user);
        } else {
            setError(response.message);
        }
    };
    
    const handleResend = async () => {
        await apiRequest('resend-verification-email', {});
    };
    
    return (
        <Modal>
            <h2>Verify Your Email</h2>
            <p>Code sent to {email}</p>
            <input 
                value={code} 
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength="6"
            />
            <button onClick={handleVerify}>Verify</button>
            <button onClick={handleResend} variant="secondary">Resend Code</button>
            {error && <Error>{error}</Error>}
        </Modal>
    );
}
```

#### 2. ForgotPasswordPage.jsx
Three-step password reset flow
```jsx
function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    // Step 1: Request reset
    const handleRequestReset = async () => {
        const response = await apiRequest('request-password-reset', { email });
        if (response.success) setStep(2);
    };
    
    // Step 2: Verify code
    const handleVerifyCode = async () => {
        const response = await apiRequest('verify-reset-code', { email, reset_code: code });
        if (response.success) {
            setResetToken(response.reset_token);
            setStep(3);
        }
    };
    
    // Step 3: Set new password
    const handleResetPassword = async () => {
        const response = await apiRequest('reset-password', {
            email,
            reset_token: resetToken,
            new_password: newPassword,
            confirm_password: newPassword
        });
        if (response.success) {
            navigate('/signin');
        }
    };
    
    return (
        <div>
            {step === 1 && <StepEmail onNext={handleRequestReset} />}
            {step === 2 && <StepCode onNext={handleVerifyCode} />}
            {step === 3 && <StepPassword onNext={handleResetPassword} />}
        </div>
    );
}
```

### Login Page Update
Add "Forgot Password?" link:
```jsx
<Link to="/forgot-password">Forgot Password?</Link>
```

### Update SignUpPage.jsx
Show verification modal after signup:
```jsx
const [user, setUser] = useState(null);

if (user && !user.email_verified) {
    return (
        <EmailVerificationModal 
            email={user.email}
            onVerified={(verifiedUser) => {
                setUser(verifiedUser);
                navigate('/dashboard');
            }}
        />
    );
}
```

---

## Email Templates

Three professional HTML email templates are generated by `EmailService`:

### 1. Verification Email
- Displays 6-digit code prominently
- 24-hour expiration warning
- Professional branding
- Security notice

### 2. Password Reset Email
- Displays 6-digit reset code
- 1-hour expiration warning
- Red security theme
- Security notice about unauthorized requests

### 3. Welcome Email
- Sent after email verification
- Account activation confirmation
- Feature highlights
- Support contact information

---

## Security Considerations

### Code Expiration
- Verification codes: **24 hours**
- Reset codes: **1 hour** 
- Codes are single-use only
- Previous codes automatically deleted

### Password Requirements
- Minimum **8 characters**
- Must match confirmation
- Uses bcrypt hashing
- Old passwords stored securely

### Email Verification Flow
1. Account created with `email_verified = 0`
2. Code sent to email immediately
3. User cannot perform certain actions until verified
4. Can resend code anytime
5. Code valid for 24 hours

### Password Reset Security
1. Always return success (don't reveal email existence)
2. Code + token based (two-step verification)
3. Reset email only shows code, not link
4. Token unique per reset request
5. Token one-time use only
6. Time-limited (1 hour)

---

## Testing the Implementation

### 1. Test Signup with Email
```bash
curl -X POST http://localhost/finora/php/api.php?action=signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123",
    "first_name": "Test",
    "last_name": "User",
    "transaction_pin": "1234"
  }'
```

### 2. Verify Email Code
```bash
curl -X POST http://localhost/finora/php/api.php?action=verify-email \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"verification_code": "123456"}'
```

### 3. Test Password Reset
```bash
# Step 1: Request reset
curl -X POST http://localhost/finora/php/api.php?action=request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Step 2: Verify code
curl -X POST http://localhost/finora/php/api.php?action=verify-reset-code \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "reset_code": "123456"}'

# Step 3: Reset password
curl -X POST http://localhost/finora/php/api.php?action=reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "reset_token": "...",
    "new_password": "NewPassword123",
    "confirm_password": "NewPassword123"
  }'
```

---

## Troubleshooting

### Emails Not Sending
1. Confirm `https://connecta.uk/send_email2.php` is reachable from the backend
2. Check PHP error logs for the Connecta response
3. Ensure cURL is enabled

### Verification Code Issues
1. Codes expire after 24 hours
2. Only one active code per user
3. Check database: `email_verification_codes` table
4. Codes are 6 digits (zero-padded)

### Reset Token Issues  
1. Tokens expire after 1 hour
2. Tokens are single-use
3. Token must match the one returned from `verify-reset-code`
4. Check `password_reset_tokens` table

### Common Errors
- **"Invalid or expired verification code"** - Code doesn't exist or expired
- **"Email is already verified"** - Already verified, can't resend
- **"Invalid email or reset code"** - Wrong combination
- **"Passwords do not match"** - confirm_password differs from new_password

---

## Files Modified/Created

### New Files
- `php/email-service.php` - Email API wrapper class
- `php/email-endpoints.php` - Reference implementation
- `php/migrate-email.php` - Database migration script

### Modified Files
- `php/api.php` - Added email endpoints and signup modification
- `php/auth.php` - Added email helper functions
- `.env` - Already configured with API URL

### Frontend Files
- `src/components/EmailVerification.jsx` - Verification code screen shown after registration
- `src/pages/ForgotPasswordPage.jsx` - Three-step password reset flow
- `src/pages/SignUpPage.jsx` - Displays verification before dashboard navigation
- `src/pages/SignInPage.jsx` - Links to password recovery

---

## Production Deployment

### Environment Variables
Create `.env.production`:
```env
VITE_API_URL=https://your-backend-domain.com/php/api.php
```

### Connecta Setup
1. Confirm the backend server can reach `https://connecta.uk/send_email2.php`
2. Confirm PHP cURL is enabled
3. Test the endpoint with a valid recipient, subject, and message

### Server Configuration
1. HTTPS required for production
2. PHP 7.4+ with cURL extension
3. MySQL 5.7+ or MariaDB
4. Secure storage of API keys
5. Email rate limiting if needed

---

## API Endpoint Summary

| Action | Method | Auth | Purpose |
|--------|--------|------|---------|
| `signup` | POST | No | Create account (modified) |
| `verify-email` | POST | Yes | Confirm email address |
| `resend-verification-email` | POST | Yes | Send new verification code |
| `request-password-reset` | POST | No | Request password reset |
| `verify-reset-code` | POST | No | Validate reset code |
| `reset-password` | POST | No | Update password |

---

## Next Steps

1. ✅ Backend implementation complete
2. ✅ Frontend verification and password reset flows integrated
3. ✅ Frontend production build passes
4. ⏭️ Verify Connecta API delivery with a real test account
5. ⏭️ Deploy to production
