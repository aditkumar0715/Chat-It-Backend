import mongoose, { Schema } from 'mongoose';
import { IUser } from '@/types/types';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    bio: {
      type: String,
      maxlength: 200,
      trim: true,
      default: "I'm Using Chat-It.",
    },
    avatar: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png',
    },
    password: {
      type: String,
      required: true,
    },
    friends: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    blocked: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', UserSchema);
