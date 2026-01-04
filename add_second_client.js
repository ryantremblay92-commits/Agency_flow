import http from 'http';

// Create a test client
function createClient() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            name: "Finance Client",
            industry: "Finance",
            businessType: "B2C",
            status: "Active",
            primaryObjective: "brand-awareness",
            monthlyBudget: 3000
        });

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/clients',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(body));
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

// Create a test campaign
function createCampaign(clientId) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            name: "Finance Campaign",
            clientId: clientId,
            platform: "Google",
            status: "Active",
            budget: 800
        });

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/campaigns',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(body));
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

// Run the functions in sequence
async function main() {
    try {
        console.log("Creating finance client...");
        const client = await createClient();
        console.log("Client created:", client);

        console.log("Creating finance campaign...");
        const campaign = await createCampaign(client.id);
        console.log("Campaign created:", campaign);

        console.log("Test data created successfully!");
    } catch (error) {
        console.error("Error creating test data:", error);
    }
}

main();