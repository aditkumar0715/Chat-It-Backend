import { Socket, Server } from 'socket.io';
import { chatMessage, fetchMessages, joinRoom, leaveRoom } from './chat.controller';

export const registerChatHandlers = (io: Server, socket: Socket) => {
  // Join a one-on-one chat room
  socket.on('joinRoom', (data) => joinRoom(socket, data));

  // Handle sending messages
  socket.on('chatMessage', (data) => chatMessage(io, socket, data));

  // fetch past messages for a room when a user reconnects or joins the room.
  socket.on('fetchMessages', (data) => fetchMessages(socket, data));

  // Handle leave room event
  socket.on('leaveRoom', (data) => leaveRoom(socket, data));
};
