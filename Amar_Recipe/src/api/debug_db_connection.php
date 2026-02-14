<?php
require_once __DIR__ . '/config.php';

try {
    $conn = getDbConnection();
    echo "Connection successful!\n";
    
    $stmt = $conn->query("SELECT id FROM recipes LIMIT 1");
    $row = $stmt->fetch();
    echo "Recipe ID found: " . ($row ? $row['id'] : 'None') . "\n";
    
} catch (Exception $e) {
    file_put_contents('db_debug.log', "DB Error: " . $e->getMessage() . "\n" . $e->getTraceAsString());
    echo "Error logged to db_debug.log\n";
}
