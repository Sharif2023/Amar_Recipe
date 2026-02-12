<?php
require_once __DIR__ . '/src/api/config.php';

try {
    $conn = getDbConnection();
    echo "Connection successful. DB_TYPE: " . DB_TYPE . "\n";
    
    // Check if table exists
    $table = 'submission_requests';
    if (DB_TYPE === 'pgsql') {
        $stmt = $conn->prepare("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table)");
        $stmt->execute([':table' => $table]);
    } else {
        $stmt = $conn->prepare("SHOW TABLES LIKE :table");
        $stmt->execute([':table' => $table]);
    }
    $exists = $stmt->fetch();
    if (!$exists) {
        echo "Error: Table '$table' does not exist.\n";
        exit;
    }
    echo "Table '$table' exists.\n";

    // Try the query
    $sql = "SELECT * FROM $table WHERE status = 'Pending' ORDER BY submission_date DESC";
    echo "Running query: $sql\n";
    $stmt = $conn->query($sql);
    $requests = $stmt->fetchAll();
    echo "Success! Found " . count($requests) . " pending requests.\n";

} catch (Throwable $e) {
    echo "CAUGHT ERROR: " . $e->getMessage() . "\n";
    
    // Try workaround with created_at if submission_date failed
    if (strpos($e->getMessage(), 'submission_date') !== false) {
        echo "Retrying with 'created_at'...\n";
        try {
            $sql = "SELECT * FROM $table WHERE status = 'Pending' ORDER BY created_at DESC";
            $stmt = $conn->query($sql);
            echo "Success with 'created_at'!\n";
        } catch (Throwable $e2) {
            echo "Error with 'created_at' too: " . $e2->getMessage() . "\n";
        }
    }
}
