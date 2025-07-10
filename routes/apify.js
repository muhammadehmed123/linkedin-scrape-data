
const express = require('express');
const router = express.Router();
const apifyController = require('../controllers/apifyController');
const authMiddleware = require('../middleware/authMiddleware');


// Fetch jobs from Apify and save as raw JSON
router.get('/apify', apifyController.fetchAndSaveJobs);

// Return processed jobs as JSON
// router.get('/apify/processed', apifyController.getProcessedJobs);

// Run AIML processing and return result
// Run scoring (process raw JSON and output scored JSON/CSV)
router.get('/apify/score', apifyController.scoreJobs);

// Get scored jobs as JSON
router.get('/apify/scored', apifyController.getScoredJobs);

// Return filtered jobs with only selected fields
router.get('/apify/filtered', apifyController.getFilteredJobs);


router.post('/save-jobs', authMiddleware, apifyController.uploadScoredJobsFromFile);

router.get('/jobs-by-date', authMiddleware, apifyController.getJobsByDate);

module.exports = router;

module.exports = router;
