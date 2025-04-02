import {Types} from 'mongoose';
import z from 'zod';

export const objectIdSchema = z.custom<Types.ObjectId>(
  (value) => Types.ObjectId.isValid(value),
  { message: 'Invalid ObjectId' },
);

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Minimum 2 characters required in name')
    .max(20, 'Maximum 20 characters allowed in name')
    .trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  username: z
    .string()
    .min(2, 'Minimum 2 characters required in username')
    .max(20, 'Maximum 20 characters allowed in username')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Minimum 6 characters required in password')
    .max(50, 'Maximum 50 characters allowed in password'),
  confirmPassword: z
    .string()
    .min(6, 'Minimum 6 characters required in confirm password')
    .max(50, 'Maximum 50 characters allowed in confirm password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'password and confirmPassword do not match'
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z
    .string()
    .min(6, 'Minimum 6 characters required in password')
    .max(50, 'Maximum 50 characters allowed in password'),
});

export const userSchema = z.object({
  name: z
    .string()
    .min(2, 'Minimum 2 characters required in name')
    .max(20, 'Maximum 20 characters allowed in name')
    .trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  username: z
    .string()
    .min(2, 'Minimum 2 characters required in username')
    .max(20, 'Maximum 20 characters allowed in username')
    .trim()
    .toLowerCase(),
  age: z
    .number()
    .min(0, 'Age must be a positive number')
    .max(120, 'Age must be less than 120')
    .optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  bio: z.string().max(200, 'Maximum 200 characters allowed in bio'),
  avatar: z.string().url('Invalid URL for avatar').optional(),
  password: z
    .string()
    .min(6, 'Minimum 6 characters required in password')
    .max(50, 'Maximum 50 characters allowed in password'),
  friends: z.array(objectIdSchema).default([]),
  blocked: z.array(objectIdSchema).optional(),
});

export const messageSchema = z.object({
  chatRoom: objectIdSchema,
  sender: objectIdSchema,
  messageType: z.enum(['text', 'image']).default('text'),
  content: z.string().trim().min(1, 'message content cannot be empty'),
  seenBy: z.array(objectIdSchema).optional(),
});

export const chatRoomSchema = z.object({
  chatName: z.string().trim().optional(),
  participants: z.array(objectIdSchema).min(2, 'At least 2 participants required'),
  isGroupChat: z.boolean().default(false),
  lastMessage: objectIdSchema.optional(),
});
