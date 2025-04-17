import { Request, Response } from 'express';
import { ChatRoom } from '../models/chatRoom.model';
import { User } from '@/models/user.model';

export const findOrCreateRoom = async (
  req: Request & { user?: { id: string } },
  res: Response,
): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    const { id } = req.body; // id of the other user

    // can not create a chat room with yourself
    if (currentUserId === id) {
      res
        .status(400)
        .json({ success: false, message: 'You cannot create a chat room with yourself' });
      return;
    }

    // Check if the other user exists
    const user = await User.findById(id);
    if (!user) {
      res.status(400).json({ success: false, message: 'User with given userId not found' });
      return;
    }

    // This is important to ensure that the same room is created for the same pair of users
    const sortedUserIds = [currentUserId, id].sort();
    // console.log(sortedUserIds);

    // Check if the chat room already exists
    const chatRoom = await ChatRoom.findOne({ participants: sortedUserIds, isGroupChat: false });
    if (chatRoom) {
      res
        .status(200)
        .json({ success: true, message: 'room already exists and returned', data: chatRoom });
      return;
    }

    // Create a new chat room
    const newChatRoom = await ChatRoom.create({
      participants: sortedUserIds,
      isGroupChat: false,
    });
    if (!newChatRoom) {
      res.status(400).json({ success: false, message: 'Chat room creation failed' });
      return;
    }

    // return success response
    res
      .status(200)
      .json({ success: true, message: 'room created successfully', data: newChatRoom });
    return;
  } catch (error) {
    console.error('Error finding or creating chat room:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
    return;
  }
};
