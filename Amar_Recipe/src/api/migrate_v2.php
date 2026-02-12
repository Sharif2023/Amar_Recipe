<?php
require_once __DIR__ . '/config.php';

/**
 * Migration Script V2
 * Adds missing columns to submission_requests and reports tables
 */

header('Content-Type: text/plain');

try {
    $conn = getDbConnection();
    echo "Connection successful. Running migrations...\n\n";

    // 1. Sync submission_requests
    echo "Processing 'submission_requests' table...\n";
    
    // Check if created_at exists to rename it
    try {
        $conn->exec("ALTER TABLE submission_requests RENAME COLUMN created_at TO submission_date");
        echo " - Renamed 'created_at' to 'submission_date'.\n";
    } catch (Throwable $e) {
        echo " - 'created_at' rename skipped (already renamed or doesn't exist).\n";
    }

    // Add missing columns
    $cols = [
        "action_date TIMESTAMP DEFAULT NULL",
        "admin_name VARCHAR(100) DEFAULT NULL"
    ];
    
    foreach ($cols as $col) {
        try {
            $conn->exec("ALTER TABLE submission_requests ADD COLUMN " . $col);
            echo " - Added column: $col\n";
        } catch (Throwable $e) {
            echo " - Skip/Failed to add column " . explode(' ', $col)[0] . ": Already exists or error.\n";
        }
    }

    // 2. Sync reports
    echo "\nProcessing 'reports' table...\n";
    $cols_reports = [
        "status VARCHAR(50) DEFAULT 'Pending'",
        "action_date TIMESTAMP DEFAULT NULL",
        "admin_name VARCHAR(100) DEFAULT NULL"
    ];

    foreach ($cols_reports as $col) {
        try {
            $conn->exec("ALTER TABLE reports ADD COLUMN " . $col);
            echo " - Added column: $col\n";
        } catch (Throwable $e) {
            echo " - Skip/Failed to add column " . explode(' ', $col)[0] . ": Already exists or error.\n";
        }
    }

    // 3. Sync recipes table (ID column)
    echo "\nProcessing 'recipes' table...\n";
    if (DB_TYPE === 'pgsql') {
        try {
            // Check if default exists
            $stmt = $conn->prepare("SELECT column_default FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'id'");
            $stmt->execute();
            $default = $stmt->fetchColumn();
            
            if (!$default) {
                echo " - Converting 'id' to auto-incrementing...\n";
                $conn->exec("CREATE SEQUENCE IF NOT EXISTS recipes_id_seq");
                $conn->exec("ALTER TABLE recipes ALTER COLUMN id SET DEFAULT nextval('recipes_id_seq')");
                $conn->exec("ALTER SEQUENCE recipes_id_seq OWNED BY recipes.id");
                $conn->exec("SELECT setval('recipes_id_seq', (SELECT MAX(id) FROM recipes))");
                echo " - Successfully converted 'id' to auto-incrementing and reset sequence.\n";
            } else {
                echo " - 'id' already has a default: $default. Resetting sequence anyway...\n";
                $conn->exec("SELECT setval(pg_get_serial_sequence('recipes', 'id'), (SELECT MAX(id) FROM recipes))");
                echo " - Sequence reset.\n";
            }
        } catch (Throwable $e) {
            echo " - Error syncing 'recipes' ID: " . $e->getMessage() . "\n";
        }
    }

    echo "\nMigration completed successfully!\n";

} catch (Throwable $e) {
    echo "\nFATAL ERROR: " . $e->getMessage() . "\n";
}
