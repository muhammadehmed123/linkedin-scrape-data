// models/jobBatchSchema.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  id: String,
  title: String,
  linkedinUrl: String,
  postedDate: Date,
  expireAt: Date,
  descriptionText: String,
  employmentType: String,
  workplaceType: String,
  easyApplyUrl: String,
  applicants: Number,
  views: Number,
  jobApplicationLimitReached: Boolean,
  applyMethod: String,
  salary: mongoose.Schema.Types.Mixed,
  // Company fields
  "company.linkedinUrl": String,
  "company.logo": String,
  "company.website": String,
  "company.name": String,
  "company.employeeCount": mongoose.Schema.Types.Mixed,
  "company.followerCount": Number,
  "company.description": String,
  "company.specialities": [String],
  "company.industries": [String],
  "company.locations": [mongoose.Schema.Types.Mixed],
  // KPI fields
  kpi_jd_quality: mongoose.Schema.Types.Mixed,
  kpi_domain_fit: mongoose.Schema.Types.Mixed,
  kpi_seniority_alignment: mongoose.Schema.Types.Mixed,
  kpi_location_priority: mongoose.Schema.Types.Mixed,
  kpi_company_specialties: mongoose.Schema.Types.Mixed,
  kpi_salary: mongoose.Schema.Types.Mixed,
  kpi_company_size: mongoose.Schema.Types.Mixed,
  kpi_company_popularity: mongoose.Schema.Types.Mixed,
  kpi_industry_match: mongoose.Schema.Types.Mixed,
  kpi_job_popularity: mongoose.Schema.Types.Mixed,
  kpi_job_freshness: mongoose.Schema.Types.Mixed,
  kpi_employment_type: mongoose.Schema.Types.Mixed,
  kpi_contact_info: mongoose.Schema.Types.Mixed,
  kpi_skills_explicitness: mongoose.Schema.Types.Mixed,
  kpi_experience_threshold: mongoose.Schema.Types.Mixed,
  final_score: mongoose.Schema.Types.Mixed,
  tier: String
}, { _id: false });

const BatchSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  jobs: [JobSchema]
}, { _id: false });

const UserJobBatchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batches: [BatchSchema]
});

module.exports = mongoose.model('UserJobBatch', UserJobBatchSchema);