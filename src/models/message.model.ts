import mongoose, { Schema } from 'mongoose';
import { IMessage } from '@/types/types';

const messageSchema = new Schema<IMessage>(
  {
    chatRoom: {
      type: Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'image'],
      default: 'text',
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    seenBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
  },
  { timestamps: true },
);

export const Message = mongoose.model('Message', messageSchema);
