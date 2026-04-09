# Article Automation System

Automated pipeline that scrapes legacy blog posts, enriches them using web research + Gemini, stores both original and enhanced versions in Laravel, and exposes them in a React comparison dashboard.

## Problem This Project Solves

Many teams have older blog content that is still valuable but outdated. This project demonstrates a practical workflow to:

1. Ingest historical content from a public blog.
2. Research related material from search results.
3. Generate a better structured and more current rewrite.
4. Present original vs enhanced versions side-by-side for review.

## Architecture

```mermaid
graph TD
        A[BeyondChats Blog] -->|Phase 1: scrape oldest posts| B[Node Automation: scraper.js]
        B -->|POST /articles| C[Laravel API + Database]
        C -->|GET /articles| D[Node Automation: researcher.js]
        D -->|Google SERP + article extraction| E[Research Context]
        E -->|Gemini prompt + synthesis| F[Enhanced Markdown]
        F -->|POST /articles as [Updated] title| C
        C -->|GET /api/articles| G[React Dashboard]
        G -->|select pair| H[Split comparison overlay]
```

## Tech Stack

- Automation: Node.js, Puppeteer Extra (Stealth), Axios, JSDOM, Readability, Google Generative AI SDK
- API: Laravel 12 (PHP 8.2), Eloquent ORM, REST endpoints
- Database: MySQL or PostgreSQL-compatible Laravel setup
- Frontend: React (CRA), Axios, React Markdown
- Deployment model (as configured): Vercel (frontend), Render (backend)

## Repository Structure

```text
automation/   # scraping + research + AI synthesis scripts
backend/      # Laravel API + migrations + Dockerfile
frontend/     # React dashboard for article pair review
```

## Current Workflow (Verified Against Code)

### Phase 1: Scrape oldest blog posts

- Script: automation/scraper.js
- Uses Puppeteer to find the last pagination page and walk backward.
- Extracts title, URL, and body content.
- Persists records through backend POST /articles.

### Phase 2: Research and rewrite

- Script: automation/researcher.js
- Fetches all stored articles from backend GET /articles.
- Skips already enhanced articles by checking [Updated] title pairs.
- For each pending original article:
    - Queries Google search by title.
    - Opens top results.
    - Extracts readable text with Mozilla Readability.
    - Prompts Gemini to produce an improved Markdown rewrite.
- Saves enhanced content as a new row with title prefix [Updated].

### Phase 3: Review UI

- App: frontend/src/App.js
- Fetches API data and pairs original article with its [Updated] version.
- Displays card grid and split-view modal to compare outputs.

## API Endpoints

- POST /api/articles
    - Validates title, content, and unique URL.
    - Creates article record.
- GET /api/articles
    - Returns all stored rows (original + updated).

## Local Setup

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL or PostgreSQL
- Gemini API key

### 1) Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Set database credentials in backend/.env.

### 2) Automation

```bash
cd automation
npm install
```

Create automation/.env:

```env
BACKEND_API_URL=http://127.0.0.1:8000/api
GEMINI_API_KEY=your_gemini_key
```

Run:

```bash
node scraper.js
node researcher.js
```

Optional model check:

```bash
node check_models.js
```

### 3) Frontend

```bash
cd frontend
npm install
npm start
```

Create frontend/.env:

```env
REACT_APP_API_URL=http://127.0.0.1:8000
```

## What This Demonstrates (Internship-Relevant)

- End-to-end system design across scraping, API, AI, and UI.
- Data pipeline thinking (ingestion -> processing -> presentation).
- Practical API integration with validation and persistence.
- Defensive automation patterns (timeouts, retries/skip behavior).
- Product-minded UX for evaluators to inspect output quality.

## Known Limitations and Next Improvements

- Tests are mostly scaffold defaults and need project-specific coverage.
- Duplicate prevention relies on title prefix + unique URL convention.
- Scraper/researcher currently run sequentially as scripts (no queue/worker orchestration).
- Browser automation runs non-headless for transparency/debugging; can be optimized for CI.

## Live Links

- Dashboard: https://article-automation-system-one.vercel.app/
- API sample: https://article-automation-system.onrender.com/api/articles
- Repository: https://github.com/KailasVS666/Article_Automation_System


