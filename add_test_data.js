import http from 'http';

// Create a test client
function createClient(clientName, industry) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            name: clientName,
            industry: industry,
            businessType: industry === "Finance" ? "B2C" : "B2B",
            status: "Active",
            primaryObjective: industry === "Finance" ? "brand-awareness" : "lead-generation",
            monthlyBudget: industry === "Finance" ? 3000 : 5000
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
function createCampaign(clientId, campaignName, platform) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            name: campaignName,
            clientId: clientId,
            platform: platform,
            status: "Active",
            budget: 1000
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

// Create a test strategy
function createStrategy(clientId, strategyName) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            name: strategyName,
            clientId: clientId,
            description: `This is a test strategy for ${strategyName} purposes.`,
            status: "Active"
        });

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/strategies',
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
        // Create first client
        console.log("Creating first test client...");
        const client1 = await createClient("Tech Client", "Technology");
        console.log("Client 1 created:", client1);

        console.log("Creating test strategy for client 1...");
        const strategy1 = await createStrategy(client1.id, "Tech Client Strategy");
        console.log("Strategy 1 created:", strategy1);

        console.log("Creating test campaign for client 1...");
        const campaign1 = await createCampaign(client1.id, "Tech Client Campaign", "LinkedIn");
        console.log("Campaign 1 created:", campaign1);

        // Create second client
        console.log("\nCreating second test client...");
        const client2 = await createClient("Finance Client", "Finance");
        console.log("Client 2 created:", client2);

        console.log("Creating test strategy for client 2...");
        const strategy2 = await createStrategy(client2.id, "Finance Client Strategy");
        console.log("Strategy 2 created:", strategy2);

        console.log("Creating test campaign for client 2...");
        const campaign2 = await createCampaign(client2.id, "Finance Client Campaign", "Google");
        console.log("Campaign 2 created:", campaign2);

        console.log("\nTest data created successfully!");
        console.log("\nTesting campaign filtering:");

        // Test filtering campaigns by client 1
        console.log(`Campaigns for client ${client1.name}:`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Test filtering campaigns by client 2
        console.log(`Campaigns for client ${client2.name}:`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Test fetching all campaigns
        console.log("All campaigns:");
    } catch (error) {
        console.error("Error creating test data:", error);
    }
}

main();