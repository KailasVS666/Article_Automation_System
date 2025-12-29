const puppeteer = require('puppeteer');
const axios = require('axios');

async function scrapeBeyondChats() {
    console.log("🚀 Starting Phase 1: Scraping BeyondChats Blogs...");
    const browser = await puppeteer.launch({ headless: false }); // Set to true to run in background
    const page = await browser.newPage();

    try {
        // 1. Navigate to the blogs section [cite: 10]
        await page.goto('https://beyondchats.com/blogs/', { waitUntil: 'networkidle2' });

        // Note: To fetch the 5 OLDEST, the script usually needs to find the last page.
        // For this initial test, we will grab the first 5 visible articles.
        const articles = await page.evaluate(() => {
            const results = [];
            const items = document.querySelectorAll('article'); // Adjust selector based on site inspection
            
            items.forEach((item, index) => {
                if (index < 5) {
                    results.push({
                        title: item.querySelector('h2')?.innerText || "No Title",
                        content: item.querySelector('.entry-content')?.innerText || "No Content",
                        url: item.querySelector('a')?.href || ""
                    });
                }
            });
            return results;
        });

        console.log(`✅ Found ${articles.length} articles. Sending to database...`);

        // 2. Loop through and send to your Laravel API [cite: 12, 15]
        for (const article of articles) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/articles', article);
                console.log(`✔ Saved: ${article.title}`);
            } catch (err) {
                console.log(`❌ Failed to save "${article.title}":`, err.response?.data?.message || err.message);
            }
        }

    } catch (error) {
        console.error("Critical Error during scraping:", error);
    } finally {
        await browser.close();
        console.log("🤖 Scraper task finished.");
    }
}

scrapeBeyondChats();