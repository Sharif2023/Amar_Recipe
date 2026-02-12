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
    
    // Check if reasons (plural) exists to rename it to reason (singular)
    try {
        $conn->exec("ALTER TABLE reports RENAME COLUMN reasons TO reason");
        echo " - Renamed 'reasons' to 'reason'.\n";
    } catch (Throwable $e) {
        echo " - 'reasons' rename skipped (already renamed or doesn't exist).\n";
    }

    // Add missing columns if they don't exist
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

    // Ensure id is SERIAL for reports
    if (DB_TYPE === 'pgsql') {
        try {
            $stmt = $conn->prepare("SELECT column_default FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'id'");
            $stmt->execute();
            $default = $stmt->fetchColumn();
            
            if (!$default) {
                echo " - Converting 'reports.id' to auto-incrementing...\n";
                $conn->exec("CREATE SEQUENCE IF NOT EXISTS reports_id_seq");
                $conn->exec("ALTER TABLE reports ALTER COLUMN id SET DEFAULT nextval('reports_id_seq')");
                $conn->exec("ALTER SEQUENCE reports_id_seq OWNED BY reports.id");
                $conn->exec("SELECT setval('reports_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM reports))");
                echo " - Successfully converted 'reports.id' to auto-incrementing.\n";
            }
        } catch (Throwable $e) {
            echo " - Error syncing 'reports' ID: " . $e->getMessage() . "\n";
        }
    }

    // 3. Sync sequences for all tables
    echo "\nProcessing sequences for all tables...\n";
    $tables = ['recipes', 'reports', 'ratings', 'admin_chat_messages', 'submission_requests'];
    
    foreach ($tables as $table) {
        if (DB_TYPE === 'pgsql') {
            try {
                echo " - Processing '$table'...\n";
                // Check if default exists
                $stmt = $conn->prepare("SELECT column_default FROM information_schema.columns WHERE table_name = :table AND column_name = 'id'");
                $stmt->execute([':table' => $table]);
                $default = $stmt->fetchColumn();
                
                $seqName = $table . "_id_seq";
                if (!$default) {
                    echo "   - Converting 'id' to auto-incrementing...\n";
                    $conn->exec("CREATE SEQUENCE IF NOT EXISTS $seqName");
                    $conn->exec("ALTER TABLE $table ALTER COLUMN id SET DEFAULT nextval('$seqName')");
                    $conn->exec("ALTER SEQUENCE $seqName OWNED BY $table.id");
                    $conn->exec("SELECT setval('$seqName', (SELECT COALESCE(MAX(id), 0) + 1 FROM $table))");
                    echo "   - Success.\n";
                } else {
                    echo "   - 'id' already has a default. Resetting sequence...\n";
                    // Try to get sequence name dynamically
                    $stmt = $conn->prepare("SELECT pg_get_serial_sequence(:table, 'id')");
                    $stmt->execute([':table' => $table]);
                    $actualSeq = $stmt->fetchColumn();
                    if ($actualSeq) {
                        $conn->exec("SELECT setval('$actualSeq', (SELECT COALESCE(MAX(id), 0) + 1 FROM $table))");
                        echo "   - Sequence reset.\n";
                    } else {
                        echo "   - Could not find serial sequence name.\n";
                    }
                }
            } catch (Throwable $e) {
                echo "   - Error: " . $e->getMessage() . "\n";
            }
        }
    }

    echo "\nMigration completed successfully!\n";

} catch (Throwable $e) {
    echo "\nFATAL ERROR: " . $e->getMessage() . "\n";
}
