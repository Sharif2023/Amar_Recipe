<?php
require_once __DIR__ . '/../src/api/config.php';

$data = json_decode(file_get_contents("php://input"), true);
$conn = getDbConnection();


if (!isset($data['password']) || empty($data['password'])) {
  echo json_encode(["message" => "Password is required"]);
  exit;
}

$stmt = $conn->prepare("INSERT INTO admin_requests (name, phone, email, date, area, city, state, postcode, experience, specialty, portfolio, certification, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);

date_default_timezone_set('Asia/Dhaka');
$date = date('Y-m-d H:i:s');  

$stmt->bind_param("sssssssssssss", 
  $data['name'], 
  $data['phone'], 
  $data['email'], 
  $date,
  $data['area'], 
  $data['city'], 
  $data['state'], 
  $data['postcode'],
  $data['experience'], 
  $data['specialty'], 
  $data['portfolio'],
  $data['certification'], 
  $hashed_password
);

if ($stmt->execute()) {
    echo json_encode(["message" => "Signup request submitted"]);
} else {
    echo json_encode(["message" => "Error submitting request"]);
}

$stmt->close();
$conn->close();
?>
