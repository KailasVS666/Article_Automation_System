# Backend API (Laravel)

Laravel backend for storing and serving original + AI-enhanced articles.

## Responsibilities

- Persist scraped and generated article records.
- Enforce request validation and URL uniqueness.
- Expose endpoints used by both automation scripts and frontend UI.
- Configure CORS for local frontend and deployed dashboard.

## Tech

- PHP 8.2+
- Laravel 12
- Eloquent ORM
- MySQL or PostgreSQL (Laravel-compatible setup)

## Key Files

- routes/api.php: registers GET/POST article endpoints.
- app/Http/Controllers/ArticleController.php: request validation + persistence.
- app/Models/Article.php: fillable fields.
- database/migrations/2025_12_29_134225_create_articles_table.php: articles schema.
- config/cors.php: allowed frontend origins.
- Dockerfile: Render-oriented container startup.

## API

### POST /api/articles

Request body:

```json
{
	"title": "string",
	"content": "string",
	"url": "https://example.com/article"
}
```

Behavior:

- Validates required fields.
- Requires valid URL format.
- Rejects duplicate URLs using unique constraint.

### GET /api/articles

Behavior:

- Returns all records currently in articles table.
- Includes both original and [Updated] records.

## Local Run

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Backend runs at http://127.0.0.1:8000 by default.

## Environment Notes

- Configure DB_* variables in .env.
- Ensure CORS allowlist includes your frontend host.

## Docker Note

The Dockerfile installs PostgreSQL extensions and starts Laravel with:

```bash
php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
```

This is tuned for simple deployment workflows.

## Suggested Next Improvements

- Add pagination and sorting on GET /api/articles.
- Add dedicated resources/transformers for API responses.
- Add feature tests for store validation and uniqueness behavior.
