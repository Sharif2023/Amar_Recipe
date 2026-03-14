<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define('SMTP_DEBUG', true);
require_once __DIR__ . '/mail_util.php';

$testEmail = 'sharifislam0505@gmail.com'; // Send to self for testing
$subject = "Amar Recipe SMTP Test";
$body = "<h1>SMTP Test Success</h1><p>This is a test email to verify PHPMailer configuration.</p>";

echo "Attempting to send test email to $testEmail...<br>";

if (sendEmail($testEmail, $subject, $body)) {
    echo "<b>Success!</b> Email sent successfully.";
} else {
    echo "<b>Failed!</b> Email sending failed. Check error logs.";
}
