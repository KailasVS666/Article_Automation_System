# Frontend Dashboard (React)

React dashboard for reviewing original scraped content versus AI-enhanced output.

## Responsibilities

- Fetch article data from Laravel API.
- Pair original and enhanced records using [Updated] title convention.
- Render summary cards for topics.
- Open split-view overlay for side-by-side comparison.

## Key Files

- src/App.js: data fetching, pairing logic, loading/error states.
- src/components/ArticleList.js: article summary cards.
- src/components/ComparisonOverlay.js: split comparison modal.
- src/components/ArticleCard.js: markdown-enabled article renderer.
- src/App.css: dashboard styling and responsive behavior.

## Environment

Create frontend/.env:

```env
REACT_APP_API_URL=http://127.0.0.1:8000
```

The app calls:

- GET ${REACT_APP_API_URL}/api/articles

## Run Locally

```bash
npm install
npm start
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

## Pairing Strategy

For each original article title T, frontend searches for a matching enhanced row with title:

- [Updated] T

If no enhanced row exists, the UI still shows the original and indicates missing enhanced content in the comparison view.

## Suggested Next Improvements

- Add search/filter for large article sets.
- Add loading placeholders for cards.
- Add component tests for pairing behavior and error handling.
