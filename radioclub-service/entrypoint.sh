#!/bin/sh

set -e

cd /var/www/html

if [ ! -f .env ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
fi

if [ ! -d vendor ]; then
    echo "Installing composer dependencies..."
    composer install --optimize-autoloader --no-dev
fi

if grep -q '^APP_KEY=$' .env || [ -z "$(grep '^APP_KEY=' .env | sed 's/APP_KEY=//')" ]; then
    echo "Generating app key..."
    php artisan key:generate --force
fi

echo "Configuring database..."
sed -i "s/DB_HOST=.*/DB_HOST=${DB_HOST:-mysql}/" .env
sed -i "s/DB_PORT=.*/DB_PORT=${DB_PORT:-3306}/" .env
sed -i "s/DB_DATABASE=.*/DB_DATABASE=${DB_DATABASE:-radioclub}/" .env
sed -i "s/DB_USERNAME=.*/DB_USERNAME=${DB_USERNAME:-root}/" .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=${DB_PASSWORD:-root}/" .env

echo "Waiting for database..."
until php -r "
\$host = getenv('DB_HOST') ?: 'mysql';
\$port = getenv('DB_PORT') ?: 3306;
\$dbname = getenv('DB_DATABASE') ?: 'radioclub';
\$user = getenv('DB_USERNAME') ?: 'root';
\$pass = getenv('DB_PASSWORD') ?: 'root';
try {
    new PDO(\"mysql:host=\$host;port=\$port;dbname=\$dbname\", \$user, \$pass);
    echo 'OK';
} catch (Exception \$e) {
    echo 'FAIL';
}
" | grep -q OK; do
    sleep 2
done

echo "Running migrations..."
php artisan migrate --force

if [ ! -f storage/.seeded ]; then
    echo "Running seeders..."
    php artisan db:seed --force
    touch storage/.seeded
    echo "Database seeded successfully."
fi

echo "Clearing cache..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Setting permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

echo "Starting PHP-FPM..."
exec php-fpm
