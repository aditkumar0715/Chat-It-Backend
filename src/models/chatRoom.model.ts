import mongoose, { Schema } from 'mongoose';
import { IChatRoom } from '@/types/types';

const chatRoomSchema = new Schema<IChatRoom>(
  {
    chatName: {
      type: String,
      trim: true,
    },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: true,
      minlength: 2,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true },
);

export const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
