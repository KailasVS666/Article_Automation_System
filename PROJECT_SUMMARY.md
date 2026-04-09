# Project Summary: Article Automation System

## Elevator Pitch
Article Automation System is an end-to-end content engineering pipeline that modernizes legacy blog posts using web automation, API orchestration, and LLM-powered rewriting. The system scrapes historical articles, performs targeted competitor research, generates enhanced versions with Gemini, stores both original and improved drafts in a structured backend, and presents side-by-side comparisons in a review dashboard.

## Problem Statement
Many companies have large archives of older blog content that still rank or hold business value but are outdated in quality, structure, and relevance. Manually refreshing this content is time-consuming and inconsistent. This project solves that by automating the full refresh workflow, from ingestion to enhancement to quality review.

## What the System Does
1. Scrapes the oldest blog posts from a target archive using browser automation.
2. Stores source articles in a Laravel backend via validated REST endpoints.
3. Pulls pending source articles and performs search-driven context gathering.
4. Extracts readable text from top result pages.
5. Uses Gemini to synthesize an improved, professional Markdown rewrite.
6. Saves enhanced versions as paired records in the database.
7. Displays original and enhanced versions in a React dashboard for side-by-side evaluation.

## Architecture Overview
- Automation Layer (Node.js):
  - scraper.js handles archive crawling and source extraction.
  - researcher.js handles search, context extraction, and AI rewrite generation.
- API/Data Layer (Laravel 12 + Eloquent):
  - POST /api/articles stores article records with request validation.
  - GET /api/articles returns all article rows for automation and frontend consumption.
- Presentation Layer (React):
  - Fetches all records and pairs originals with enhanced entries using a naming convention.
  - Renders topic cards and a split-view comparison overlay for human review.

## Core Technical Stack
- Node.js, Puppeteer Extra, Stealth plugin, Axios
- JSDOM + Mozilla Readability for text extraction
- Google Generative AI SDK (Gemini)
- Laravel 12, PHP 8.2, Eloquent ORM
- MySQL/PostgreSQL-compatible setup
- React, Axios, React Markdown
- Dockerized backend runtime for cloud deployment workflows

## Engineering Decisions and Highlights
- Idempotent-style synthesis pass: The researcher script identifies already updated records and only processes pending originals.
- Defensive scraping and research controls: Navigation timeouts, selective parsing, and skip-on-failure behavior make long-running automation more reliable.
- Clean API contract: Backend validation ensures required fields and URL uniqueness, preventing duplicate article insertions.
- Human-in-the-loop review UX: Side-by-side comparison mode enables fast qualitative verification of rewrite quality.
- Practical deployment posture: Frontend and backend are separated cleanly and can be deployed independently.

## My Contributions (Internship Framing)
- Designed and implemented a multi-stage automation pipeline spanning scraping, enrichment, persistence, and visualization.
- Built REST integrations between Node scripts and Laravel API endpoints.
- Implemented content extraction and LLM prompt-to-output flow for article enhancement.
- Developed frontend pairing and comparison experience to inspect AI output against source content.
- Structured the project for real-world deployability and reproducible local setup.

## Challenges and Learnings
- Web data extraction is noisy and site-dependent: robust selectors, timing strategy, and fallback behavior are critical.
- LLM output quality depends heavily on prompt clarity and context quality.
- End-to-end systems require disciplined interface contracts across scripts, APIs, and UI.
- Reliability and observability matter as much as model quality in automation pipelines.

## Measurable/Portfolio Outcomes
- Demonstrates full-stack ownership across backend, frontend, automation, and AI integration.
- Shows practical understanding of data pipelines and content lifecycle workflows.
- Produces a clear, demo-friendly artifact: original vs enhanced article comparison.

## Why This Project Is Internship-Ready
This project shows that I can move beyond isolated coding tasks and deliver an integrated product workflow. It combines software engineering fundamentals (API design, validation, persistence, UI) with modern applied AI usage (context collection, prompt-driven generation, output evaluation), which aligns well with internship roles in full-stack development, AI-assisted products, and automation engineering.
