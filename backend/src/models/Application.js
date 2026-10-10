const mongoose = require('mongoose');

const STATUSES = ['applied', 'under-review', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'];

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: {
      url: { type: String, required: true },
      originalName: { type: String, default: '' },
    },
    coverLetter: { type: String, trim: true, default: '' },
    expectedSalary: { type: String, trim: true, default: '' },
    noticePeriod: { type: String, trim: true, default: '' },
    status: { type: String, enum: STATUSES, default: 'applied' },
    adminNote: { type: String, trim: true, default: '' },
    history: [
      {
        status: { type: String, enum: STATUSES },
        note: String,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

applicationSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model('Application', applicationSchema);
