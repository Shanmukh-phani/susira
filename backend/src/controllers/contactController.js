const Contact = require('../models/Contact');
const { emitEvent } = require('../utils/socketEmitter');
const { paginate } = require('../utils/helpers');

exports.submit = async (req, res) => {
  const { name, email, phone, company, type, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }
  const contact = await Contact.create({ name, email, phone, company, type, subject, message });
  emitEvent('admins', 'contact:new', contact);
  res.status(201).json({ message: 'Thank you! Our team will get back to you shortly.' });
};

exports.list = async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.unread === 'true') filter.isRead = false;
  const [messages, total, unread] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
    Contact.countDocuments({ isRead: false }),
  ]);
  res.json({ messages, total, unread, page, pages: Math.max(Math.ceil(total / limit), 1), limit });
};

exports.markRead = async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: req.body?.isRead ?? true }, { returnDocument: 'after' });
  if (!contact) return res.status(404).json({ message: 'Message not found' });
  res.json({ contact });
};

exports.remove = async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return res.status(404).json({ message: 'Message not found' });
  res.json({ message: 'Message deleted' });
};
