const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { toPublicUrl } = require('../middleware/upload');
const { emitEvent } = require('../utils/socketEmitter');
const { escapeRegex, paginate } = require('../utils/helpers');

const STATUS_LABELS = {
  applied: 'Applied',
  'under-review': 'Under Review',
  shortlisted: 'Shortlisted',
  interview: 'Interview Scheduled',
  offered: 'Offered',
  hired: 'Hired',
  rejected: 'Not Selected',
};

exports.apply = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.status !== 'open') return res.status(400).json({ message: 'This job is no longer accepting applications' });

  const already = await Application.findOne({ job: job._id, candidate: req.user._id });
  if (already) return res.status(409).json({ message: 'You have already applied for this job' });

  let resume;
  if (req.file) {
    resume = { url: toPublicUrl(req.file), originalName: req.file.originalname };
    if (!req.user.resume || !req.user.resume.url) {
      await User.findByIdAndUpdate(req.user._id, { resume: { ...resume, uploadedAt: new Date() } });
    }
  } else if (req.user.resume && req.user.resume.url) {
    resume = { url: req.user.resume.url, originalName: req.user.resume.originalName };
  } else {
    return res.status(400).json({ message: 'Please upload your resume to apply' });
  }

  const { coverLetter = '', expectedSalary = '', noticePeriod = '' } = req.body || {};
  const application = await Application.create({
    job: job._id,
    candidate: req.user._id,
    resume,
    coverLetter,
    expectedSalary,
    noticePeriod,
    history: [{ status: 'applied', note: 'Application submitted' }],
  });
  job.applicationsCount = await Application.countDocuments({ job: job._id });
  await job.save();

  const populated = await application.populate([
    { path: 'job', select: 'title company location' },
    { path: 'candidate', select: 'name email phone' },
  ]);
  emitEvent('admins', 'application:new', populated);
  res.status(201).json({ application: populated, message: 'Application submitted successfully' });
};

exports.myApplications = async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate('job', 'title company location employmentType salaryMin salaryMax status')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ applications });
};

exports.myAppliedJobIds = async (req, res) => {
  const ids = await Application.find({ candidate: req.user._id }).distinct('job');
  res.json({ jobIds: ids });
};

exports.withdraw = async (req, res) => {
  const application = await Application.findOne({ _id: req.params.id, candidate: req.user._id });
  if (!application) return res.status(404).json({ message: 'Application not found' });
  if (!['applied', 'under-review'].includes(application.status)) {
    return res.status(400).json({ message: 'This application can no longer be withdrawn' });
  }
  await application.deleteOne();
  const count = await Application.countDocuments({ job: application.job });
  await Job.findByIdAndUpdate(application.job, { applicationsCount: count });
  emitEvent('admins', 'application:withdrawn', { _id: application._id });
  res.json({ message: 'Application withdrawn' });
};

// ----- Admin -----

exports.adminList = async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.job) filter.job = req.query.job;
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q.trim()), 'i');
    const users = await User.find({ role: 'candidate', $or: [{ name: rx }, { email: rx }] }).distinct('_id');
    const jobs = await Job.find({ title: rx }).distinct('_id');
    filter.$or = [{ candidate: { $in: users } }, { job: { $in: jobs } }];
  }
  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate('job', 'title company location')
      .populate('candidate', 'name email phone location experienceYears skills')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Application.countDocuments(filter),
  ]);
  res.json({ applications, total, page, pages: Math.max(Math.ceil(total / limit), 1), limit });
};

exports.adminGet = async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('job')
    .populate('candidate')
    .lean();
  if (!application) return res.status(404).json({ message: 'Application not found' });
  res.json({ application });
};

exports.updateStatus = async (req, res) => {
  const { status, note = '' } = req.body || {};
  if (!Application.STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const application = await Application.findById(req.params.id);
  if (!application) return res.status(404).json({ message: 'Application not found' });

  application.status = status;
  application.adminNote = note;
  application.history.push({ status, note });
  await application.save();
  await application.populate([
    { path: 'job', select: 'title company location' },
    { path: 'candidate', select: 'name email phone location experienceYears skills' },
  ]);

  emitEvent(`user:${application.candidate._id}`, 'application:status', {
    _id: application._id,
    status,
    statusLabel: STATUS_LABELS[status],
    note,
    job: application.job,
  });
  emitEvent('admins', 'application:updated', application);
  res.json({ application });
};
