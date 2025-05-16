
// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const userSockets = {}; // Map user_id => socket

// Make io accessible in app.locals
app.locals.io = io;
app.locals.userSockets = userSockets;

// On connection, map user to socket
io.on('connection', (socket) => {
  console.log('🟢 New socket connected');

  socket.on('register', (user_id) => {
    userSockets[user_id] = socket.id;
    console.log(`✅ Socket registered for user ${user_id}`);
  });

  socket.on('disconnect', () => {
    for (const user_id in userSockets) {
      if (userSockets[user_id] === socket.id) {
        delete userSockets[user_id];
        console.log(`❌ Socket disconnected for user ${user_id}`);
        break;
      }
    }
  });
});

// Replace app.listen() with server.listen()
server.listen(3000, () => {
  console.log('🚀 PrizeLobby server running at http://localhost:3000');
});
