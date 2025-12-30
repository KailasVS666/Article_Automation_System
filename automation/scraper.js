require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');

puppeteer.use(StealthPlugin());

(async () => {
    console.log("🚀 Starting Phase 1: Capturing the 5 ABSOLUTE oldest articles...");
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // 1. Find the true last page
        await page.goto('https://beyondchats.com/blogs/', { waitUntil: 'networkidle2' });
        const lastPage = await page.evaluate(() => {
            const pages = Array.from(document.querySelectorAll('.page-numbers'));
            const numbers = pages.map(p => parseInt(p.innerText)).filter(n => !isNaN(n));
            return Math.max(...numbers);
        });

        let articleLinks = [];
        let currentPage = lastPage;

        // 2. Gather links from the end moving backwards
        while (articleLinks.length < 5 && currentPage > 0) {
            await page.goto(`https://beyondchats.com/blogs/page/${currentPage}/`, { waitUntil: 'networkidle2' });
            
            const pageArticles = await page.evaluate(() => {
                const items = Array.from(document.querySelectorAll('article, .elementor-post'));
                return items.map(item => ({
                    title: item.querySelector('h1, h2, h3, .elementor-post__title')?.innerText.trim(),
                    url: item.querySelector('a')?.href
                })).filter(a => a.title && a.url);
            });

            // We reverse because the oldest on the page are at the bottom
            articleLinks = [...articleLinks, ...pageArticles.reverse()];
            currentPage--;
        }

        // 3. Take exactly the first 5 we found (the 5 absolute oldest)
        const theOldestFive = articleLinks.slice(0, 5);

        for (const article of theOldestFive) {
            console.log(`📡 Extracting Full Content: ${article.title}`);
            await page.goto(article.url, { waitUntil: 'networkidle2' });

            const bodyContent = await page.evaluate(() => {
                const container = document.querySelector('.elementor-widget-theme-post-content, .entry-content');
                return container ? container.innerText.trim() : "Content not found.";
            });

            await axios.post(`${process.env.BACKEND_API_URL}/articles`, {
                title: article.title,
                content: bodyContent,
                url: article.url
            });
        }

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await browser.close();
        console.log("\n🏁 Phase 1 Complete: Absolute 5 oldest stored.");
    }
})();