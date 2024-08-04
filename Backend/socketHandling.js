// socketHandler.js

module.exports = (io, logger) => {
    let viewerCount = 0;
    const messageList = [];
  
    io.on('connection', (socket) => {
      viewerCount++;
      logger.info(`A user connected. Total viewer count: ${viewerCount}`);
      socket.emit('viewer-count', viewerCount);
  
      // Handle disconnection
      socket.on('disconnect', () => {
        viewerCount--;
        logger.info(`A user disconnected. Total viewer count: ${viewerCount}`);
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
  };
  