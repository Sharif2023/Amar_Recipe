<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/mail_util.php';

echo "<h1>Diagnostic Report</h1>";

// 1. Database Connection
echo "<h2>1. Database Connection</h2>";
try {
    $conn = getDbConnection();
    echo "<p style='color:green;'>SUCCESS: Connected to " . DB_TYPE . " database.</p>";
} catch (Exception $e) {
    echo "<p style='color:red;'>FAILED: " . $e->getMessage() . "</p>";
}

// 2. Schema Check
echo "<h2>2. Schema Check</h2>";
$tables = ['submission_requests', 'ratings'];
$columns = ['is_verified', 'verification_token'];

foreach ($tables as $table) {
    echo "<h3>Table: $table</h3>";
    foreach ($columns as $column) {
        try {
            $stmt = $conn->query("SELECT $column FROM $table LIMIT 1");
            echo "<p style='color:green;'>Column '$column' exists in '$table'.</p>";
        } catch (Exception $e) {
            echo "<p style='color:red;'>Column '$column' MISSING in '$table': " . $e->getMessage() . "</p>";
        }
    }
}

// 3. SMTP Connectivity Test
echo "<h2>3. SMTP Connectivity Test</h2>";
echo "<p>Testing connection to " . SMTP_HOST . " on port " . SMTP_PORT . "...</p>";

$fp = @fsockopen(SMTP_HOST, SMTP_PORT, $errno, $errstr, 10);
if (!$fp) {
    echo "<p style='color:red;'>FAILED to connect to SMTP server: $errstr ($errno)</p>";
    echo "<p>This usually means your hosting provider (Render) is blocking this port.</p>";
} else {
    echo "<p style='color:green;'>SUCCESS: Port " . SMTP_PORT . " is open and reachable.</p>";
    fclose($fp);
}

// 4. PHPMailer Test
echo "<h2>4. PHPMailer Test</h2>";
if (isset($_GET['test_mail'])) {
    $to = $_GET['test_mail'];
    echo "<p>Sending test email to $to...</p>";
    $res = sendEmail($to, "Diagnostic Test Email", "This is a test email from the Amar Recipe diagnostic script.");
    if ($res === true) {
        echo "<p style='color:green;'>SUCCESS: Email sent successfully.</p>";
    } else {
        echo "<p style='color:red;'>FAILED: $res</p>";
    }
} else {
    echo "<p><a href='?test_mail=sharifislam0505@gmail.com'>Click here to send a test email to sharifislam0505@gmail.com</a></p>";
}
?>
