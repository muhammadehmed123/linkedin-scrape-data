const path = require('path');
const fs = require('fs');

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