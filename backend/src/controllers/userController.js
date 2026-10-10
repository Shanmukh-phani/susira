const User = require('../models/User');
const Application = require('../models/Application');
const { toPublicUrl } = require('../middleware/upload');
const { escapeRegex, toList, paginate } = require('../utils/helpers');

const PROFILE_FIELDS = ['name', 'phone', 'location', 'headline', 'currentCompany', 'education', 'about'];

exports.updateProfile = async (req, res) => {
  const body = req.body || {};
  const updates = {};
  PROFILE_FIELDS.forEach((f) => {
    if (body[f] !== undefined) updates[f] = String(body[f]).trim();
  });
  if (updates.name === '') return res.status(400).json({ message: 'Name cannot be empty' });
  if (body.experienceYears !== undefined) {
    const years = Number(body.experienceYears);
    if (!Number.isFinite(years) || years < 0) {
      return res.status(400).json({ message: 'Experience must be a positive number' });
    }
    updates.experienceYears = years;
  }
  if (body.skills !== undefined) updates.skills = toList(body.skills);

  const user = await User.findByIdAndUpdate(req.user._id, updates, { returnDocument: 'after', runValidators: true });
  res.json({ user, message: 'Profile updated' });
};

exports.uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Please choose a resume file' });
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { resume: { url: toPublicUrl(req.file), originalName: req.file.originalname, uploadedAt: new Date() } },
    { returnDocument: 'after' }
  );
  res.json({ user, message: 'Resume uploaded successfully' });
};

// ----- Admin -----

exports.listCandidates = async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = { role: 'candidate' };
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q.trim()), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { skills: rx }, { location: rx }, { phone: rx }];
  }
  const [candidates, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);
  const ids = candidates.map((c) => c._id);
  const counts = await Application.aggregate([
    { $match: { candidate: { $in: ids } } },
    { $group: { _id: '$candidate', count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
  res.json({
    candidates: candidates.map(({ password, ...c }) => ({ ...c, applicationsCount: countMap[String(c._id)] || 0 })),
    total,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
    limit,
  });
};

exports.getCandidate = async (req, res) => {
  const candidate = await User.findOne({ _id: req.params.id, role: 'candidate' });
  if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
  const applications = await Application.find({ candidate: candidate._id })
    .populate('job', 'title company location')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ candidate, applications });
};
