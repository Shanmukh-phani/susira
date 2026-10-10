const Job = require('../models/Job');
const Application = require('../models/Application');
const { emitEvent } = require('../utils/socketEmitter');
const { escapeRegex, toList, toLines, paginate, parseRange } = require('../utils/helpers');

const SORTS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  salary: { salaryMax: -1 },
  experience: { experienceMin: 1 },
};

function buildFilter(query, { includeClosed = false } = {}) {
  const filter = {};
  if (!includeClosed) filter.status = 'open';
  else if (query.status) filter.status = query.status;

  if (query.q) {
    const rx = new RegExp(escapeRegex(query.q.trim()), 'i');
    filter.$or = [{ title: rx }, { company: rx }, { skills: rx }, { department: rx }, { location: rx }];
  }
  if (query.location) filter.location = new RegExp(`^${escapeRegex(query.location)}$`, 'i');
  if (query.department) filter.department = query.department;
  if (query.employmentType) filter.employmentType = query.employmentType;
  if (query.skill) filter.skills = new RegExp(`^${escapeRegex(query.skill)}$`, 'i');

  const exp = parseRange(query.experience);
  if (exp) {
    filter.experienceMin = { $lte: exp[1] };
    filter.experienceMax = { $gte: exp[0] };
  }
  const sal = parseRange(query.salary);
  if (sal) {
    filter.salaryMin = { $lte: sal[1] };
    filter.salaryMax = { $gte: sal[0] };
  }
  return filter;
}

function pickJobFields(body = {}) {
  const num = (v) => (v === '' || v === undefined || v === null ? undefined : Number(v));
  const data = {
    title: body.title,
    company: body.company,
    location: body.location,
    department: body.department,
    employmentType: body.employmentType,
    experienceMin: num(body.experienceMin),
    experienceMax: num(body.experienceMax),
    salaryMin: num(body.salaryMin),
    salaryMax: num(body.salaryMax),
    openings: num(body.openings),
    description: body.description,
    status: body.status,
  };
  if (body.skills !== undefined) data.skills = toList(body.skills);
  if (body.responsibilities !== undefined) data.responsibilities = toLines(body.responsibilities);
  if (body.requirements !== undefined) data.requirements = toLines(body.requirements);
  if (body.benefits !== undefined) data.benefits = toLines(body.benefits);
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
  return data;
}

function validateRanges(data) {
  if (data.experienceMin !== undefined && data.experienceMax !== undefined && data.experienceMax < data.experienceMin) {
    return 'Maximum experience cannot be less than minimum experience';
  }
  if (data.salaryMin !== undefined && data.salaryMax !== undefined && data.salaryMax < data.salaryMin) {
    return 'Maximum salary cannot be less than minimum salary';
  }
  return null;
}

exports.listJobs = async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = buildFilter(req.query);
  const sort = SORTS[req.query.sort] || SORTS.newest;
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Job.countDocuments(filter),
  ]);
  res.json({ jobs, total, page, pages: Math.max(Math.ceil(total / limit), 1), limit });
};

exports.filterOptions = async (req, res) => {
  const open = { status: 'open' };
  const [locations, departments, skills] = await Promise.all([
    Job.distinct('location', open),
    Job.distinct('department', open),
    Job.distinct('skills', open),
  ]);
  res.json({
    locations: locations.sort(),
    departments: departments.sort(),
    skills: skills.sort((a, b) => a.localeCompare(b)),
    employmentTypes: Job.EMPLOYMENT_TYPES,
    experience: [
      { value: '0-1', label: '0 - 1 Years' },
      { value: '1-3', label: '1 - 3 Years' },
      { value: '3-5', label: '3 - 5 Years' },
      { value: '5-8', label: '5 - 8 Years' },
      { value: '8+', label: '8+ Years' },
    ],
    salary: [
      { value: '0-3', label: 'Up to ₹3 LPA' },
      { value: '3-6', label: '₹3 - 6 LPA' },
      { value: '6-10', label: '₹6 - 10 LPA' },
      { value: '10-20', label: '₹10 - 20 LPA' },
      { value: '20+', label: '₹20 LPA +' },
    ],
  });
};

exports.getJob = async (req, res) => {
  const job = await Job.findById(req.params.id).lean();
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const similar = await Job.find({
    _id: { $ne: job._id },
    status: 'open',
    $or: [{ department: job.department }, { skills: { $in: job.skills } }],
  })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();
  res.json({ job, similar });
};

// ----- Admin -----

exports.adminListJobs = async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = buildFilter(req.query, { includeClosed: true });
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Job.countDocuments(filter),
  ]);
  res.json({ jobs, total, page, pages: Math.max(Math.ceil(total / limit), 1), limit });
};

exports.createJob = async (req, res) => {
  const data = pickJobFields(req.body);
  const rangeError = validateRanges(data);
  if (rangeError) return res.status(400).json({ message: rangeError });

  const job = await Job.create({ ...data, postedBy: req.user._id });
  if (job.status === 'open') emitEvent('public', 'job:created', job);
  emitEvent('admins', 'admin:job:changed', { action: 'created', job });
  res.status(201).json({ job });
};

exports.updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const data = pickJobFields(req.body);
  const merged = { ...job.toObject(), ...data };
  const rangeError = validateRanges(merged);
  if (rangeError) return res.status(400).json({ message: rangeError });

  job.set(data);
  await job.save();
  emitEvent('public', 'job:updated', job);
  emitEvent('admins', 'admin:job:changed', { action: 'updated', job });
  res.json({ job });
};

exports.deleteJob = async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  await Application.deleteMany({ job: job._id });
  emitEvent('public', 'job:deleted', { _id: job._id });
  emitEvent('admins', 'admin:job:changed', { action: 'deleted', job });
  res.json({ message: 'Job deleted' });
};
