<?php
require_once __DIR__ . '/src/api/config.php';

// Force local connection (don't set RENDER env var)
$conn = getDbConnection();

echo "Connected to local DB.\n";

$tables = ['submission_requests', 'reports'];

foreach ($tables as $table) {
    try {
        $stmt = $conn->query("SHOW CREATE TABLE $table");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "\n--- $table Schema ---\n";
        echo $row['Create Table'] . ";\n";
    } catch (Exception $e) {
        echo "Error dumping $table: " . $e->getMessage() . "\n";
    }
}
