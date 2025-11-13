<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$result = $conn->prepare("SELECT * FROM admin_requests WHERE email=? AND status='approved'");
$result->bind_param("s", $data['email']);
$result->execute();
$user = $result->get_result()->fetch_assoc();

if ($user && password_verify($data['password'], $user['password'])) {
    echo json_encode(["success" => true, "admin" => $user]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid Email or Password"]);
}
?>

