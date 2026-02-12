
    CREATE TABLE IF NOT EXISTS submission_requests (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) DEFAULT NULL,
        location VARCHAR(255) NOT NULL,
        organizerName VARCHAR(255) NOT NULL,
        organizerEmail VARCHAR(255) NOT NULL,
        organizerAddress VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        tags VARCHAR(255) DEFAULT NULL,
        reference VARCHAR(255) DEFAULT NULL,
        tutorialVideo VARCHAR(255) DEFAULT NULL,
        comment TEXT DEFAULT NULL,
        source VARCHAR(100) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        reporter_email VARCHAR(255) NOT NULL,
        reason TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
