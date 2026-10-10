const express = require('express');
const { protect, requireRole } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');
const auth = require('../controllers/authController');
const jobs = require('../controllers/jobController');
const applications = require('../controllers/applicationController');
const users = require('../controllers/userController');
const contact = require('../controllers/contactController');
const stats = require('../controllers/statsController');

const router = express.Router();
const admin = [protect, requireRole('admin')];
const candidate = [protect, requireRole('candidate')];

// Auth
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.post('/auth/admin/login', auth.adminLogin);
router.get('/auth/me', protect, auth.me);
router.put('/auth/password', protect, auth.changePassword);

// Jobs (public)
router.get('/jobs', jobs.listJobs);
router.get('/jobs/filters', jobs.filterOptions);
// Jobs (admin) - declared before /jobs/:id so "admin" is not treated as an id
router.get('/jobs/admin/all', ...admin, jobs.adminListJobs);
router.get('/jobs/:id', jobs.getJob);
router.post('/jobs', ...admin, jobs.createJob);
router.put('/jobs/:id', ...admin, jobs.updateJob);
router.delete('/jobs/:id', ...admin, jobs.deleteJob);

// Applications
router.post('/applications/job/:jobId', ...candidate, uploadResume, applications.apply);
router.get('/applications/me', ...candidate, applications.myApplications);
router.get('/applications/me/job-ids', ...candidate, applications.myAppliedJobIds);
router.delete('/applications/me/:id', ...candidate, applications.withdraw);
router.get('/applications', ...admin, applications.adminList);
router.get('/applications/:id', ...admin, applications.adminGet);
router.patch('/applications/:id/status', ...admin, applications.updateStatus);

// Candidate profile
router.put('/users/profile', protect, users.updateProfile);
router.post('/users/resume', ...candidate, uploadResume, users.uploadResume);
router.get('/users/candidates', ...admin, users.listCandidates);
router.get('/users/candidates/:id', ...admin, users.getCandidate);

// Contact / enquiries
router.post('/contact', contact.submit);
router.get('/contact', ...admin, contact.list);
router.patch('/contact/:id/read', ...admin, contact.markRead);
router.delete('/contact/:id', ...admin, contact.remove);

// Stats
router.get('/stats/public', stats.publicStats);
router.get('/stats/admin', ...admin, stats.adminStats);

module.exports = router;
