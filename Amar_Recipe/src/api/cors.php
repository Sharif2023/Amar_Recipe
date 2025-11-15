<?php
// -----------------------------------------------
// CORS SETTINGS
// -----------------------------------------------
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

// -----------------------------------------------
// UNIVERSAL PROXY
// -----------------------------------------------
if (!isset($_GET["file"])) {
    echo json_encode(["success" => false, "error" => "Missing ?file= parameter"]);
    exit;
}

$file = $_GET["file"]; // example: get_recipes.php

$api_url = "https://amar-recipes.infinityfreeapp.com/api/" . $file;

$method = $_SERVER['REQUEST_METHOD'];

// GET request
if ($method === "GET") {
    $response = file_get_contents($api_url);
}

// POST request
else if ($method === "POST") {
    $postData = http_build_query($_POST);
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $postData
        ]
    ]);
    $response = file_get_contents($api_url, false, $context);
}

else {
    echo json_encode(["success" => false, "error" => "Unsupported method"]);
    exit;
}

// Return InfinityFree response with proper CORS
header("Content-Type: application/json");
echo $response;
