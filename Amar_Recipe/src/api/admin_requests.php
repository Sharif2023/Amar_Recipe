<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();
$result = $conn->query("SELECT * FROM admin_requests");
$rows = [];

while($row = $result->fetch_assoc()) {
    $rows[] = $row;
}
echo json_encode($rows);
?>

