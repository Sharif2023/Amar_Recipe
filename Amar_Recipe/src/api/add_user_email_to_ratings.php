<?php
require_once __DIR__ . '/config.php';

try {
    $conn = getDbConnection();
    
    // Add user_email column if it doesn't exist
    // Works for both PostgreSQL and MySQL
    $sql = "ALTER TABLE ratings ADD COLUMN IF NOT EXISTS user_email VARCHAR(255)";
    
    $conn->exec($sql);
    
    echo "Successfully added 'user_email' column to 'ratings' table.";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
