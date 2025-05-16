// services/socket.js

const socketIO = require('socket.io');

module.exports = function(server) {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', socket => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('register-user', userId => {
      socket.join(`user_${userId}`);
      console.log(`📡 Registered user ${userId} to room user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};