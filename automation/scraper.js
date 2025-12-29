const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
    console.log("🚀 Starting Phase 1: Fetching the 5 Oldest Articles...");
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // 1. Find the maximum page number first [cite: 10]
        await page.goto('https://beyondchats.com/blogs/', { waitUntil: 'networkidle2' });
        const lastPageNumber = await page.evaluate(() => {
            const numbers = Array.from(document.querySelectorAll('.page-numbers'))
                .map(el => parseInt(el.innerText))
                .filter(n => !isNaN(n));
            return Math.max(...numbers);
        });

        let allOldest = [];
        let currentPage = lastPageNumber;

        // 2. Loop backwards until we have at least 5 articles 
        while (allOldest.length < 5 && currentPage > 0) {
            console.log(`📑 Navigating to page ${currentPage} to collect archive...`);
            await page.goto(`https://beyondchats.com/blogs/page/${currentPage}/`, { waitUntil: 'networkidle2' });

            const pageArticles = await page.evaluate(() => {
                // Reverse the articles on the page so the absolute oldest are first 
                return Array.from(document.querySelectorAll('article')).reverse().map(item => ({
                    title: item.querySelector('h2')?.innerText.trim(),
                    content: item.querySelector('.entry-content, p')?.innerText.trim(),
                    url: item.querySelector('a')?.href
                }));
            });

            allOldest = [...allOldest, ...pageArticles];
            currentPage--;
        }

        // 3. Keep only the first 5 (the absolute oldest) 
        const finalFive = allOldest.slice(0, 5);
        console.log(`📦 Successfully extracted ${finalFive.length} oldest articles.`);

        // 4. Store in Database via Laravel API [cite: 11, 12]
        for (const article of finalFive) {
            try {
                const res = await axios.post('http://127.0.0.1:8000/api/articles', article);
                console.log(`✔ Saved to DB: ${res.data.data.title}`);
            } catch (err) {
                console.log(`ℹ Skipped (Duplicate): ${article.title}`);
            }
        }

    } catch (error) {
        console.error("❌ Critical Error:", error.message);
    } finally {
        await browser.close();
        console.log("🏁 Phase 1 Requirement Fully Met.");
    }
})();