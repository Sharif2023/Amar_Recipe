<?php
require_once 'cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$result = $conn->query("SELECT * FROM admin_requests");
$rows = [];

while($row = $result->fetch_assoc()) {
    $rows[] = $row;
}
echo json_encode($rows);
?>

