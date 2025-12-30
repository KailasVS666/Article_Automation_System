# Use official PHP with FPM
FROM php:8.2-fpm

# Install system dependencies and PostgreSQL driver
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Run migrations automatically and start the server
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT