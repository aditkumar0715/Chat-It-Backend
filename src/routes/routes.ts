import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMyDetails,
  addFriend,
  getAllFriends,
  getUserDetails,
  updateMyDetails,
  deleteMyAccount,
} from '@/controllers/user.controller';
import { findOrCreateRoom } from '@/controllers/chatRoom.controller';
import { validate } from '@/middlewares/validate.middleware';
import { loginSchema, registerSchema, _idSchema } from '@/lib/zod';
import { auth } from '@/middlewares/auth.middleware';

// User Routes
const userRouter = Router();
userRouter.post('/register', validate(registerSchema), register);
userRouter.post('/login', validate(loginSchema), login);
userRouter.get('/logout', logout);
userRouter.get('/me', auth, getMyDetails);
userRouter.patch('/addFriend', auth, addFriend);
userRouter.get('/allFriends', auth, getAllFriends);
userRouter.get('/user', getUserDetails); // get user by id or username
userRouter.patch('/update', auth, updateMyDetails);
userRouter.delete('/deleteAccount', auth, deleteMyAccount);

// Chat Room Routes
const chatRoomRouter = Router();
chatRoomRouter.post('/findOrCreate', auth, validate(_idSchema), findOrCreateRoom);

// Exporting all routers
export { userRouter };
export { chatRoomRouter };
