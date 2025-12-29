require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');
const { JSDOM, VirtualConsole } = require('jsdom'); // Added VirtualConsole
const { Readability } = require('@mozilla/readability');
const { GoogleGenAI } = require('@google/genai');

puppeteer.use(StealthPlugin());

// Silence JSDOM CSS warnings
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {}); // No-op to ignore parse errors

// Initialize the 2025 Unified SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

(async () => {
    console.log("🚀 Starting Phase 2: Professional Research & AI Rewrite...");
    
    const browser = await puppeteer.launch({ 
        headless: false,
        userDataDir: './automation_profile', 
        args: ['--start-maximized', '--no-sandbox', '--disable-blink-features=AutomationControlled']
    });

    const page = await browser.newPage();
    
    try {
        const { data: articles } = await axios.get('http://127.0.0.1:8000/api/articles');
        console.log(`📡 Connected. Processing ${articles.length} articles.`);

        for (const article of articles) {
            console.log(`\n🔎 Researching: "${article.title}"`);

            await page.goto(`https://www.google.com/search?q=${encodeURIComponent(article.title)}&hl=en`, {
                waitUntil: 'networkidle2'
            });
            
            try {
                await page.waitForSelector('h3', { timeout: 120000 }); 
                console.log("✅ Results found!");
            } catch (e) {
                console.log("❌ Timeout: Skipping this article.");
                continue; 
            }

            const competitorLinks = await page.evaluate(() => {
                const results = [];
                const anchors = Array.from(document.querySelectorAll('a h3')).map(h3 => h3.closest('a')?.href);
                // Added a filter to skip common social/shop links that block scraping
                const skip = ['google.com', 'beyondchats.com', 'amazon.com', 'pinterest.com', 'facebook.com'];
                for (const href of anchors) {
                    if (href && href.startsWith('http') && !skip.some(s => href.includes(s))) {
                        results.push(href);
                    }
                    if (results.length === 2) break;
                }
                return results;
            });

            console.log(`✅ Competitors found: ${competitorLinks.length}`);

            let researchContext = "";
            for (const link of competitorLinks) {
                try {
                    await page.goto(link, { waitUntil: 'networkidle2', timeout: 15000 });
                    const html = await page.content();
                    
                    // Use VirtualConsole to hide CSS parse errors
                    const doc = new JSDOM(html, { url: link, virtualConsole });
                    const content = new Readability(doc.window.document).parse();
                    researchContext += `\n\n--- SOURCE: ${link} ---\n${content.textContent.substring(0, 3000)}`;
                } catch (e) { console.log(`⚠️ Skip scraping: ${link}`); }
            }

            if (researchContext.length > 100) {
                console.log("🤖 Gemini is synthesizing research...");
                
                // Unified SDK Syntax: use ai.models.generateContent
                // Using gemini-2.5-flash which is the standard for 2025
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `
                        TASK: Professional Rewrite
                        Rewrite the original article using the provided research to match top-ranking depth and formatting.
                        ORIGINAL CONTENT: ${article.content}
                        RESEARCH CONTENT: ${researchContext}
                        REQUIREMENTS: 
                        1. Use high-quality Markdown.
                        2. CITE these links at the very bottom under 'References': ${competitorLinks.join(', ')}.
                    `
                });

                // Direct access to text in the new SDK
                const rewrittenText = response.text;

                await axios.post('http://127.0.0.1:8000/api/articles', {
                    title: `[Updated] ${article.title}`,
                    content: rewrittenText,
                    url: `${article.url}?update=${Date.now()}` 
                });
                console.log("✨ Success: Enhanced version saved to DB.");
            }

            await new Promise(r => setTimeout(r, 10000)); 
        }
    } catch (err) {
        console.error("❌ Fatal Error:", err.message);
    } finally {
        await browser.close();
        console.log("\n🏁 Phase 2 Complete.");
    }
})();