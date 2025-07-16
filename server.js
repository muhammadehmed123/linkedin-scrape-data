  
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
// require('./services/apifySchedulerService');
// Connect to database
connectDB();

const PORT = 3001;

app.listen(PORT, () => {
  // ... existing code (require, app.use, etc.) ...

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}\n`);

  // Apify Controller Endpoints
  console.log('========= Apify Controller Endpoints =========');
  console.log('[GET]    /api/apify              => Fetch jobs from Apify and save as raw JSON (fetchAndSaveJobs)');
  console.log('[GET]    /api/apify/score        => Run AIML processing and return result (scoreJobs)');
  console.log('[GET]    /api/apify/scored       => Get scored jobs as JSON (getScoredJobs)');
  console.log('[GET]    /api/apify/filtered     => Return filtered jobs with only selected fields (getFilteredJobs)');
  console.log('[POST]   /api/save-jobs          => Save scored jobs from file to DB for authenticated user (uploadScoredJobsFromFile, auth required)');
  console.log('[GET]    /api/jobs-by-date       => Get jobs for user by date or date range (getJobsByDate, auth required)');
  console.log('=============================================\n');
});
});

