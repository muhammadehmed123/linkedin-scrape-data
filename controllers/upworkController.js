
// const { fetchUpworkJobs } = require('../services/upworkService');
const { fetchUpworkJobs, filterAndDeduplicateUpworkJobs } = require('../services/upworkService');

const UpworkJob = require('../models/upworkJobSchema');

// Save jobs (bulk insert or upsert)
exports.saveUpworkJobs = async (req, res) => {
  try {
    const jobs = req.body;
    if (!Array.isArray(jobs)) {
      return res.status(400).json({ message: 'Input should be an array of jobs' });
    }
    // Upsert each job by jobId
    const bulkOps = jobs.map(job => ({
      updateOne: {
        filter: { jobId: job.jobId },
        update: { $set: job },
        upsert: true
      }
    }));
    await UpworkJob.bulkWrite(bulkOps);
    res.json({ message: 'Jobs saved/updated successfully', count: jobs.length });
  } catch (error) {
    res.status(500).json({ message: 'Error saving jobs', error: error.message });
  }
};

// Get jobs by date (ts_create)
exports.getJobsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date query param required (YYYY-MM-DD)' });
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const jobs = await UpworkJob.find({
      ts_create: { $gte: start, $lt: end }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs by date', error: error.message });
  }
};

// Edit job by jobId
exports.editJobByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    const update = req.body;
    const job = await UpworkJob.findOneAndUpdate({ jobId }, update, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error editing job', error: error.message });
  }
};


exports.fetchAndSaveJobs = async (req, res) => {
    try {
        const input = req.body; // Accepts JSON input from POST
        const { items, count } = await fetchUpworkJobs(input);
        res.json({
            message: 'Upwork jobs fetched and saved to JSON file',
            count,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching or saving jobs', error: error.message });
    }
};



// ... existing exports ...

exports.filterUpworkJobs = (req, res) => {
  try {
    const result = filterAndDeduplicateUpworkJobs();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering jobs', error: error.message });
  }
};


const { exec } = require('child_process');
const path = require('path');

exports.scoreUpworkJobs = (req, res) => {
    const inputPath = path.join(__dirname, '../data/filtered_upwork.json');
    const outputPath = path.join(__dirname, '../data/final_jobs_upwork.json');
    const scriptPath = path.join(__dirname, '../python/upwork.py');

    exec(`python "${scriptPath}" "${inputPath}" "${outputPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running upwork.py:', error, stderr);
            return res.status(500).json({ message: 'Error scoring jobs', error: stderr || error.message });
        }
        res.json({
            message: 'Upwork jobs scored successfully',
            output: outputPath,
            python_stdout: stdout
        });
    });
};

const fs = require('fs');

exports.getUpworkFinalScores = (req, res) => {
    const outputPath = path.join(__dirname, '../data/final_jobs_upwork.json');
    try {
        if (!fs.existsSync(outputPath)) {
            return res.status(404).json({ message: 'Upwork score file not found. Please run the scoring process first.' });
        }
        const data = fs.readFileSync(outputPath, 'utf-8');
        const jobs = JSON.parse(data);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error reading upwork score file', error: error.message });
    }
};