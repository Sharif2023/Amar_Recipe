<?php
require_once __DIR__ . '/src/api/config.php';

try {
    $conn = getDbConnection();
    echo "Connected successfully.\n";
    
    $stmt = $conn->query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'submission_requests'");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Columns in submission_requests:\n";
    foreach ($columns as $col) {
        echo $col['column_name'] . " (" . $col['data_type'] . ")\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
