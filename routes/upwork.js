const express = require('express');
const router = express.Router();
const upworkController = require('../controllers/upworkController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/upwork/fetch
router.post('/upwork/fetch', upworkController.fetchAndSaveJobs);

// GET /api/upwork/filter
router.get('/upwork/filter', upworkController.filterUpworkJobs);

router.get('/upwork/score', upworkController.scoreUpworkJobs);

router.get('/upwork/final-score', upworkController.getUpworkFinalScores);


// Save jobs (bulk insert/upsert)
// router.post('/upwork/jobs', authMiddleware,upworkController.saveUpworkJobs);

// Get jobs by date (query param: ?date=YYYY-MM-DD)
// router.get('/upwork/jobs/by-date',authMiddleware, upworkController.getJobsByDate);

// Edit job by jobId
// router.put('/upwork/jobs/:jobId',authMiddleware, upworkController.editJobByJobId);

module.exports = router;
