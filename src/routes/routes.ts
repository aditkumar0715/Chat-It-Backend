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
import { validate } from '@/middlewares/validate.middleware';
import { loginSchema, registerSchema, userSchema } from '@/lib/zod';
import { auth } from '@/middlewares/auth.middleware';

// User Routes
const userRouter = Router();
userRouter.post('/register', validate(registerSchema), register);
userRouter.post('/login', validate(loginSchema), login);
userRouter.get('/logout', logout);
userRouter.get('/me', auth, getMyDetails);
userRouter.patch('/addFriend', auth, addFriend);
userRouter.get('/allFriends', auth, getAllFriends);
userRouter.get('/user/:username', auth, getUserDetails);
userRouter.patch('/update', auth, updateMyDetails);
userRouter.delete('/deleteAccount', auth, deleteMyAccount);

export { userRouter };
