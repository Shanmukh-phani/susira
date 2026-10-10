const multer = require('multer');

function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Resume must be smaller than 5 MB' : err.message;
    return res.status(400).json({ message });
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid identifier' });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Record';
    const message = field === 'email' ? 'An account with this email already exists' : 'Duplicate record';
    return res.status(409).json({ message });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
}

module.exports = { notFound, errorHandler };
