const axios = require('axios');
const fs = require('fs');
const path = require('path');

const defaultInput = {
    age: 24,
    category: [
        "qa-testing",
        "ai-machine-learning",
        "web-development",
        "mobile-development",
        "other-software-development",
        "desktop-application-development",
        "ecommerce-development",
        "web-mobile-software-dev"
    ],
    contract_to_hire: false,
    dev_dataset_clear: true,
    dev_no_strip: false,
    fixed: false,
    hourly: true,
    "includes.attachments": false,
    "includes.history": false,
    limit: 100,
    location: [
        "United States",
        "United Kingdom",
        "Saudia Arabia",
        "United Arab Emirates",
        "Europe"
    ],
    no_hires: false,
    payment_verified: false,
    previous_clients: false,
    sort: "newest",
    tier: ["2", "3", "1"]
};

exports.fetchUpworkJobs = async (input = defaultInput) => {
    const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
    const url = `https://api.apify.com/v2/acts/jupri~upwork/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

    try {
        // POST input to Apify API
        const response = await axios.post(url, input, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // The response data is the array of items
        const items = response.data;

        // Save to file
        const filePath = path.join(__dirname, '../data/upwork_jobs_raw.json');
        fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');

        return { items, count: items.length };
    } catch (error) {
        console.error('Error fetching or saving jobs:', error.message);
        throw error;
    }
};