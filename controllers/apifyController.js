const path = require('path');
const fs = require('fs');
const { fetchJobsFromApify } = require('../config/apifyService');
const { runAimlProcessing } = require('../services/aimlProcessService');

// Fetch jobs from Apify and save as raw JSON
exports.fetchAndSaveJobs = async (req, res) => {
  try {
    const input = {
      easyApply: false,
      employmentType: ["full-time", "part-time"],
      experienceLevel: ["executive", "director", "mid-senior", "associate"],
      jobTitles: ["Test Automation", "QA" , "SQA","Web Development", "AI/ML", "UI/UX"],
      locations: ["Saudi Arabia", "United Arab Emirates","United States","United Kingdom"],
      maxItems: 5,
      postedLimit: "24h",
      sortBy: "date",
      under10Applicants: false,
      workplaceType: ["remote"]
    };
    const jobs = await fetchJobsFromApify(input);
    const filePath = path.join(__dirname, '../data/apify_jobs_raw.json');
    fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2), 'utf-8');
    res.json({ message: 'Jobs fetched and saved to JSON file', count: jobs.length });
  } catch (error) {
    console.error('Error fetching or saving jobs:', error);
    res.status(500).json({ message: 'Error fetching or saving jobs', error: error.message });
  }
};

// Return processed jobs as JSON
exports.getProcessedJobs = (req, res) => {
  try {
    const processedPath = path.join(__dirname, '../data/apify_jobs_processed.json');
    const jobs = JSON.parse(fs.readFileSync(processedPath, 'utf-8'));
    res.json(jobs);
  } catch (error) {
    console.error('Error reading processed jobs:', error);
    res.status(500).json({ message: 'Error reading processed jobs', error: error.message });
  }
};

// Run AIML processing and return result
exports.scoreJobs = async (req, res) => {
  try {
    const result = await runAimlProcessing();
    res.json({ message: result });
  } catch (error) {
    console.error('Scoring process failed:', error);
    res.status(500).json({ message: 'Scoring process failed', error: error.message });
  }
};


  // Serve scored jobs output as JSON
  exports.getScoredJobs = (req, res) => {
    try {
      const scoredPath = path.join(__dirname, '../data/scored_jobs_output.json');
      const jobs = JSON.parse(fs.readFileSync(scoredPath, 'utf-8'));
      res.json(jobs);
    } catch (error) {
      console.error('Error reading scored jobs:', error);
      res.status(500).json({ message: 'Error reading scored jobs', error: error.message });
    }
  };

// Filter and return only selected fields from raw Apify jobs
toSafe = (obj, path, fallback = null) => {
  try {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : fallback), obj);
  } catch {
    return fallback;
  }
};

exports.getFilteredJobs = (req, res) => {
  try {
    const rawPath = path.join(__dirname, '../data/apify_jobs_raw.json');
    const jobs = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));
    const filtered = jobs.map(job => ({
      id: job.id,
      title: job.title,
      linkedinUrl: job.linkedinUrl,
      postedDate: job.postedDate,
      expireAt: job.expireAt,
      descriptionText: job.descriptionText,
      employmentType: job.employmentType,
      workplaceType: job.workplaceType,
      easyApplyUrl: job.easyApplyUrl,
      applicants: job.applicants,
      views: job.views,
      jobApplicationLimitReached: job.jobApplicationLimitReached,
      applyMethod: toSafe(job, 'applyMethod.companyApplyUrl'),
      salary: toSafe(job, 'salary.text'),
      company: {
        linkedinUrl: toSafe(job, 'company.linkedinUrl'),
        logo: toSafe(job, 'company.logo'),
        website: toSafe(job, 'company.website'),
        name: toSafe(job, 'company.name'),
        employeeCount: toSafe(job, 'company.employeeCount'),
        followerCount: toSafe(job, 'company.followerCount'),
        description: toSafe(job, 'company.description'),
        specialities: toSafe(job, 'company.specialities', []),
        industries: toSafe(job, 'company.industries', []),
        locations: (toSafe(job, 'company.locations', []) || []).map(loc => ({
          city: toSafe(loc, 'parsed.city'),
          state: toSafe(loc, 'parsed.state'),
          country: toSafe(loc, 'parsed.country')
        }))
      },
      // location: {
      //   city: toSafe(job, 'location.parsed.city'),
      //   state: toSafe(job, 'location.parsed.state'),
      //   country: toSafe(job, 'location.parsed.country')
      // }
    }));
    res.json(filtered);
  } catch (error) {
    console.error('Error filtering jobs:', error);
    res.status(500).json({ message: 'Error filtering jobs', error: error.message });
  }
};