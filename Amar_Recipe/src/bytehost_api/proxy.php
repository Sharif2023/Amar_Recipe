<?php
// -----------------------------
// UNIVERSAL PROXY + CORS
// -----------------------------

// Allowed origins for CORS
$allowed_origins = [
    'https://amar-recipe.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? "";

if ($origin && in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: *");
}

header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// -----------------------------
// Determine which InfinityFree API to call
// -----------------------------
if (!isset($_GET["file"])) {
    echo json_encode(["success" => false, "error" => "Missing ?file= parameter"]);
    exit;
}

$file = $_GET["file"]; // e.g., get_recipes.php, approve_submission.php

$infinity_url = "https://amar-recipes.infinityfreeapp.com/api/" . $file;

// -----------------------------
// Handle GET or POST requests
// -----------------------------
$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    $response = file_get_contents($infinity_url);
} 
else if ($method === "POST") {
    $postData = file_get_contents("php://input"); // supports JSON POST
    $opts = [
        "http" => [
            "method" => "POST",
            "header" => "Content-Type: application/json\r\n",
            "content" => $postData
        ]
    ];
    $context = stream_context_create($opts);
    $response = file_get_contents($infinity_url, false, $context);
} 
else {
    echo json_encode(["success" => false, "error" => "Unsupported method"]);
    exit;
}

// -----------------------------
// Return InfinityFree response with proper CORS
// -----------------------------
header("Content-Type: application/json");
echo $response;
?>
