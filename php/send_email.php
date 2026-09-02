<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer (adjust path if needed)
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

function sendEmail($fullName, $email, $message, $subject)
{
    // Check if the email is provided
    if (empty($email)) {
        error_log('Email address is empty');
        return false;
    }

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info@crystalsbusinesssolution.com'; // Replace with your Hostinger email
        $mail->Password = 'TwM4?5@tS';        // Replace with your Hostinger email password
        $mail->SMTPSecure = 'tls';                 // Use 'ssl' if you want port 465
        $mail->Port = 587;                   // Use 465 for SSL

        // Recipients
        $mail->setFrom('info@crystalsbusinesssolution.com', 'Finora');
        $mail->addAddress($email, $fullName);

        // Content
        $mail->isHTML(true); // HTML templates used by EmailService
        $mail->Subject = $subject;
        $mail->Body = $message;
        $mail->AltBody = strip_tags($message); // Plain-text fallback

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log('Email sending failed: ' . $mail->ErrorInfo);
        return false;
    }
}
?>