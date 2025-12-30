require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');
const { JSDOM, VirtualConsole } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const { GoogleGenerativeAI } = require('@google/generative-ai');

puppeteer.use(StealthPlugin());
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {}); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
    console.log("🚀 FINAL ATTEMPT: Reusing profile & filling gaps with 60s timeouts...");
    const browser = await puppeteer.launch({ 
        headless: false,
        userDataDir: './automation_profile', 
        args: ['--start-maximized', '--no-sandbox', '--disable-blink-features=AutomationControlled']
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);

    try {
        const { data: allArticles } = await axios.get(`${process.env.BACKEND_API_URL}/articles`);
        const updatedTitles = allArticles
            .filter(a => a.title.startsWith('[Updated]'))
            .map(a => a.title.replace('[Updated] ', ''));

        const pendingArticles = allArticles.filter(a => 
            !a.title.startsWith('[Updated]') && !updatedTitles.includes(a.title)
        );

        console.log(`📡 Found ${pendingArticles.length} articles requiring synthesis.`);

        for (const article of pendingArticles) {
            console.log(`\n🔎 Researching: "${article.title}"`);
            
            try {
                await page.goto(`https://www.google.com/search?q=${encodeURIComponent(article.title)}&hl=en`, {
                    waitUntil: 'domcontentloaded'
                });
                
                await page.waitForSelector('h3', { timeout: 30000 });
                const links = await page.evaluate(() => 
                    Array.from(document.querySelectorAll('a h3'))
                    .map(h3 => h3.closest('a')?.href)
                    .filter(href => href && !href.includes('google.com')).slice(0, 2)
                );

                let context = "";
                for (const link of links) {
                    try {
                        console.log(`📡 Extracting: ${link}`);
                        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 45000 });
                        const html = await page.content();
                        const doc = new JSDOM(html, { url: link, virtualConsole });
                        const parsed = new Readability(doc.window.document).parse();
                        if (parsed?.textContent) context += `\nSource ${link}: ${parsed.textContent.substring(0, 3000)}`;
                    } catch (e) { console.log(`⚠️ Skip: ${link} due to slow load.`); }
                }

                if (context.length > 100) {
                    console.log("🤖 Synthesizing with Gemini 2.5 Flash...");
                    await new Promise(r => setTimeout(r, 15000));

                    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
                    const prompt = `Rewrite into professional guide: ${article.title}. Original: ${article.content}. Research: ${context}. Use Markdown & Cite: ${links.join(', ')}.`;
                    
                    const result = await model.generateContent(prompt);
                    
                    await axios.post(`${process.env.BACKEND_API_URL}/articles`, {
                        title: `[Updated] ${article.title}`,
                        content: result.response.text(),
                        url: `${article.url}?updated=true`
                    });
                    console.log("✨ Success! Saved to DB.");
                }
            } catch (err) {
                console.error(`⚠️ Error processing "${article.title}": ${err.message}`);
            }
            await new Promise(r => setTimeout(r, 5000));
        }
    } catch (err) { console.error("❌ Fatal System Error:", err.message); }
    finally { 
        await browser.close(); 
        console.log("\n🏁 Done. Check your DB for 10 rows.");
    }
})();