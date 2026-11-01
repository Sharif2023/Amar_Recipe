<?php
/**
 * Public user auth helpers: schema, tokens, current user.
 * Tokens are stored hashed; send the raw token as Bearer / X-Auth-Token.
 */

function ensureUserSchema(PDO $conn): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    $isPgsql = defined('DB_TYPE') && DB_TYPE === 'pgsql';

    if ($isPgsql) {
        $conn->exec("
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                address TEXT,
                is_verified BOOLEAN DEFAULT FALSE,
                verification_token VARCHAR(64),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
        $conn->exec("
            CREATE TABLE IF NOT EXISTS user_sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                token_hash VARCHAR(64) NOT NULL UNIQUE,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
        $conn->exec("ALTER TABLE submission_requests ADD COLUMN IF NOT EXISTS user_id INTEGER");
        $conn->exec("ALTER TABLE recipes ADD COLUMN IF NOT EXISTS user_id INTEGER");
        $conn->exec("ALTER TABLE ratings ADD COLUMN IF NOT EXISTS user_id INTEGER");
        $conn->exec("CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)");
        $conn->exec("CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions (token_hash)");
        $conn->exec("CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submission_requests (user_id)");
        $conn->exec("CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes (user_id)");
        $conn->exec("CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings (user_id)");
        return;
    }

    $conn->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NULL,
            address TEXT NULL,
            is_verified TINYINT(1) DEFAULT 0,
            verification_token VARCHAR(64) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    $conn->exec("
        CREATE TABLE IF NOT EXISTS user_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token_hash VARCHAR(64) NOT NULL UNIQUE,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_user_sessions_user (user_id),
            CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    foreach (['submission_requests', 'recipes', 'ratings'] as $table) {
        try {
            $conn->exec("ALTER TABLE {$table} ADD COLUMN user_id INT NULL");
        } catch (Throwable $e) {
            // Column already exists
        }
    }
}

function getRequestAuthToken(): ?string
{
    $header = '';

    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $header = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('getallheaders')) {
        foreach (getallheaders() as $key => $value) {
            if (strtolower($key) === 'authorization') {
                $header = $value;
                break;
            }
        }
    }

    if (preg_match('/Bearer\s+(\S+)/i', $header, $matches)) {
        return $matches[1];
    }

    if (!empty($_SERVER['HTTP_X_AUTH_TOKEN'])) {
        return $_SERVER['HTTP_X_AUTH_TOKEN'];
    }

    return null;
}

function publicUserPayload(array $user): array
{
    return [
        'id' => (int) $user['id'],
        'name' => $user['name'] ?? '',
        'email' => $user['email'] ?? '',
        'phone' => $user['phone'] ?? '',
        'address' => $user['address'] ?? '',
        'is_verified' => !empty($user['is_verified']) && $user['is_verified'] !== 'f' && $user['is_verified'] !== false,
        'created_at' => $user['created_at'] ?? null,
    ];
}

function createUserSession(PDO $conn, int $userId): string
{
    $token = bin2hex(random_bytes(32));
    $hash = hash('sha256', $token);

    $isPgsql = defined('DB_TYPE') && DB_TYPE === 'pgsql';
    if ($isPgsql) {
        $sql = "INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES (:user_id, :token_hash, NOW() + INTERVAL '30 days')";
    } else {
        $sql = "INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES (:user_id, :token_hash, DATE_ADD(NOW(), INTERVAL 30 DAY))";
    }

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':user_id' => $userId,
        ':token_hash' => $hash,
    ]);

    return $token;
}

function getAuthenticatedUser(PDO $conn, bool $required = false): ?array
{
    ensureUserSchema($conn);
    $token = getRequestAuthToken();

    if (!$token) {
        if ($required) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Login required.']);
            exit;
        }
        return null;
    }

    $hash = hash('sha256', $token);
    $stmt = $conn->prepare("
        SELECT u.id, u.name, u.email, u.phone, u.address, u.is_verified, u.created_at
        FROM user_sessions s
        INNER JOIN users u ON u.id = s.user_id
        WHERE s.token_hash = :token_hash AND s.expires_at > NOW()
        LIMIT 1
    ");
    $stmt->execute([':token_hash' => $hash]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        if ($required) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Session expired. Please login again.']);
            exit;
        }
        return null;
    }

    $user['is_verified'] = !empty($user['is_verified']) && $user['is_verified'] !== 'f';
    return $user;
}

function requireVerifiedUser(PDO $conn): array
{
    $user = getAuthenticatedUser($conn, true);
    if (empty($user['is_verified'])) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Please verify your email before continuing.']);
        exit;
    }
    return $user;
}
