# Dockerfile for Amar Recipe Backend (PHP + Apache)
# Railway deployment for PHP backend with MySQL database

FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    gd \
    mysqli \
    pdo \
    pdo_mysql

# Enable Apache modules
RUN a2enmod rewrite headers

# Set working directory
WORKDIR /var/www/html

# Copy API files
COPY src/api/ /var/www/html/src/api/
COPY admin_api/ /var/www/html/admin_api/
COPY .htaccess /var/www/html/.htaccess

# Create upload directories with proper permissions
RUN mkdir -p /var/www/html/src/api/uploads \
    && mkdir -p /var/www/html/src/api/admin_dp_uploads \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/src/api/uploads \
    && chmod -R 775 /var/www/html/src/api/admin_dp_uploads

# Configure Apache virtual host
RUN echo '<VirtualHost *:${PORT}>\n\
    ServerAdmin webmaster@localhost\n\
    DocumentRoot /var/www/html\n\
    \n\
    <Directory /var/www/html>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    \n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Update Apache to listen on Railway's PORT
RUN echo 'Listen ${PORT}' > /etc/apache2/ports.conf

# Expose Railway PORT
EXPOSE ${PORT}

# Start Apache in foreground
CMD ["apache2-foreground"]
