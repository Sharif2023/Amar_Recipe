<?php
require_once __DIR__ . '/src/api/config.php';
try {
    $conn = getDbConnection();
    $stmt = $conn->query("SELECT * FROM recipes LIMIT 1");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        echo json_encode(array_keys($row));
    } else {
        // If empty, try information_schema
        $stmt = $conn->prepare("SELECT column_name FROM information_schema.columns WHERE table_name = 'recipes'");
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_COLUMN));
    }
} catch (Exception $e) {
    echo $e->getMessage();
}
