  
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

// Connect to database
connectDB();

const PORT = 3001;

app.listen(PORT, () => {
  console.log('\n================= API Endpoints =================');
console.log(`🚀 Server running on:         http://localhost:${PORT}`);
console.log('-------------------------------------------------');
console.log(`🔑 Register:                 POST   /api/signup`);
console.log(`🔑 Login:                    POST   /api/login`);
console.log('-------------------------------------------------');
console.log(`📡 Fetch & Save Jobs:        GET    /api/fetch-and-save`);
console.log(`   (with params)             GET    /api/fetch-and-save?limit=10&location_filter="India"&advanced_title_filter="UI/UX"`);
console.log(`📥 Export Last Batch as CSV: GET    /api/export-csv`);
console.log('-------------------------------------------------');
console.log(`📁 Raw API data saved at:    /backend/data/last_api_response.json`);
console.log('=================================================\n');
});

// import { ApifyClient } from 'apify-client';

// // import { ApifyClient } from 'apify-client';

// // Initialize the ApifyClient with your Apify API token
// // Replace the '<YOUR_API_TOKEN>' with your token
// const client = new ApifyClient({
//     // token: 'apify_api_U9oFD8TQcm2gTug0KVYjb7jr51WS8F2ENbZ0',
// });

// // Prepare Actor input
// const input = 
// {
//     "easyApply": false,
//     "employmentType": [
//         "full-time",
//         "part-time"
//     ],
//     "experienceLevel": [
//         "executive",
//         "director",
//         "mid-senior",
//         "associate"
//     ],
//     "jobTitles": [
//         "Test Automation",
//         "Web Development",
//         "AI/ML",
//         "UI/UX"
//     ],
//     "locations": [
//         "Saudi Arabia",
//         "United Arab Emirates"
//     ],
//     "maxItems": 50,
//     "postedLimit": "24h",
//     "sortBy": "date",
//     "under10Applicants": false,
//     "workplaceType": [
//         "remote"
//     ]
// }
// // {
// //     "jobTitles": [
// //         "software engineer",

// //     ],
// //     "locations": [
// //         "New York",
// //         "California"
// //     ],
// //     "maxItems": 10,
// //     "sortBy": "date",
// //     "postedLimit": "24h",
// //     "remote": true,
// // };

// // Run the Actor and wait for it to finish
// const run = await client.actor("harvestapi/linkedin-job-search").call(input);

// // Fetch and print Actor results from the run's dataset (if any)
// console.log('Results from dataset');
// console.log(`💾 Check your data here: https://console.apify.com/storage/datasets/${run.defaultDatasetId}`);
// const { items } = await client.dataset(run.defaultDatasetId).listItems();
// items.forEach((item) => {
//     console.dir(item);
// });

// 📚 Want to learn more 📖? Go to → https://docs.apify.com/api/client/js/docs

// const params = new URLSearchParams({
//   search: 'Software Engineer',
//   companyId: '1441', // Google
//   location: 'US',
//   sortBy: 'date',
//   workplaceType: 'remote',
//   employmentType: 'full-time',
//   postedLimit: 'month',
//   page: '1',
// });
// fetch(`https://api.harvest-api.com/linkedin/job-search?${params.toString()}`, {
//   headers: { 'X-API-Key': '6W5eScwxlThSCIC6ZTYHdt8C2wIpPYim' },
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data));