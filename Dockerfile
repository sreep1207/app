# Stage 1: Setup Nginx Server with PHP 8.2 on Ubuntu
FROM ubuntu:22.04 AS base

# Set the timezone to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies and Nginx official signing key
RUN apt-get update && \
    apt-get install -y \
        curl \
        gnupg \
        lsb-release \
        tzdata && \
    echo "UTC" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata && \
    curl -fsSL https://nginx.org/keys/nginx_signing.key | apt-key add -

# Add Nginx official repository for the latest version
RUN echo "deb https://nginx.org/packages/ubuntu/ `lsb_release -cs` nginx" \
        | tee /etc/apt/sources.list.d/nginx.list

# Add the repository for PHP 8.2 and update package list
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:ondrej/php && \
    apt-get update

# Install necessary packages for PHP and Nginx
RUN apt-get update && \
    apt-get install -y \
        nginx=1.24.* \
        nano \
        npm \
        gulp \
        php8.2-fpm \
        php8.2-cli \
        php8.2-common \
        php8.2-curl \
        php8.2-gd \
        php8.2-igbinary \
        php8.2-intl \
        php8.2-mbstring \
        php8.2-memcache \
        php8.2-memcached \
        php8.2-msgpack \
        php8.2-mysql \
        php8.2-opcache \
        php8.2-readline \
        php8.2-soap \
        php8.2-xml \
        php8.2-xsl \
        php8.2-zip \
        php8.2-bcmath \
        git \
        unzip && \
    rm -rf /var/lib/apt/lists/*

# Install Composer (latest stable version)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Create the /run/php directory with correct permissions for PHP-FPM
RUN mkdir -p /run/php && chown -R www-data:www-data /run/php

# Configure PHP-FPM
COPY php-fpm.conf /etc/php/8.2/fpm/php-fpm.conf
RUN ln -s /usr/sbin/php-fpm8.2 /usr/sbin/php-fpm

# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Remove default server definition
RUN rm -f /etc/nginx/sites-enabled/default

# Create a non-root user to run Composer and the application
RUN groupadd -g 1000 appuser && \
    useradd -m -s /bin/bash -r -u 1000 -g appuser appuser

# Stage 2: Build Application
FROM base

# Set working directory
WORKDIR /app

# Copy the application source code
COPY . .

# Ensure the app directory exists and has correct permissions
RUN chown -R appuser:appuser /app
# Copy the rest of the application
COPY --chown=appuser:appuser . .

# Switch to appuser to install Composer dependencies
USER appuser

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-cache --no-interaction

# Generate autoload files
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# Switch back to root to set permissions and copy synchronization script
USER root

# Set permissions for Nginx to access files
RUN mkdir -p /var/www/html && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Expose port 80
EXPOSE 80

# Set the script to run at container startup
ENTRYPOINT ["sh", "-c", "php-fpm8.2 -D && nginx -g 'daemon off;'"]

