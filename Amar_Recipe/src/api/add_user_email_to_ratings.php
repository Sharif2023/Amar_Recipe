<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

$response = [];
$conn = getDbConnection();

try {
    // 1. Attempt to add the column (PostgreSQL & MySQL compatible syntax mostly, strictly PG here)
    // Using raw query to avoid prepared statement issues with DDL
    $sql = "ALTER TABLE ratings ADD COLUMN IF NOT EXISTS user_email VARCHAR(255)";
    $conn->exec($sql);
    $response['migration_status'] = "Executed ALTER command.";

} catch (Exception $e) {
    $response['migration_error'] = $e->getMessage();
}

try {
    // 2. Verify columns to confirm it exists
    $stmt = $conn->prepare("
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'ratings'
    ");
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $response['current_columns'] = $columns;

    // Check if user_email exists in the list
    $hasEmail = false;
    foreach ($columns as $col) {
        if ($col['column_name'] === 'user_email') {
            $hasEmail = true;
            break;
        }
    }
    $response['success'] = $hasEmail;
    
    if (!$hasEmail) {
        $response['message'] = "Critical: Column 'user_email' is still MISSING after migration attempt.";
    } else {
        $response['message'] = "Success: Column 'user_email' exists.";
    }

} catch (Exception $e) {
    $response['verification_error'] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
