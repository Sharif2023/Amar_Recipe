<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

// Left join recipe_images so we can derive image_url when recipes.image_url is null but image data exists
$sql = "SELECT r.*, (ri.recipe_id IS NOT NULL) AS has_image
        FROM recipes r
        LEFT JOIN recipe_images ri ON r.id = ri.recipe_id
        ORDER BY r.created_at DESC";
$stmt = $conn->query($sql);

$recipes = $stmt->fetchAll();

$baseUrl = defined('API_BASE_URL') ? API_BASE_URL : '';

foreach ($recipes as &$recipe) {
    $imageUrl = $recipe['image_url'] ?? '';
    $hasImage = !empty($recipe['has_image']);
    if ((trim($imageUrl) === '' || $imageUrl === null) && $hasImage) {
        $recipe['image_url'] = $baseUrl . 'get_image.php?id=' . (int) $recipe['id'];
    }
    unset($recipe['has_image']);
}
unset($recipe);

echo json_encode(['success' => true, 'recipes' => $recipes]);
