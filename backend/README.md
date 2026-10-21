<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Deploying on Render with Docker

Create a Render **Web Service** from this repository with **Docker** as the runtime. Set the service root/context directory to `backend` and the Dockerfile path to `Dockerfile`. Render supplies `PORT`; the container configures Apache to listen on it and serves Laravel from `public/`.

Create a Render PostgreSQL database in the same region as the web service and configure these environment variables in Render (never commit production values):

| Variable | Value |
| --- | --- |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | A generated Laravel key. Generate one with `php artisan key:generate --show` in a trusted local environment and add it as a Render secret. |
| `APP_URL` | The public HTTPS URL of the Render web service. |
| `LOG_CHANNEL` | `stderr`, so application logs appear in Render. |
| `DB_CONNECTION` | `pgsql` |
| `DB_URL` | The Render PostgreSQL **internal** connection URL. Use the internal URL when services share a region. Alternatively set `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`. |
| `RUN_MIGRATIONS` | `true` to run `php artisan migrate --force` when the container starts. Set to `false` only when migrations are run separately before deploy. |

The Laravel middleware trusts Render's forwarded HTTPS protocol header so named routes and form submissions use the public HTTPS scheme.

Laravel also needs outbound SMTP configuration for registration verification links: set `MAIL_MAILER=smtp`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, and `MAIL_FROM_ADDRESS`. Use `MAIL_SCHEME=smtps` for implicit TLS (commonly port `465`); for STARTTLS (commonly port `587`), leave `MAIL_SCHEME` unset. Set `MAIL_FROM_NAME` to `Quizora` if desired. Add `GROQ_API_KEY` as a Render secret to enable the existing AI question-generation features.

Laravel's configured session, cache, and queue drivers use the database by default; PostgreSQL migrations run at startup when `RUN_MIGRATIONS=true`. Render's container filesystem is ephemeral, so configure a persistent disk or external object storage before relying on uploaded or generated files across deploys/restarts.

The Docker build installs production Composer dependencies, installs frontend dependencies with `npm ci`, and builds Vite assets. `.dockerignore` excludes environment files, dependencies, generated files, and credentials from the image build context.
