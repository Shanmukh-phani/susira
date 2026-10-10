const mongoose = require('mongoose');

const EMPLOYMENT_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Temporary'];

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: 'Sri susira solutions LLP' },
    location: { type: String, required: true, trim: true },
    department: { type: String, trim: true, default: 'General' },
    employmentType: { type: String, enum: EMPLOYMENT_TYPES, default: 'Full Time' },
    experienceMin: { type: Number, min: 0, default: 0 },
    experienceMax: { type: Number, min: 0, default: 0 },
    salaryMin: { type: Number, min: 0, default: 0 },
    salaryMax: { type: Number, min: 0, default: 0 },
    openings: { type: Number, min: 1, default: 1 },
    skills: [{ type: String, trim: true }],
    description: { type: String, required: true },
    responsibilities: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    benefits: [{ type: String, trim: true }],
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', company: 'text', skills: 'text', description: 'text' });

jobSchema.statics.EMPLOYMENT_TYPES = EMPLOYMENT_TYPES;

module.exports = mongoose.model('Job', jobSchema);
