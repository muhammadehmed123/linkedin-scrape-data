const path = require('path');
const fs = require('fs');
const { fetchJobsFromApify } = require('../config/apifyService');
const { runAimlProcessing } = require('../services/aimlProcessService');
const UserJobBatch = require('../models/jobBatchSchema');
// const JobBatch = require('../models/jobBatchSchema'); // or your actual model

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


// ... existing code ...

// exports.saveJobs = async (req, res) => {
//   try {
//     const userId = req.user.id; // assuming user is authenticated and userId is available

//     // 1. Read jobs from scored_jobs_output.json
//     const scoredPath = path.join(__dirname, '../data/scored_jobs_output.json');
//     if (!fs.existsSync(scoredPath)) {
//       return res.status(404).json({ error: 'scored_jobs_output.json not found.' });
//     }
//     const jobs = JSON.parse(fs.readFileSync(scoredPath, 'utf-8'));
//     if (!Array.isArray(jobs) || jobs.length === 0) {
//       return res.status(400).json({ error: 'No jobs data to save.' });
//     }

//     // 2. Save to MongoDB
//     const batch = {
//       timestamp: new Date(),
//       date: new Date().toISOString().split('T')[0],
//       jobs: jobs
//     };

//     let userBatch = await UserJobBatch.findOne({ userId });
//     if (!userBatch) {
//       userBatch = new UserJobBatch({ userId, batches: [batch] });
//     } else {
//       userBatch.batches.push(batch);
//     }
//     await userBatch.save();

//     res.status(200).json({ message: 'Jobs saved to database.' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// const UserJobBatch = require('../models/jobBatchSchema');

/**
 * Save a new batch of jobs for the authenticated user.
 * If a UserJobBatch exists, append the batch; otherwise, create a new document.
 */
// exports.saveJobsBatch = async (req, res) => {
//   try {
//     // 1. Get userId from auth middleware
//     const userId = req.user._id;

//     // 2. Get batch data from request body
//     // Expecting: { date: 'YYYY-MM-DD', jobs: [ ... ] }
//     const { date, jobs } = req.body;

//     if (!date || !Array.isArray(jobs)) {
//       return res.status(400).json({ message: 'Date and jobs array are required.' });
//     }

//     // 3. Find if a UserJobBatch exists for this user
//     let userJobBatch = await UserJobBatch.findOne({ userId });

//     const newBatch = {
//       date,
//       jobs,
//       timestamp: new Date()
//     };

//     if (userJobBatch) {
//       // 4a. If exists, push new batch
//       userJobBatch.batches.push(newBatch);
//       await userJobBatch.save();
//     } else {
//       // 4b. If not, create new document
//       userJobBatch = new UserJobBatch({
//         userId,
//         batches: [newBatch]
//       });
//       await userJobBatch.save();
//     }

//     return res.status(201).json({ message: 'Jobs batch saved successfully.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error.' });
//   }
// };

// const fs = require('fs');
// const path = require('path');
// const UserJobBatch = require('../models/jobBatchSchema');

// This endpoint will read scored_jobs_output.json and save it to the DB for the current user
// const fs = require('fs');
// const path = require('path');
// const UserJobBatch = require('../models/jobBatchSchema');

