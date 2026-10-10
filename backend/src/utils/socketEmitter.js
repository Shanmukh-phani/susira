const { io } = require('socket.io-client');

let socket = null;

function initSocketEmitter() {
  const url = process.env.SOCKET_URL;
  if (!url) {
    console.warn('SOCKET_URL not set - real-time events are disabled');
    return;
  }
  socket = io(url, {
    auth: { serviceKey: process.env.SOCKET_SERVICE_KEY },
    reconnection: true,
    reconnectionDelay: 2000,
  });
  socket.on('connect', () => console.log(`Connected to socket server at ${url}`));
  socket.on('connect_error', (err) => console.warn(`Socket server unavailable (${err.message}) - retrying`));
}

/**
 * Broadcast an event through the socket server.
 * room: 'public' | 'admins' | `user:<id>`
 */
function emitEvent(room, event, data) {
  if (!socket || !socket.connected) return;
  socket.emit('service:broadcast', { room, event, data });
}

module.exports = { initSocketEmitter, emitEvent };
