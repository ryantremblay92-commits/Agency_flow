// Manual Gemini API Test
const GEMINI_API_KEY = "AIzaSyCZZ3GJQ3oRSBxAmQVj6rFB46yQWrt6BOE";

// Test endpoints
const testEndpoints = [
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
];

const testPrompt = "Create a simple marketing strategy for a tech company with a $5000 monthly budget.";

async function testGeminiAPI() {
    console.log("🧪 Testing Gemini API Communication...\n");

    for (let i = 0; i < testEndpoints.length; i++) {
        const endpoint = testEndpoints[i];
        console.log(`🔍 Testing Endpoint ${i + 1}/${testEndpoints.length}:`);
        console.log(`   ${endpoint}`);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY,
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: testPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                })
            });

            console.log(`   📡 Status: ${response.status} ${response.statusText}`);

            if (response.ok) {
                const data = await response.json();
                const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (result) {
                    console.log(`   ✅ SUCCESS! Response received:`);
                    console.log(`   📝 Result: ${result.substring(0, 100)}...`);
                    return { success: true, endpoint, result };
                } else {
                    console.log(`   ⚠️  No content in response`);
                }
            } else {
                const errorText = await response.text();
                console.log(`   ❌ FAILED: ${errorText}`);
            }
        } catch (error) {
            console.log(`   💥 ERROR: ${error.message}`);
        }

        console.log(""); // Empty line for readability
    }

    console.log("❌ All endpoints failed");
    return { success: false };
}

// Run the test
testGeminiAPI().then(result => {
    if (result.success) {
        console.log("\n🎉 GEMINI API IS WORKING!");
        console.log(`✅ Successful endpoint: ${result.endpoint}`);
    } else {
        console.log("\n💔 GEMINI API NOT WORKING");
        console.log("🔧 Need to fix API integration");
    }
});