exports.uploadScoredJobsFromFile = async (req, res) => {
  try {
    const userId = req.user._id;
    const filePath = path.join(__dirname, '../data/scored_jobs_output.json');

    // Read and parse the JSON file (which is an array)
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jobs = JSON.parse(fileContent);

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({ message: 'Jobs array is empty or invalid in the file.' });
    }

    // Use today's date as the batch date
    const date = new Date().toISOString().split('T')[0];

    // Prepare the new batch
    const newBatch = {
      date,
      jobs,
      timestamp: new Date()
    };

    // Find or create UserJobBatch
    let userJobBatch = await UserJobBatch.findOne({ userId });

    if (userJobBatch) {
      userJobBatch.batches.push(newBatch);
      await userJobBatch.save();
    } else {
      userJobBatch = new UserJobBatch({
        userId,
        batches: [newBatch]
      });
      await userJobBatch.save();
    }

    return res.status(201).json({ message: 'Jobs batch uploaded from file successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
// ... existing code ...
// controllers/jobController.js

// exports.getJobsByDate = async (req, res) => {
//   try {
//     const userId = req.user._id; // set by authMiddleware
//     const date = req.query.date || new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

//     // Find the user's job batches
//     const jobBatch = await UserJobBatch.findOne({ userId });

//     if (!jobBatch) {
//       return res.status(404).json({ message: 'No job batches found for user.' });
//     }

//     // Find the batch for the requested date
//     const batch = jobBatch.batches.find(b => b.date === date);

//     if (!batch) {
//       return res.status(404).json({ message: 'No jobs found for this date.' });
//     }

//     return res.json({ date: batch.date, jobs: batch.jobs });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error.' });
//   }
// };
exports.getJobsByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    let { startDate, endDate } = req.query;

    const userJobBatch = await UserJobBatch.findOne({ userId });

    if (!userJobBatch || !userJobBatch.batches.length) {
      return res.status(404).json({ message: 'No job batches found for user.' });
    }

    // If no dates provided, fetch the latest batch by date
    if (!startDate && !endDate) {
      // Find the batch with the latest date
      const latestBatch = userJobBatch.batches.reduce((latest, current) =>
        !latest || current.date > latest.date ? current : latest, null
      );
      if (!latestBatch) {
        return res.status(404).json({ message: 'No jobs found.' });
      }
      return res.json({ date: latestBatch.date, jobs: latestBatch.jobs });
    }

    // If only one date is provided, treat both as the same
    if (!startDate) startDate = endDate;
    if (!endDate) endDate = startDate;

    // Get all batches within the date range (inclusive)
    const batchesInRange = userJobBatch.batches.filter(b =>
      b.date >= startDate && b.date <= endDate
    );

    if (!batchesInRange.length) {
      return res.status(404).json({ message: 'No jobs found for this date range.' });
    }

    // Merge all jobs from all batches in the range
    const jobs = batchesInRange.flatMap(b => b.jobs);

    return res.json({ startDate, endDate, jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
// Utility to safely access nested properties
function toSafe(obj, path, fallback = null) {
  try {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : fallback), obj);
  } catch {
    return fallback;
  }
}

// Required countries and codes (case-insensitive)
const requiredCountries = [
  "saudi arabia",
  "united arab emirates",
  "united states",
  "uk",
  "united kingdom"
];
const requiredCountryCodes = ["us", "uk", "ae", "sa"];

function isRequiredCountry(country) {
  if (!country) return false;
  const c = country.toLowerCase().trim();
  return (
    requiredCountries.includes(c) ||
    requiredCountryCodes.includes(c)
  );
}

exports.getFilteredJobs = (req, res) => {
  try {
    const rawPath = path.join(__dirname, '../data/apify_jobs_raw.json');
    const jobs = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));

    // Remove duplicates by id
    const seenIds = new Set();
    const duplicateIds = [];
    const uniqueJobs = jobs.filter(job => {
      if (seenIds.has(job.id)) {
        duplicateIds.push(job.id);
        return false;
      }
      seenIds.add(job.id);
      return true;
    });

    // Filter jobs by all possible country fields
    const excludedByCountryJobs = [];
    const filtered = uniqueJobs.filter(job => {
      let countries = [];

      // company.locations[].parsed.country, company.locations[].country, company.locations[].parsed.countryCode
      const companyLocs = toSafe(job, 'company.locations', []);
      if (Array.isArray(companyLocs)) {
        companyLocs.forEach(loc => {
          if (toSafe(loc, 'parsed.country')) countries.push(toSafe(loc, 'parsed.country'));
          if (toSafe(loc, 'country')) countries.push(toSafe(loc, 'country'));
          if (toSafe(loc, 'parsed.countryCode')) countries.push(toSafe(loc, 'parsed.countryCode'));
        });
      }

      // location.parsed.country, location.country, location.parsed.countryCode
      if (toSafe(job, 'location.parsed.country')) countries.push(toSafe(job, 'location.parsed.country'));
      if (toSafe(job, 'location.country')) countries.push(toSafe(job, 'location.country'));
      if (toSafe(job, 'location.parsed.countryCode')) countries.push(toSafe(job, 'location.parsed.countryCode'));

      // If any country field matches, keep the job
      const match = countries.some(isRequiredCountry);
      if (!match) excludedByCountryJobs.push(job);
      return match;
    }).map(job => ({
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
      }
    }));

    // Save filtered data to file
    const outPath = path.join(__dirname, '../data/filtered.json');
    fs.writeFileSync(outPath, JSON.stringify(filtered, null, 2), 'utf-8');

    // Debug output (can be removed/commented after testing)
    console.log('Duplicate IDs removed:', duplicateIds);
    console.log('Jobs excluded by country (IDs):', excludedByCountryJobs.map(j => j.id));

    // Respond with summary only
    res.status(200).json({
      message: 'Filtered jobs saved to data/filtered.json',
      total_raw: jobs.length,
      total_unique: uniqueJobs.length,
      duplicates_removed: duplicateIds.length,
      duplicate_ids: duplicateIds, // for debug
      excluded_by_country: excludedByCountryJobs.length,
      excluded_by_country_ids: excludedByCountryJobs.map(j => j.id), // for debug
      total_saved: filtered.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error filtering jobs', error: error.message });
  }
};
// // Utility to safely access nested properties
// function toSafe(obj, path, fallback = null) {
//   try {
//     return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : fallback), obj);
//   } catch {
//     return fallback;
//   }
// }

// // List of required countries (lowercase for comparison)
// const requiredCountries = [
//   "saudi arabia",
//   "united arab emirates",
//   "united states",
//   "uk",
//   "united kingdom"
// ];
// exports.getFilteredJobs = (req, res) => {
//   try {
//     const rawPath = path.join(__dirname, '../data/apify_jobs_raw.json');
//     const jobs = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));

//     // Debug: Track duplicate IDs
//     const seenIds = new Set();
//     const duplicateIds = [];
//     const uniqueJobs = jobs.filter(job => {
//       if (seenIds.has(job.id)) {
//         duplicateIds.push(job.id);
//         return false;
//       }
//       seenIds.add(job.id);
//       return true;
//     });

//     // Debug: Track jobs excluded by country
//     const excludedByCountryJobs = [];
//     const filtered = uniqueJobs.filter(job => {
//       const locations = toSafe(job, 'company.locations', []);
//       if (!Array.isArray(locations)) {
//         excludedByCountryJobs.push(job);
//         return false;
//       }
//       const match = locations.some(loc => {
//         const country = (toSafe(loc, 'parsed.country', '') || '').toLowerCase();
//         return requiredCountries.includes(country);
//       });
//       if (!match) excludedByCountryJobs.push(job);
//       return match;
//     }).map(job => ({
//       id: job.id,
//       title: job.title,
//       linkedinUrl: job.linkedinUrl,
//       postedDate: job.postedDate,
//       expireAt: job.expireAt,
//       descriptionText: job.descriptionText,
//       employmentType: job.employmentType,
//       workplaceType: job.workplaceType,
//       easyApplyUrl: job.easyApplyUrl,
//       applicants: job.applicants,
//       views: job.views,
//       jobApplicationLimitReached: job.jobApplicationLimitReached,
//       applyMethod: toSafe(job, 'applyMethod.companyApplyUrl'),
//       salary: toSafe(job, 'salary.text'),
//       company: {
//         linkedinUrl: toSafe(job, 'company.linkedinUrl'),
//         logo: toSafe(job, 'company.logo'),
//         website: toSafe(job, 'company.website'),
//         name: toSafe(job, 'company.name'),
//         employeeCount: toSafe(job, 'company.employeeCount'),
//         followerCount: toSafe(job, 'company.followerCount'),
//         description: toSafe(job, 'company.description'),
//         specialities: toSafe(job, 'company.specialities', []),
//         industries: toSafe(job, 'company.industries', []),
//         locations: (toSafe(job, 'company.locations', []) || []).map(loc => ({
//           city: toSafe(loc, 'parsed.city'),
//           state: toSafe(loc, 'parsed.state'),
//           country: toSafe(loc, 'parsed.country')
//         }))
//       }
//     }));

//     // Save filtered data to file
//     const outPath = path.join(__dirname, '../data/filtered.json');
//     fs.writeFileSync(outPath, JSON.stringify(filtered, null, 2), 'utf-8');

//     // Debug output
//     console.log('Duplicate IDs removed:', duplicateIds);
//     console.log('Jobs excluded by country (IDs):', excludedByCountryJobs.map(j => j.id));
//     // Optionally, print more details:
//     // console.log('Jobs excluded by country (full):', excludedByCountryJobs);

//     res.status(200).json({
//       message: 'Filtered jobs saved to data/filtered.json',
//       total_raw: jobs.length,
//       total_unique: uniqueJobs.length,
//       duplicates_removed: duplicateIds.length,
//       duplicate_ids: duplicateIds, // for debug
//       excluded_by_country: excludedByCountryJobs.length,
//       excluded_by_country_ids: excludedByCountryJobs.map(j => j.id), // for debug
//       total_saved: filtered.length
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error filtering jobs', error: error.message });
//   }
// };
// exports.getFilteredJobs = (req, res) => {
//   try {
//     const rawPath = path.join(__dirname, '../data/apify_jobs_raw.json');
//     const jobs = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));

//     // Remove duplicates by id
//     const seenIds = new Set();
//     let duplicateCount = 0;
//     const uniqueJobs = jobs.filter(job => {
//       if (seenIds.has(job.id)) {
//         duplicateCount++;
//         return false;
//       }
//       seenIds.add(job.id);
//       return true;
//     });

//     // Filter jobs by company.locations country
//     let excludedByCountry = 0;
//     const filtered = uniqueJobs.filter(job => {
//       const locations = toSafe(job, 'company.locations', []);
//       if (!Array.isArray(locations)) {
//         excludedByCountry++;
//         return false;
//       }
//       const match = locations.some(loc => {
//         const country = (toSafe(loc, 'parsed.country', '') || '').toLowerCase();
//         return requiredCountries.includes(country);
//       });
//       if (!match) excludedByCountry++;
//       return match;
//     }).map(job => ({
//       id: job.id,
//       title: job.title,
//       linkedinUrl: job.linkedinUrl,
//       postedDate: job.postedDate,
//       expireAt: job.expireAt,
//       descriptionText: job.descriptionText,
//       employmentType: job.employmentType,
//       workplaceType: job.workplaceType,
//       easyApplyUrl: job.easyApplyUrl,
//       applicants: job.applicants,
//       views: job.views,
//       jobApplicationLimitReached: job.jobApplicationLimitReached,
//       applyMethod: toSafe(job, 'applyMethod.companyApplyUrl'),
//       salary: toSafe(job, 'salary.text'),
//       company: {
//         linkedinUrl: toSafe(job, 'company.linkedinUrl'),
//         logo: toSafe(job, 'company.logo'),
//         website: toSafe(job, 'company.website'),
//         name: toSafe(job, 'company.name'),
//         employeeCount: toSafe(job, 'company.employeeCount'),
//         followerCount: toSafe(job, 'company.followerCount'),
//         description: toSafe(job, 'company.description'),
//         specialities: toSafe(job, 'company.specialities', []),
//         industries: toSafe(job, 'company.industries', []),
//         locations: (toSafe(job, 'company.locations', []) || []).map(loc => ({
//           city: toSafe(loc, 'parsed.city'),
//           state: toSafe(loc, 'parsed.state'),
//           country: toSafe(loc, 'parsed.country')
//         }))
//       }
//     }));

//     // Save filtered data to file
//     const outPath = path.join(__dirname, '../data/filtered.json');
//     fs.writeFileSync(outPath, JSON.stringify(filtered, null, 2), 'utf-8');

//     // Respond with summary only
//     res.status(200).json({
//       message: 'Filtered jobs saved to data/filtered.json',
//       total_raw: jobs.length,
//       total_unique: uniqueJobs.length,
//       duplicates_removed: duplicateCount,
//       excluded_by_country: excludedByCountry,
//       total_saved: filtered.length
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error filtering jobs', error: error.message });
//   }
// };

// // Filter and return only selected fields from raw Apify jobs
// toSafe = (obj, path, fallback = null) => {
//   try {
//     return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : fallback), obj);
//   } catch {
//     return fallback;
//   }
// };

// function toSafe(obj, path, fallback = null) {
//   try {
//     return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : fallback), obj);
//   } catch {
//     return fallback;
//   }
// }

// exports.getFilteredJobs = (req, res) => {
//   try {
//     const rawPath = path.join(__dirname, '../data/apify_jobs_raw.json');
//     const jobs = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));
//     const filtered = jobs.map(job => ({
//       id: job.id,
//       title: job.title,
//       linkedinUrl: job.linkedinUrl,
//       postedDate: job.postedDate,
//       expireAt: job.expireAt,
//       descriptionText: job.descriptionText,
//       employmentType: job.employmentType,
//       workplaceType: job.workplaceType,
//       easyApplyUrl: job.easyApplyUrl,
//       applicants: job.applicants,
//       views: job.views,
//       jobApplicationLimitReached: job.jobApplicationLimitReached,
//       applyMethod: toSafe(job, 'applyMethod.companyApplyUrl'),
//       salary: toSafe(job, 'salary.text'),
//       company: {
//         linkedinUrl: toSafe(job, 'company.linkedinUrl'),
//         logo: toSafe(job, 'company.logo'),
//         website: toSafe(job, 'company.website'),
//         name: toSafe(job, 'company.name'),
//         employeeCount: toSafe(job, 'company.employeeCount'),
//         followerCount: toSafe(job, 'company.followerCount'),
//         description: toSafe(job, 'company.description'),
//         specialities: toSafe(job, 'company.specialities', []),
//         industries: toSafe(job, 'company.industries', []),
//         locations: (toSafe(job, 'company.locations', []) || []).map(loc => ({
//           city: toSafe(loc, 'parsed.city'),
//           state: toSafe(loc, 'parsed.state'),
//           country: toSafe(loc, 'parsed.country')
//         }))
//       }
//       // If you want location outside company, uncomment below:
//       // location: {
//       //   city: toSafe(job, 'location.parsed.city'),
//       //   state: toSafe(job, 'location.parsed.state'),
//       //   country: toSafe(job, 'location.parsed.country')
//       // }
//     }));

//     // Save filtered data to file
//     const outPath = path.join(__dirname, '../data/filtered.json');
//     fs.writeFileSync(outPath, JSON.stringify(filtered, null, 2), 'utf-8');

//     // Respond with only a success message
//     res.status(200).json({ message: 'Filtered jobs saved to data/filtered.json' });
//   } catch (error) {
//     console.error('Error filtering jobs:', error);
//     res.status(500).json({ message: 'Error filtering jobs', error: error.message });
//   }
// };

// exports.getFilteredJobs = (req, res) => {
//   try {
//     const rawPath = path.join(__dirname, '../data/apify_jobs_raw.json');
//     const jobs = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));
//     const filtered = jobs.map(job => ({
//       id: job.id,
//       title: job.title,
//       linkedinUrl: job.linkedinUrl,
//       postedDate: job.postedDate,
//       expireAt: job.expireAt,
//       descriptionText: job.descriptionText,
//       employmentType: job.employmentType,
//       workplaceType: job.workplaceType,
//       easyApplyUrl: job.easyApplyUrl,
//       applicants: job.applicants,
//       views: job.views,
//       jobApplicationLimitReached: job.jobApplicationLimitReached,
//       applyMethod: toSafe(job, 'applyMethod.companyApplyUrl'),
//       salary: toSafe(job, 'salary.text'),
//       company: {
//         linkedinUrl: toSafe(job, 'company.linkedinUrl'),
//         logo: toSafe(job, 'company.logo'),
//         website: toSafe(job, 'company.website'),
//         name: toSafe(job, 'company.name'),
//         employeeCount: toSafe(job, 'company.employeeCount'),
//         followerCount: toSafe(job, 'company.followerCount'),
//         description: toSafe(job, 'company.description'),
//         specialities: toSafe(job, 'company.specialities', []),
//         industries: toSafe(job, 'company.industries', []),
//         locations: (toSafe(job, 'company.locations', []) || []).map(loc => ({
//           city: toSafe(loc, 'parsed.city'),
//           state: toSafe(loc, 'parsed.state'),
//           country: toSafe(loc, 'parsed.country')
//         }))
//       },
//       // location: {
//       //   city: toSafe(job, 'location.parsed.city'),
//       //   state: toSafe(job, 'location.parsed.state'),
//       //   country: toSafe(job, 'location.parsed.country')
//       // }
//     }));
//     res.json(filtered);
//   } catch (error) {
//     console.error('Error filtering jobs:', error);
//     res.status(500).json({ message: 'Error filtering jobs', error: error.message });
//   }
// };

// const path = require('path');
// const fs = require('fs');

// // Utility to safely access nested properties
// function toSafe(obj, path, fallback = null) {
//   try {
//     return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : fallback), obj);
//   } catch {
//     return fallback;
//   }
// }

// // Utility to flatten an object to dot notation
// function flatten(obj, prefix = '', res = {}) {
//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       const value = obj[key];
//       const newKey = prefix ? `${prefix}.${key}` : key;
//       if (Array.isArray(value)) {
//         value.forEach((item, idx) => {
//           flatten(item, `${newKey}.${idx}`, res);
//         });
//       } else if (value && typeof value === 'object' && value !== null) {
//         flatten(value, newKey, res);
//       } else {
//         res[newKey] = value;
//       }
//     }
//   }
//   return res;
// }

// exports.getFilteredJobs = (req, res) => {
//   try {
//     const rawPath = path.join(__dirname, '../data/apify_jobs_raw.json');
//     const jobs = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));
//     const filtered = jobs.map(job => ({
//       id: job.id,
//       title: job.title,
//       linkedinUrl: job.linkedinUrl,
//       postedDate: job.postedDate,
//       expireAt: job.expireAt,
//       descriptionText: job.descriptionText,
//       employmentType: job.employmentType,
//       workplaceType: job.workplaceType,
//       easyApplyUrl: job.easyApplyUrl,
//       applicants: job.applicants,
//       views: job.views,
//       jobApplicationLimitReached: job.jobApplicationLimitReached,
//       applyMethod: toSafe(job, 'applyMethod.companyApplyUrl'),
//       salary: toSafe(job, 'salary.text'),
//       company: {
//         linkedinUrl: toSafe(job, 'company.linkedinUrl'),
//         logo: toSafe(job, 'company.logo'),
//         website: toSafe(job, 'company.website'),
//         name: toSafe(job, 'company.name'),
//         employeeCount: toSafe(job, 'company.employeeCount'),
//         followerCount: toSafe(job, 'company.followerCount'),
//         description: toSafe(job, 'company.description'),
//         specialities: toSafe(job, 'company.specialities', []),
//         industries: toSafe(job, 'company.industries', []),
//         locations: (toSafe(job, 'company.locations', []) || []).map(loc => ({
//           city: toSafe(loc, 'parsed.city'),
//           state: toSafe(loc, 'parsed.state'),
//           country: toSafe(loc, 'parsed.country')
//         }))
//       },
//       location: {
//         city: toSafe(job, 'location.parsed.city'),
//         state: toSafe(job, 'location.parsed.state'),
//         country: toSafe(job, 'location.parsed.country')
//       }
//     }));

//     // Flatten each job object
//     const flatJobs = filtered.map(job => flatten(job));
//     const outPath = path.join(__dirname, '../data/filtered.json');
//     fs.writeFileSync(outPath, JSON.stringify(flatJobs, null, 2), 'utf-8');
//     // Respond with only a success message, not the data
//     res.status(200).json({ message: 'Filtered and flattened jobs saved to data/filtered.json' });
//   } catch (error) {
//     console.error('Error filtering jobs:', error);
//     res.status(500).json({ message: 'Error filtering jobs', error: error.message });
//   }
// };


// Utility to safely access nested properties
