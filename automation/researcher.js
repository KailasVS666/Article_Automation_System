require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');
const { JSDOM, VirtualConsole } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const { GoogleGenAI } = require('@google/genai');

puppeteer.use(StealthPlugin());

// Silence JSDOM CSS warnings
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {}); 

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
    
    // Set a global 30-second limit for all navigation and wait actions
    // This prevents the script from getting "stuck" on a single site
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);

    try {
        const { data: articles } = await axios.get('http://127.0.0.1:8000/api/articles');
        console.log(`📡 Connected. Processing ${articles.length} articles.`);

        for (const article of articles) {
            console.log(`\n🔎 Researching: "${article.title}"`);

            try {
                // Navigate to Google
                await page.goto(`https://www.google.com/search?q=${encodeURIComponent(article.title)}&hl=en`, {
                    waitUntil: 'networkidle2' // Better for 2025 dynamic pages
                });
                
                // Wait for search results with a more specific selector
                await page.waitForSelector('h3', { timeout: 15000 });
                console.log("✅ Results found!");

                const competitorLinks = await page.evaluate(() => {
                    const results = [];
                    const anchors = Array.from(document.querySelectorAll('a h3')).map(h3 => h3.closest('a')?.href);
                    // Filter out non-article domains that often block scrapers
                    const skip = ['google.com', 'beyondchats.com', 'amazon.com', 'pinterest.com', 'facebook.com', 'linkedin.com', 'twitter.com', 'youtube.com'];
                    
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
                        console.log(`📡 Extracting: ${link}...`);
                        // Set a shorter timeout for individual competitor pages
                        await page.goto(link, { waitUntil: 'networkidle2', timeout: 20000 });
                        const html = await page.content();
                        
                        const doc = new JSDOM(html, { url: link, virtualConsole });
                        const content = new Readability(doc.window.document).parse();
                        
                        if (content && content.textContent) {
                            researchContext += `\n\n--- SOURCE: ${link} ---\n${content.textContent.substring(0, 3000)}`;
                        }
                    } catch (e) { 
                        console.log(`⚠️ Skip scraping (Slow or Protected): ${link}`); 
                    }
                }

                if (researchContext.length > 100) {
                    console.log("🤖 Gemini is synthesizing research...");
                    
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: `
                            TASK: Professional Rewrite
                            Rewrite the original article using the provided research to match top-ranking depth and formatting.
                            ORIGINAL CONTENT: ${article.content}
                            RESEARCH CONTENT: ${researchContext}
                            REQUIREMENTS: 
                            1. Use professional Markdown with H1, H2, and H3 headers.
                            2. Add detailed insights from the research.
                            3. CITE these links at the very bottom under 'References': ${competitorLinks.join(', ')}.
                        `
                    });

                    const rewrittenText = response.text;

                    await axios.post('http://127.0.0.1:8000/api/articles', {
                        title: `[Updated] ${article.title}`,
                        content: rewrittenText,
                        url: `${article.url}?update=${Date.now()}` 
                    });
                    console.log("✨ Success: Enhanced version saved to DB.");
                } else {
                    console.log("⚠️ Not enough research found to rewrite this article.");
                }

            } catch (innerErr) {
                console.log(`❌ Error processing "${article.title}": ${innerErr.message}`);
                continue; // Move to the next article instead of stopping the whole script
            }

            // Anti-detection delay between articles
            await new Promise(r => setTimeout(r, 5000)); 
        }
    } catch (err) {
        console.error("❌ Fatal Error:", err.message);
    } finally {
        await browser.close();
        console.log("\n🏁 Phase 2 Complete.");
    }
})();