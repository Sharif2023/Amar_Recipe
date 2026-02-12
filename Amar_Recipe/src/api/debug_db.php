<?php
require_once __DIR__ . '/config.php';

header('Content-Type: text/plain');

try {
    $conn = getDbConnection();
    echo "Connection successful.\n\n";

    echo "Dumping first 5 rows from submission_requests:\n";
    $stmt = $conn->query("SELECT * FROM submission_requests LIMIT 5");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($rows)) {
        echo "No submission requests found.\n";
    } else {
        foreach ($rows as $index => $row) {
            echo "Row $index:\n";
            print_r($row);
            echo "-------------------\n";
        }
    }

    echo "\nChecking recipes table schema (id column):\n";
    if (DB_TYPE === 'pgsql') {
        $stmt = $conn->prepare("SELECT column_default FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'id'");
        $stmt->execute();
        $default = $stmt->fetchColumn();
        echo "Default for recipes.id: " . ($default ?: 'NONE') . "\n";
    }

} catch (Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
