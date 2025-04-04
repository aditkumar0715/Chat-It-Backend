import { Server, Socket } from 'socket.io';
import { registerChatHandlers } from './chatEvents';

export const initSocket = (io: Server) => {
  // Handle socket connection
  io.on('connection', (socket: Socket) => {
    console.log('A user connected', socket.id);
    // Register chat handlers
    registerChatHandlers(io, socket);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected', socket.id);
    });
  });
};
