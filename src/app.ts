import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from '@/config/enviroment';

// Import routes
import {userRouter} from '@/routes/routes';

const app = express();


// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(helmet());


// Routes

// user routes
app.use('/api/v1', userRouter);


// Health check route
app.use('/', (req, res) => {
  res.status(200).json({
    success: true,
    messsage: 'Server is ready',
  });
});




export default app;

