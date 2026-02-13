<?php
require_once __DIR__ . '/config.php';

$conn = getDbConnection();

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS recipe_images (
        recipe_id INT PRIMARY KEY,
        image_data BYTEA,
        file_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_recipe
            FOREIGN KEY(recipe_id) 
            REFERENCES recipes(id)
            ON DELETE CASCADE
    )";

    $conn->exec($sql);
    echo "Table 'recipe_images' created successfully (or already exists).";

} catch (PDOException $e) {
    echo "Error creating table: " . $e->getMessage();
}
