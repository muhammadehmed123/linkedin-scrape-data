// routes/pipelineRoutes.js

const express = require('express');
const router = express.Router();
const { runFullPipeline } = require('../controllers/pipelineController');

// No auth middleware for now
router.post('/run-pipeline', runFullPipeline);

module.exports = router;