import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  linkedinText: { type: String, default: '' },
  postalAddress: { type: String, default: '' },
  countryCode: { type: String, default: '' },
  geoId: { type: String, default: '' },
  parsed: {
    text: { type: String, default: '' },
    countryCode: { type: String, default: '' },
    regionCode: { type: String, default: '' }
  }
}, { _id: false });

const CompanySchema = new mongoose.Schema({
  id: { type: String, default: '' },
  universalName: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  name: { type: String, default: '' },
  website: { type: String, default: '' },
  logo: { type: String, default: '' },
  employeeCount: { type: Number, default: 0 },
  employeeCountRange: {
    start: { type: Number, default: 0 },
    end: { type: Number, default: 0 }
  },
  followerCount: { type: Number, default: 0 },
  description: { type: String, default: '' },
  locations: [{
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    line1: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    headquarter: { type: Boolean, default: false },
    parsed: {
      text: { type: String, default: '' },
      countryCode: { type: String, default: '' },
      regionCode: { type: String, default: '' },
      country: { type: String, default: '' },
      countryFull: { type: String, default: '' },
      state: { type: String, default: '' },
      city: { type: String, default: '' }
    }
  }],
  specialities: [{ type: String }],
  industries: [{ type: String }],
  logos: [{
    url: { type: String, default: '' },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    expiresAt: { type: Number, default: 0 }
  }],
  backgroundCover: { type: String, default: '' },
  backgroundCovers: [{
    url: { type: String, default: '' },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    expiresAt: { type: Number, default: 0 }
  }],
  callToActionUrl: { type: String, default: '' },
  similarOrganizations: [{ type: String }]
}, { _id: false });

const JobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  jobState: { type: String, default: '' },
  postedDate: { type: Date, default: null },
  descriptionText: { type: String, default: '' },
  descriptionHtml: { type: String, default: '' },
  location: { type: LocationSchema, default: () => ({}) },
  employmentType: { type: String, default: '' },
  workplaceType: { type: String, default: '' },
  workRemoteAllowed: { type: Boolean, default: false },
  easyApplyUrl: { type: String, default: '' },
  applyMethod: {
    unifyApplyEnabled: { type: Boolean, default: false },
    easyApplyUrl: { type: String, default: '' },
    type: { type: String, default: '' }
  },
  applicants: { type: Number, default: 0 },
  company: { type: CompanySchema, default: () => ({}) },
  salary: {
    text: { type: String, default: '' },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  jobFunctions: [{ type: String }],
  benefits: [{ type: String }],
  benefitsDataSource: { type: String, default: '' },
  views: { type: Number, default: 0 },
  expireAt: { type: Date, default: null },
  new: { type: Boolean, default: false },
  closedAt: { type: Date, default: null },
  contentSource: { type: String, default: '' },
  jobApplicationLimitReached: { type: Boolean, default: false },
  applicantTrackingSystem: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Job', JobSchema);