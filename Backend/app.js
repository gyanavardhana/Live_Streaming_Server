const express = require('express');
require('dotenv').config();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
    }
});
const port = 3000;

app.use(cors({
    origin: process.env.CLIENT_URL,
}));



let viewerCount = 0;
const messageList = [];

// Handle new connections
io.on('connection', (socket) => {
  viewerCount++;
  console.log('a user connected. Total viewer count:', viewerCount);
  socket.emit('viewer-count', viewerCount);

  // Handle disconnection
  socket.on('disconnect', () => {
    viewerCount--;
    console.log('A user disconnected. Total viewer count:', viewerCount);
    socket.emit('viewer-count', viewerCount);
  });

  // Handle joining as a streamer
  socket.on('join-as-streamer', (streamerId) => {
    socket.broadcast.emit('streamer-joined', streamerId);
    socket.emit('backfill-messages', messageList);
  });

  // Handle disconnecting as a streamer
  socket.on('disconnect-as-streamer', (streamerId) => {
    socket.broadcast.emit('streamer-disconnected', streamerId);
  });

  // Handle joining as a viewer
  socket.on('join-as-viewer', (viewerId) => {
    socket.broadcast.emit('viewer-connected', viewerId);
    socket.emit('backfill-messages', messageList);
  });

  // Handle adding a message to the live chat
  socket.on('add-message-to-live-chat', (messageText) => {
    const message = {
      text: messageText,
      date: new Date(),
    };

    messageList.push(message);
    socket.emit('new-message', message);
    socket.broadcast.emit('new-message', message);
  });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});