import { Router } from 'express';
import { login, logout, register } from '@/controllers/user.controller';
import { validate } from '@/middlewares/validate';
import { loginSchema, registerSchema } from '@/lib/zod';
import { auth } from '@/middlewares/auth';

const userRouter = Router();

userRouter.post('/register', validate(registerSchema), register);
userRouter.post('/login', validate(loginSchema), login);
userRouter.get('/logout', logout);
userRouter.post('/protected', auth, (_, res) => {
  res.status(200).json({
    success: true,
    message: 'Protected route accessed successfully',
  });
});

export { userRouter };
