
const { fetchUpworkJobs } = require('../services/upworkService');

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

// const fs = require('fs');
// const path = require('path');

// // Path to input and output files
// const inputPath = path.join(__dirname, '..', 'data', 'upwork_jobs_raw.json');
// const outputPath = path.join(__dirname, '..', 'data', 'filtered_upwork.json');
// // Helper to safely get nested values
// function get(obj, path, fallback = null) {
//   return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : fallback), obj);
// }

// // Fields to extract (dot notation)
// const fields = [
//   'buyer.stats.totalCharges.amount',
//   'buyer.stats.score',
//   'isPaymentMethodVerified',
//   'buyer.company.contractDate',
//   'buyer.stats.totalAssignments',
//   'buyer.stats.totalJobsWithHires',
//   'buyer.stats.activeAssignmentsCount',
//   'buyer.stats.feedbackCount',
//   'buyer.jobs.openCount',
//   'hourly.min',
//   'hourly.max',
//   'buyer.avgHourlyJobsRate.amount',
//   'hourly.duration.weeks',
//   'isContractToHire',
//   'tags',
//   'buyer.stats.totalJobsWithHires',
//   'buyer.jobs.postedCount',
//   'level',
//   'contractorTier',
//   'skills',
//   'qualifications.minHoursWeek',
//   'clientActivity.lastBuyerActivity',
//   'description',
//   'title',
//   'hourly.type',
//   'buyer.company.profile.industry'
// ];

// // Read input data
// const jobs = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

// // Normalize and filter
// const filtered = jobs.map(job => {
//   const result = {};
//   for (const field of fields) {
//     // Special handling for arrays
//     if (field === 'tags' && Array.isArray(job.tags)) {
//       result.tags = job.tags.slice(); // copy array
//     } else if (field === 'skills' && Array.isArray(job.skills)) {
//       // Flatten skills to just names array
//       result.skills = job.skills.map(s => s.name);
//     } else {
//       result[field] = get(job, field);
//     }
//   }
//   return result;
// });

// // Write output
// fs.writeFileSync(outputPath, JSON.stringify(filtered, null, 2), 'utf-8');
// console.log('Filtered Upwork jobs saved to', outputPath);

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'data', 'upwork_jobs_raw.json');
const outputPath = path.join(__dirname, '..', 'data', 'filtered_upwork.json');

const jobs = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

const normalized = jobs.map(job => ({
  jobId: job.id,
  title: job.title,
  description: job.description,
  isContractToHire: job.isContractToHire,
  isPaymentMethodVerified: job.isPaymentMethodVerified,
  level: job.level,
  contractorTier: job.contractorTier,
  companyId: job.buyer?.company?.companyId || null,
  companyIndustry: job.buyer?.company?.profile?.industry || null,
  companyContractDate: job.buyer?.company?.contractDate || null,
  buyerScore: job.buyer?.stats?.score ?? null,
  buyerTotalAssignments: job.buyer?.stats?.totalAssignments ?? null,
  buyerTotalJobsWithHires: job.buyer?.stats?.totalJobsWithHires ?? null,
  buyerActiveAssignmentsCount: job.buyer?.stats?.activeAssignmentsCount ?? null,
  buyerFeedbackCount: job.buyer?.stats?.feedbackCount ?? null,
  buyerOpenJobsCount: job.buyer?.jobs?.openCount ?? null,
  buyerPostedJobsCount: job.buyer?.jobs?.postedCount ?? null,
  buyerAvgHourlyRate: job.buyer?.avgHourlyJobsRate?.amount ?? null,
  minHourlyRate: job.hourly?.min ?? null,
  maxHourlyRate: job.hourly?.max ?? null,
  hourlyType: job.hourly?.type ?? null,
  hourlyWeeks: job.hourly?.duration?.weeks ?? null,
  tags: Array.isArray(job.tags) ? job.tags : [],
  skills: Array.isArray(job.skills) ? job.skills.map(s => s.name) : [],
  minHoursWeek: job.qualifications?.minHoursWeek ?? null,
  lastBuyerActivity: job.clientActivity?.lastBuyerActivity ?? null
}));

fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2), 'utf-8');
console.log('Filtered and normalized Upwork jobs saved to', outputPath);