<?php
// Generate a bcrypt hash for password 'admin123'
$password = 'admin123';
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

echo "Password: " . $password . "\n";
echo "Hash: " . $hash . "\n";
echo "Verify test: " . (password_verify($password, $hash) ? 'OK' : 'FAIL') . "\n";
?>
