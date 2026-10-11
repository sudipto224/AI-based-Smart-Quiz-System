# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS frontend-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM php:8.3-apache

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gettext-base \
        libcurl4-openssl-dev \
        libicu-dev \
        libonig-dev \
        libpq-dev \
        libzip-dev \
        unzip \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        curl \
        intl \
        mbstring \
        opcache \
        pdo_pgsql \
        zip \
    && a2enmod headers rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html
COPY . .
COPY --from=frontend-build /app/public/build ./public/build

RUN composer install \
        --no-dev \
        --no-interaction \
        --prefer-dist \
        --optimize-autoloader \
    && mkdir -p \
        bootstrap/cache \
        storage/app/private \
        storage/app/public \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
    && chown -R www-data:www-data bootstrap/cache storage

COPY docker/apache-vhost.conf.template /etc/apache2/sites-available/000-default.conf.template
COPY docker/entrypoint.sh /usr/local/bin/quizora-entrypoint
RUN chmod +x /usr/local/bin/quizora-entrypoint

EXPOSE 10000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -fsS "http://127.0.0.1:${PORT:-10000}/up" || exit 1

ENTRYPOINT ["/usr/local/bin/quizora-entrypoint"]
