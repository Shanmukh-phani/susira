const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const Contact = require('../models/Contact');

exports.publicStats = async (req, res) => {
  const [openJobs, locations] = await Promise.all([
    Job.countDocuments({ status: 'open' }),
    Job.distinct('location', { status: 'open' }),
  ]);
  res.json({ openJobs, locations: locations.length });
};

exports.adminStats = async (req, res) => {
  const [totalJobs, openJobs, candidates, applications, unreadMessages, byStatus, recentApplications, topJobs] =
    await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'open' }),
      User.countDocuments({ role: 'candidate' }),
      Application.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Application.find()
        .populate('job', 'title location')
        .populate('candidate', 'name email')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Job.find().sort({ applicationsCount: -1, createdAt: -1 }).limit(5).select('title location applicationsCount status').lean(),
    ]);

  res.json({
    totals: { totalJobs, openJobs, candidates, applications, unreadMessages },
    byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
    recentApplications,
    topJobs,
  });
};
