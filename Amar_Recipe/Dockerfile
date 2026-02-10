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

# Create startup script that configures Apache with Railway's PORT
RUN echo '#!/bin/bash\n\
# Use Railway PORT or default to 80\n\
export PORT=${PORT:-80}\n\
\n\
# Configure Apache to listen on the PORT\n\
echo "Listen $PORT" > /etc/apache2/ports.conf\n\
\n\
# Configure virtual host\n\
cat > /etc/apache2/sites-available/000-default.conf <<EOF\n\
<VirtualHost *:$PORT>\n\
    ServerAdmin webmaster@localhost\n\
    DocumentRoot /var/www/html\n\
    \n\
    <Directory /var/www/html>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    \n\
    ErrorLog /dev/stderr\n\
    CustomLog /dev/stdout combined\n\
</VirtualHost>\n\
EOF\n\
\n\
# Start Apache\n\
exec apache2-foreground\n\
' > /usr/local/bin/start-apache.sh && chmod +x /usr/local/bin/start-apache.sh

# Expose port
EXPOSE 80

# Start Apache with dynamic PORT configuration
CMD ["/usr/local/bin/start-apache.sh"]
