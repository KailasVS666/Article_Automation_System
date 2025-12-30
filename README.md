# Article Automation System (BeyondChats Intern Assignment)

A complete full-stack automation pipeline that scrapes original blog posts, conducts competitive research via Google, and synthesizes enhanced articles using Gemini AI.

---

## 📊 Project Architecture

1. **Automation (Node.js)**: Utilizes `Puppeteer Stealth` to research competitors and `Gemini 1.5 Flash` AI to synthesize professional content with citations.
2. **Backend (Laravel 11)**: A robust RESTful API that handles storage and retrieval of articles in MySQL.
3. **Frontend (React.js)**: A modern, responsive dashboard to compare original and AI-synthesized versions side-by-side.

---

## 🛠️ Local Setup & Installation

### 1. Database (MySQL)

- Start **MySQL** via XAMPP/WAMP.
- **Note**: This project is configured for **Port 3307**.
- Create a database named `article_automation`.

### 2. Backend (Laravel)

```bash
cd backend
# Update .env with DB_PORT=3307 and your credentials
php artisan config:publish cors
php artisan serve
```

### 3. Automation Engine (Node.js)

```bash
cd automation
# Ensure your GEMINI_API_KEY is in the .env file
node researcher.js
```

### 4. Frontend (React)

```bash
cd frontend
npm install
npm start
# Open http://localhost:3000 in your browser
```

---

## 🎨 Frontend Features

### Dashboard Overview

- **Article Grid View**: Displays all scraped articles in a responsive card layout
- **Side-by-Side Comparison**: Click any article card to view original vs AI-enhanced versions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Theme**: Professional dark mode UI optimized for readability

### Key Components

1. **ArticleList**: Grid layout showing all article pairs with preview snippets
2. **ComparisonOverlay**: Split-screen modal for detailed side-by-side comparison
3. **Error Handling**: Graceful error messages if backend is unavailable
4. **Empty States**: Clear messaging when no articles are found

---

## 🚀 Running the Complete System

1. **Start MySQL** (Port 3307)
2. **Start Backend**: `cd backend && php artisan serve` (Port 8000)
3. **Start Frontend**: `cd frontend && npm start` (Port 3000)
4. **Run Automation** (when needed): `cd automation && node researcher.js`

The frontend will automatically fetch articles from `http://127.0.0.1:8000/api/articles` and display them in the dashboard at `http://localhost:3000`.

---

## ✨ Key Features

- **Stealth Scraping**: Bypasses bot detection to gather competitor data.
- **AI Synthesis**: Generates structured Markdown content with headers and lists.
- **Automated Citations**: Includes links to original competitor sources.
- **Live Comparison**: Professional UI styling to distinguish original vs. enhanced articles.