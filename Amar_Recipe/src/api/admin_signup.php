<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);

// Required fields
$required = ['name', 'email', 'password', 'phone'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        echo json_encode(['success' => false, 'message' => "Field '$field' is required"]);
        exit;
    }
}

$name = $data['name'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$phone = $data['phone'];
// Optional fields
$date = $data['date'] ?? null;
$area = $data['area'] ?? null;
$city = $data['city'] ?? null;
$state = $data['state'] ?? null;
$postcode = $data['postcode'] ?? null;
$experience = $data['experience'] ?? null;
$specialty = $data['specialty'] ?? null;
$portfolio = $data['portfolio'] ?? null;
$certification = $data['certification'] ?? null;

$conn = getDbConnection();

// Check if email exists
$stmt = $conn->prepare("SELECT id FROM admin_requests WHERE email = :email");
$stmt->execute([':email' => $email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    exit;
}

try {
    $sql = "INSERT INTO admin_requests (
        name, email, password, phone, date, area, city, state, postcode, 
        experience, specialty, portfolio, certification, status, created_at
    ) VALUES (
        :name, :email, :password, :phone, :date, :area, :city, :state, :postcode,
        :experience, :specialty, :portfolio, :certification, 'pending', NOW()
    )";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':password' => $password,
        ':phone' => $phone,
        ':date' => $date,
        ':area' => $area,
        ':city' => $city,
        ':state' => $state,
        ':postcode' => $postcode,
        ':experience' => $experience,
        ':specialty' => $specialty,
        ':portfolio' => $portfolio,
        ':certification' => $certification
    ]);

    echo json_encode(['success' => true, 'message' => 'আপনার সাইনআপ ফর্মটি অ্যাডমিনের পর্যালোচনার জন্য জমা হয়েছে।']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Signup failed: ' . $e->getMessage()]);
}
