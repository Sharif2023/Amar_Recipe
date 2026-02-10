# Minimal Dockerfile for Amar Recipe Backend
# Using official PHP Apache image with minimal configuration

FROM php:8.2-apache

# Install required PHP extensions only
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Install GD with dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Enable required Apache modules
RUN a2enmod rewrite headers

# Set working directory
WORKDIR /var/www/html

# Copy backend files
COPY src/api/ /var/www/html/src/api/
COPY admin_api/ /var/www/html/admin_api/

# Set permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Expose port
EXPOSE 80

# Use default Apache command
CMD ["apache2-foreground"]
