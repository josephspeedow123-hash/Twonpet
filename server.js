const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, 'public')));

// Rooms storage: { roomCode: { dj: socketId, members: Set } }
const rooms = {};

function generateCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  // DJ creates a room
  socket.on('create-room', () => {
    const code = generateCode();
    rooms[code] = { dj: socket.id, members: new Set([socket.id]) };
    socket.join(code);
    socket.roomCode = code;
    socket.isDJ = true;
    socket.emit('room-created', { code, memberCount: 1 });
    console.log(`Room created: ${code} by ${socket.id}`);
  });

  // Member joins a room
  socket.on('join-room', (code) => {
    const room = rooms[code];
    if (!room) {
      socket.emit('error', 'Room introuvable. Vérifie le code.');
      return;
    }
    room.members.add(socket.id);
    socket.join(code);
    socket.roomCode = code;
    socket.isDJ = false;

    const count = room.members.size;
    io.to(code).emit('member-count', count);
    socket.emit('room-joined', { code, memberCount: count });
    console.log(`${socket.id} joined room ${code} (${count} members)`);
  });

  // DJ triggers a sound — broadcast to all in room
  socket.on('play-sound', (soundId) => {
    const code = socket.roomCode;
    if (!code || !rooms[code]) return;
    if (rooms[code].dj !== socket.id) return; // only DJ can broadcast
    io.to(code).emit('play-sound', soundId);
    console.log(`Sound "${soundId}" broadcast in room ${code}`);
  });

  // DJ stops sound
  socket.on('stop-sound', () => {
    const code = socket.roomCode;
    if (!code || !rooms[code]) return;
    if (rooms[code].dj !== socket.id) return;
    io.to(code).emit('stop-sound');
  });

  // Disconnect cleanup
  socket.on('disconnect', () => {
    const code = socket.roomCode;
    if (code && rooms[code]) {
      rooms[code].members.delete(socket.id);
      if (rooms[code].members.size === 0) {
        delete rooms[code];
        console.log(`Room ${code} deleted (empty)`);
      } else if (rooms[code].dj === socket.id) {
        // DJ left — notify members
        io.to(code).emit('dj-left');
        delete rooms[code];
      } else {
        io.to(code).emit('member-count', rooms[code].members.size);
      }
    }
    console.log('Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎺 Vuvuzela server running on port ${PORT}`);
});
