const express = require('express');
const router = express.Router();
const upworkController = require('../controllers/upworkController');

// POST /api/upwork/fetch
router.post('/upwork/fetch', upworkController.fetchAndSaveJobs);

module.exports = router;