const User = require('../models/User');
const { signToken } = require('../middleware/auth');
const { emitEvent } = require('../utils/socketEmitter');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function authResponse(res, user, status = 200) {
  res.status(status).json({ token: signToken(user), user });
}

exports.register = async (req, res) => {
  const { name, email, password, phone, location } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Please enter a valid email' });
  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: 'An account with this email already exists' });

  const user = await User.create({ name, email, password, phone, location, role: 'candidate' });
  emitEvent('admins', 'candidate:new', { _id: user._id, name: user.name, email: user.email });
  authResponse(res, user, 201);
};

async function loginWithRole(req, res, role) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  if (user.role !== role) {
    const message =
      role === 'admin'
        ? 'This account does not have admin access'
        : 'Admins should sign in from the Admin Login page';
    return res.status(403).json({ message });
  }
  authResponse(res, user);
}

exports.login = (req, res) => loginWithRole(req, res, 'candidate');
exports.adminLogin = async (req, res) => {
  const { username, email, password } = req.body || {};
  const identifier = String(username || email || '').trim();
  if (!identifier || !password) return res.status(400).json({ message: 'Username and password are required' });

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier.toLowerCase() }],
  }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  if (user.role !== 'admin') return res.status(403).json({ message: 'This account does not have admin access' });
  authResponse(res, user);
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }
  if (String(newPassword).length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated successfully' });
};
