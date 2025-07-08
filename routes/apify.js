import express from 'express';
import { fetchJobsFromApify } from '../config/apifyService.js';
import Job from '../models/Job.js';

const router = express.Router();

router.get('/fetch-and-save1', async (req, res) => {
  try {
    // You can build input from req.query or use defaults
    const input = {
      easyApply: false,
      employmentType: ["full-time", "part-time"],
      experienceLevel: ["executive", "director", "mid-senior", "associate"],
      jobTitles: ["Test Automation", "Web Development", "AI/ML", "UI/UX"],
      locations: ["Saudi Arabia", "United Arab Emirates"],
      maxItems: 50,
      postedLimit: "24h",
      sortBy: "date",
      under10Applicants: false,
      workplaceType: ["remote"]
    };

    const jobs = await fetchJobsFromApify(input);

    // Save jobs to MongoDB (skip duplicates by unique index on id)
    const result = await Job.insertMany(jobs, { ordered: false }).catch(e => {
      // Ignore duplicate key errors
      if (e.code !== 11000) throw e;
    });

    res.json({ message: 'Jobs fetched and saved', count: jobs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;