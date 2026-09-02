<?php

// Load PHPMailer via the local send_email helper
require_once __DIR__ . '/send_email.php';

class EmailService {

    public function sendVerificationEmail($toEmail, $toName, $verificationCode) {
        $subject     = 'Verify Your Finora Account';
        $htmlContent = $this->getVerificationEmailTemplate($toName, $verificationCode);
        return $this->send($toEmail, $toName, $subject, $htmlContent);
    }

    public function sendPasswordResetEmail($toEmail, $toName, $resetCode) {
        $subject     = 'Reset Your Finora Password';
        $htmlContent = $this->getPasswordResetEmailTemplate($toName, $resetCode);
        return $this->send($toEmail, $toName, $subject, $htmlContent);
    }

    public function sendWelcomeEmail($toEmail, $toName) {
        $subject     = 'Welcome to Finora';
        $htmlContent = $this->getWelcomeEmailTemplate($toName);
        return $this->send($toEmail, $toName, $subject, $htmlContent);
    }

    private function send($toEmail, $toName, $subject, $htmlContent) {
        if (!filter_var($toEmail, FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => false,
                'message' => 'Invalid email address',
            ];
        }

        $result = sendEmail($toName, $toEmail, $htmlContent, $subject);

        if ($result) {
            return [
                'success' => true,
                'message' => 'Email sent successfully',
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to send email',
        ];
    }

    private function getVerificationEmailTemplate($name, $code) {
        return <<<HTML
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #023888 0%, #1a56db 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .code-box { background: white; border: 2px solid #023888; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                .code { font-size: 32px; font-weight: bold; color: #023888; letter-spacing: 8px; font-family: monospace; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                .button { display: inline-block; background: #023888; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Verify Your Email</h1>
                </div>
                <div class="content">
                    <p>Hi $name,</p>
                    <p>Thank you for signing up with Finora! To complete your registration, please verify your email address using the code below:</p>
                    <div class="code-box">
                        <div class="code">$code</div>
                    </div>
                    <p>This verification code will expire in 24 hours.</p>
                    <p>If you didn't create this account, you can safely ignore this email.</p>
                    <p>Best regards,<br>The Finora Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Finora. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        HTML;
    }

    private function getPasswordResetEmailTemplate($name, $code) {
        return <<<HTML
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #023888 0%, #1a56db 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .code-box { background: white; border: 2px solid #023888; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                .code { font-size: 32px; font-weight: bold; color: #023888; letter-spacing: 8px; font-family: monospace; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Reset Your Password</h1>
                </div>
                <div class="content">
                    <p>Hi $name,</p>
                    <p>We received a request to reset your password. Use the code below to reset your account:</p>
                    <div class="code-box">
                        <div class="code">$code</div>
                    </div>
                    <p>This reset code will expire in 1 hour.</p>
                    <div class="warning">
                        <strong>Security Notice:</strong> If you did not request this, please ignore this email. Your account will remain secure.
                    </div>
                    <p>Best regards,<br>The Finora Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Finora. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        HTML;
    }

    private function getWelcomeEmailTemplate($name) {
        return <<<HTML
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #023888 0%, #1a56db 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .feature { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #023888; border-radius: 4px; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Finora!</h1>
                </div>
                <div class="content">
                    <p>Hi $name,</p>
                    <p>Your account has been verified and is now fully active! Welcome to Finora, your trusted financial partner.</p>
                    <p><strong>You can now:</strong></p>
                    <div class="feature">✓ Make deposits and transfers</div>
                    <div class="feature">✓ Apply for loans and credit</div>
                    <div class="feature">✓ Invest in our plans</div>
                    <div class="feature">✓ Track your transactions</div>
                    <p>Need help? Visit our <a href="https://finora.com/support">support center</a> or reply to this email.</p>
                    <p>Best regards,<br>The Finora Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Finora. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        HTML;
    }
}
