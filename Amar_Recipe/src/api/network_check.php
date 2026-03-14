<?php
require_once __DIR__ . '/config.php';

echo "<h1>Network Diagnostic</h1>";

$hosts = [
    'google.com' => [80],
    'smtp.gmail.com' => [587, 465, 25],
    'db.iseehucuytvgtpdqupzp.supabase.co' => [5432],
    'aws-1-ap-southeast-2.pooler.supabase.com' => [6543]
];

// Try to resolve Gmail SMTP to IP
$gmailIp = gethostbyname('smtp.gmail.com');
if ($gmailIp !== 'smtp.gmail.com') {
    $hosts[$gmailIp] = [587, 465];
    echo "<p>Resolved smtp.gmail.com to <strong>$gmailIp</strong></p>";
} else {
    echo "<p style='color:red;'>FAILED to resolve smtp.gmail.com via DNS</p>";
}

foreach ($hosts as $host => $ports) {
    echo "<h3>Testing Host: $host</h3>";
    foreach ($ports as $port) {
        $start = microtime(true);
        $fp = @fsockopen($host, $port, $errno, $errstr, 5);
        $end = microtime(true);
        $duration = round(($end - $start) * 1000, 2);
        
        if ($fp) {
            echo "<p style='color:green;'>SUCCESS: $host:$port is REACHABLE ($duration ms)</p>";
            fclose($fp);
        } else {
            echo "<p style='color:red;'>FAILED: $host:$port is UNREACHABLE. Error: $errstr ($errno) - Time: $duration ms</p>";
        }
    }
}

echo "<h2>PHP Info</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>OpenSSL Enabled: " . (extension_loaded('openssl') ? 'Yes' : 'No') . "</p>";
?>
