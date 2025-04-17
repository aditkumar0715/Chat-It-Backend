import mongoose from 'mongoose';
import { env } from '@/config/enviroment';

export const connectDb = async () => {
  const DB_URI = env.DB_URI;
  if (!DB_URI) {
    throw new Error('Database URI not found');
  }
  mongoose
    .connect(`${DB_URI}/ChatIt`)
    .then(() => {
      console.log('DB connected successfully');
    })
    .catch((error) => {
      console.error('DB connection error:', error);
      process.exit(1);
    });
};
