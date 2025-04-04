import { Message } from '@/models/message.model';
import { ChatRoom } from '@/models/chatRoom.model';
import { User } from '@/models/user.model';
import { Server, Socket } from 'socket.io';

// join room handler
export const joinRoom = (socket: Socket, data: { userId: string; roomId: string }) => {
  console.log(data);
  socket.join(data.roomId);
  console.log(`User: ${data.userId} joined room: ${data.roomId}`);
};

// chatMessage handler
export const chatMessage = async (
  io: Server,
  socket: Socket,
  data: { roomId: string; message: string; senderId: string },
) => {
  console.log(
    `Message from ${data.senderId} in room : ${data.roomId} and message : ${data.message}`,
  );
  try {
    // Store the message in the database
    const savedMessage = await Message.create(
      {
        chatRoom: data.roomId,
        sender: data.senderId,
        content: data.message,
      },
      { runValidators: true },
    );

    if (!savedMessage) {
      socket.emit('error', { success: false, message: 'Error saving message' });
    }

    // broadcast the message to everyone in the room (including sender)
    io.to(data.roomId).emit('message', {
      success: true,
      data: savedMessage,
    });
  } catch (error) {
    console.log('Error saving message:', error);
    socket.emit('error', { success: false, message: 'Error saving message' });
  }
};

export const fetchMessages = async (socket: Socket, data: { roomId: string }) => {
  try {
    const messages = await Message.find({ chatRoom: data.roomId })
      .populate('sender', 'name avatar') // Populate sender details
      .sort({ createdAt: -1 })
      .limit(50); // Fetch the last 50 messages

    // validate if messages exist
    if (!messages) {
      socket.emit('error', { success: false, message: 'No messages found' });
      return;
    }

    socket.emit('pastMessages', { success: true, data: messages });
  } catch (error) {
    console.log('Error fetching messages:', error);
    socket.emit('error', { success: false, message: 'Error fetching messages' });
  }
};

// leave room handler
export const leaveRoom = (socket: Socket, data: { userId:string, roomId: string }) => {
  socket.leave(data.roomId);
  console.log(`User: ${data.userId} left room: ${data.roomId}`);
};
