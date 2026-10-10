require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes');
const ensureAdmin = require('./seed/ensureAdmin');
const { initSocketEmitter } = require('./utils/socketEmitter');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5050;

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5180').split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await ensureAdmin();
    initSocketEmitter();
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();
