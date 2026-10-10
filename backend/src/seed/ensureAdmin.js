const User = require('../models/User');

async function ensureAdmin() {
  const username = (process.env.ADMIN_USERNAME || '').trim();
  const email = (process.env.ADMIN_EMAIL || (username ? `${username}@admin.susira.in` : '')).toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if ((!username && !email) || !password) {
    console.warn('ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD not set - default admin was not created');
    return;
  }

  if (username) {
    const byUsername = await User.findOne({ username });
    if (byUsername) {
      if (byUsername.role !== 'admin') console.warn(`Username ${username} exists but is not an admin account`);
      return;
    }
    const adminByEmail = await User.findOne({ email, role: 'admin' });
    if (adminByEmail) {
      adminByEmail.username = username;
      await adminByEmail.save();
      console.log(`Admin username set: ${username}`);
      return;
    }
  }

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') console.warn(`${email} exists but is not an admin account`);
    return;
  }
  await User.create({
    name: process.env.ADMIN_NAME || 'Admin',
    email,
    ...(username && { username }),
    password,
    role: 'admin',
  });
  console.log(`Default admin created: ${username || email}`);
}

module.exports = ensureAdmin;
