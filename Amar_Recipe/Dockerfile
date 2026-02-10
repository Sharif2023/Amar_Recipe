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

# Fix Apache MPM conflict - disable all MPMs except event
RUN a2dismod mpm_prefork mpm_worker || true
RUN a2enmod mpm_event

# Enable Apache modules
RUN a2enmod rewrite headers

# Set working directory
WORKDIR /var/www/html

# Copy API files only (backend)
COPY src/api/ /var/www/html/src/api/
COPY admin_api/ /var/www/html/admin_api/

# Create upload directories with proper permissions
RUN mkdir -p /var/www/html/src/api/uploads \
    && mkdir -p /var/www/html/src/api/admin_dp_uploads \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/src/api/uploads \
    && chmod -R 775 /var/www/html/src/api/admin_dp_uploads

# Expose port 80
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"]
