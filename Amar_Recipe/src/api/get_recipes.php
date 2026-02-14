<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

$baseUrl = defined('API_BASE_URL') ? API_BASE_URL : '';
$recipes = [];
$hasImageTable = false;

// Try query with LEFT JOIN recipe_images (derive image_url when null); fall back if table missing
try {
    $sql = "SELECT r.*, (ri.recipe_id IS NOT NULL) AS has_image
            FROM recipes r
            LEFT JOIN recipe_images ri ON r.id = ri.recipe_id
            ORDER BY r.created_at DESC";
    $stmt = $conn->query($sql);
    $recipes = $stmt->fetchAll();
    $hasImageTable = true;
} catch (Exception $e) {
    // recipe_images may not exist on this environment; use simple query
    $sql = "SELECT * FROM recipes ORDER BY created_at DESC";
    $stmt = $conn->query($sql);
    $recipes = $stmt->fetchAll();
}

foreach ($recipes as &$recipe) {
    $imageUrl = $recipe['image_url'] ?? '';
    $imageUrlStr = trim((string) $imageUrl);
    $id = (int) $recipe['id'];

    if ($hasImageTable && array_key_exists('has_image', $recipe)) {
        $hasImage = !empty($recipe['has_image']);
        $dbImageUrl = $baseUrl . 'get_image.php?id=' . $id;
        if ($hasImage) {
            $recipe['image_url'] = $dbImageUrl;
        } elseif ($imageUrlStr !== '' && strpos((string) $imageUrl, 'uploads/') !== false) {
            $recipe['image_url'] = null;
        }
        unset($recipe['has_image']);
    } elseif ($imageUrlStr !== '' && strpos((string) $imageUrl, 'uploads/') !== false) {
        $recipe['image_url'] = null;
    }
}
unset($recipe);

echo json_encode(['success' => true, 'recipes' => $recipes]);
