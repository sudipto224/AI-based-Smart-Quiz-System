#!/bin/sh
set -eu

: "${PORT:=10000}"
export PORT

if [ -z "${APP_KEY:-}" ]; then
    echo "APP_KEY must be set in the deployment environment." >&2
    exit 1
fi

envsubst '${PORT}' \
    < /etc/apache2/sites-available/000-default.conf.template \
    > /etc/apache2/sites-available/000-default.conf
printf 'Listen %s\n' "$PORT" > /etc/apache2/ports.conf

mkdir -p \
    bootstrap/cache \
    storage/app/private \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs
chown -R www-data:www-data bootstrap/cache storage
chmod -R ug+rwX bootstrap/cache storage

php artisan storage:link --force

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force
fi

php artisan optimize

exec apache2-foreground
