import { Document } from 'mongoose';
import z from 'zod';
import { userSchema } from '@/lib/zod';
import { messageSchema } from '@/lib/zod';
import { chatRoomSchema } from '@/lib/zod';

export type IUser = z.infer<typeof userSchema> & Document;
export type IMessage = z.infer<typeof messageSchema> & Document;
export type IChatRoom = z.infer<typeof chatRoomSchema> & Document;
