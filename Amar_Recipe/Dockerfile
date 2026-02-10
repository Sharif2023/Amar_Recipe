# Use Debian-based PHP with Apache
FROM php:8.2-apache-bullseye

# Install required extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd mysqli pdo pdo_mysql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Completely remove all MPM modules and reinstall only one
RUN apt-get update && \
    apt-get remove -y apache2-bin && \
    apt-get install -y apache2 apache2-bin && \
    a2dismod mpm_prefork mpm_worker mpm_event || true && \
    a2enmod mpm_prefork && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable modules
RUN a2enmod rewrite headers

# Working directory
WORKDIR /var/www/html

# Copy files
COPY src/api/ /var/www/html/src/api/
COPY admin_api/ /var/www/html/admin_api/

# Permissions
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Expose
EXPOSE 80

# Start
CMD ["apache2-foreground"]
