# Article Automation System (BeyondChats Intern Assignment)

A complete full-stack automation pipeline that scrapes original blog posts, conducts competitive research via Google, and synthesizes enhanced articles using Gemini AI.

## 📊 Project Architecture
1. **Automation (Node.js)**: Utilizes `Puppeteer Stealth` to research competitors and `Gemini 1.5 Flash` AI to synthesize professional content with citations.
2. **Backend (Laravel 11)**: A robust RESTful API that handles storage and retrieval of articles in MySQL.
3. **Frontend (React.js)**: A modern, responsive dashboard to compare original and AI-synthesized versions side-by-side.

## 🛠️ Local Setup & Installation

### 1. Database (MySQL)
- Start **MySQL** via XAMPP/WAMP.
- **Note**: This project is configured for **Port 3307**.
- Create a database named `article_automation`.

### 2. Backend (Laravel)
- Navigate to `/backend`.
- Update `.env` with `DB_PORT=3307` and your credentials.
- Run `php artisan config:publish cors` (already configured to allow port 3000).
- Run `php artisan serve`.

### 3. Automation Engine (Node.js)
- Navigate to `/automation`.
- Ensure your `GEMINI_API_KEY` is in the `.env` file.
- Run `node researcher.js` to trigger the AI synthesis and update the database.

### 4. Frontend (React)
- Navigate to `/frontend`.
- Run `npm install` and then `npm start`.
- View the dashboard at `http://localhost:3000`.

## ✨ Key Features
- **Stealth Scraping**: Bypasses bot detection to gather competitor data.
- **AI Synthesis**: Generates structured Markdown content with headers and lists.
- **Automated Citations**: Includes links to original competitor sources.
- **Live Comparison**: Professional UI styling to distinguish original vs. enhanced articles.