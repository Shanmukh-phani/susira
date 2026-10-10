const User = require('../models/User');

async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set - default admin was not created');
    return;
  }
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') console.warn(`${email} exists but is not an admin account`);
    return;
  }
  await User.create({ name: process.env.ADMIN_NAME || 'Admin', email, password, role: 'admin' });
  console.log(`Default admin created: ${email}`);
}

module.exports = ensureAdmin;
