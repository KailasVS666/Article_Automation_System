require('dotenv').config();
const axios = require('axios');

async function listModels() {
    console.log("🔍 Testing Gemini API directly with REST...");
    const apiKey = process.env.GEMINI_API_KEY;

    // Test API key first
    try {
        console.log("\n1️⃣ Testing API Key...");
        const testUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
        const response = await axios.get(testUrl);
        
        console.log(`✅ API Key is valid! Found ${response.data.models?.length || 0} models.\n`);
        console.log("📋 Available Models:");
        console.log("--------------------------------------------------");
        
        if (response.data.models) {
            response.data.models.forEach((model) => {
                console.log(`✅ ${model.name}`);
                console.log(`   Display: ${model.displayName}`);
                console.log(`   Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
                console.log("--------------------------------------------------");
            });
        }

        console.log("\n💡 TIP: Copy the model name (e.g., models/gemini-1.5-flash) to use in researcher.js");
        
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
        if (error.response?.status === 403 || error.response?.status === 401) {
            console.log("\n🔑 Your API key might be invalid or doesn't have access.");
            console.log("👉 Get a new key from: https://aistudio.google.com/app/apikey");
        }
    }
}

listModels();