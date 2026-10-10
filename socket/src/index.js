require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const PORT = process.env.SOCKET_PORT || 5051;
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5180').split(',').map((o) => o.trim());

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', clients: io.engine.clientsCount }));
  }
  res.writeHead(404);
  res.end();
});

const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

/**
 * Connection types:
 *  - backend service: handshake.auth.serviceKey === SOCKET_SERVICE_KEY
 *  - logged-in user:  handshake.auth.token is a valid JWT (joins admins or user:<id>)
 *  - visitor:         no auth, receives public events only
 */
io.use((socket, next) => {
  const { serviceKey, token } = socket.handshake.auth || {};

  if (serviceKey) {
    if (serviceKey !== process.env.SOCKET_SERVICE_KEY) return next(new Error('Invalid service key'));
    socket.data.isService = true;
    return next();
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.user = { id: decoded.id, role: decoded.role };
    } catch {
      // Expired/invalid token: continue as a public visitor
    }
  }
  next();
});

io.on('connection', (socket) => {
  if (socket.data.isService) {
    console.log('Backend service connected');
    socket.on('service:broadcast', ({ room, event, data } = {}) => {
      if (!event) return;
      if (!room || room === 'public') io.emit(event, data);
      else io.to(room).emit(event, data);
    });
    socket.on('disconnect', () => console.log('Backend service disconnected'));
    return;
  }

  const { user } = socket.data;
  if (user) {
    socket.join(`user:${user.id}`);
    if (user.role === 'admin') socket.join('admins');
  }
  io.to('admins').emit('presence:count', { online: io.engine.clientsCount });

  socket.on('disconnect', () => {
    io.to('admins').emit('presence:count', { online: io.engine.clientsCount });
  });
});

server.listen(PORT, () => console.log(`Socket server running on http://localhost:${PORT}`));
