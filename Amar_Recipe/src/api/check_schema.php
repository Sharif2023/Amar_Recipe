<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();
$tables = ['submission_requests', 'ratings'];
$columns = ['is_verified', 'verification_token'];

echo "Checking Database Schema:\n";

foreach ($tables as $table) {
    echo "Table: $table\n";
    foreach ($columns as $column) {
        try {
            $conn->query("SELECT $column FROM $table LIMIT 0");
            echo "  - Column '$column': EXISTS\n";
        } catch (Exception $e) {
            echo "  - Column '$column': MISSING (" . $e->getMessage() . ")\n";
        }
    }
}
