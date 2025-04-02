import { User } from '@/models/user.model';
import { Request, Response } from 'express';
import { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '@/types/types';
import { env } from '@/config/enviroment';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, username, password, confirmPassword } = req.body;

    // Validate input
    // if (!name || !email || !username || !password || !confirmPassword) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'All fields are required',
    //   });
    // }

    // match password and confirm password
    // if (password !== confirmPassword) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'Passwords do not match',
    //   });
    // }

    // Check if user already exists
    const user: Document | null = await User.findOne({ email });
    if (user) {
      res.status(400).json({
        success: false,
        error: 'User already exists',
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = await User.create({ name, email, username, password: hashedPassword });
    if (!newUser) res.status(400).json({ success: false, error: 'User not created' });

    // Return success response
    res.status(201).json({ success: true, message: 'User registered successfully' });
    return;
  } catch (error) {
    console.log('Error while registering the user: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ success: false, error: errorMessage });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        error: 'User does not exist, Please register first',
      });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        error: 'Invalid credentials',
      });
      return;
    }

    // Generate JWT token
    const payload = { id: user._id };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRY || '1h') as SignOptions['expiresIn'],
      algorithm: 'HS256',
    };
    if (!secret) {
      res.status(500).json({
        success: false,
        error: 'JWT secret not found',
      });
      return;
    }
    const token = jwt.sign(payload, secret, options);

    if (!token) {
      res.status(500).json({
        success: false,
        error: 'Error generating token',
      });
      return;
    }

    user.password = ''; // Remove password from user object
    // console.log({ token, user });

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production', // Set to true if using HTTPS
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    // Return success response
    res.status(200).json({ success: true, message: 'User logged in successfully', data: user });
    return;
  } catch (error) {
    console.log('Error while registering the user: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ success: false, error: errorMessage });
    return;
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Login first',
      });
      return;
    }
    // Clear the cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production', // Set to true if using HTTPS
      sameSite: 'strict',
    });

    // Return success response
    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.log('Error while logging out the user: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const getMyDetails = async (
  req: Request & { user?: { id: string } },
  res: Response,
): Promise<void> => {
  try {
    const currentUserId = req.user?.id;

    // Find user by ID
    const user: IUser | null = await User.findById(currentUserId).select('-password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'fetched user',
      data: user,
    });
  } catch (error) {
    console.log('Error while getting the user: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const addFriend = async (
  req: Request & { user?: { id: string } },
  res: Response,
): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    const { username } = req.body;

    if (!username) {
      res.status(400).json({
        success: false,
        message: 'username is required',
      });
      return;
    }

    // find current user using currentUserId
    const currentUser: IUser | null = await User.findById(currentUserId);
    if (!currentUser) {
      res.status(400).json({
        success: false,
        message: 'current user not found',
      });
      return;
    }

    // Find user using userId
    const user: IUser | null = await User.findOne({ username });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'username do not exist',
      });
      return;
    }

    // add current user to other user's friend list
    const updatedUser = await User.findOneAndUpdate(
      { username },
      {
        $addToSet: { friends: currentUser._id },
      },
      { new: true },
    ).select('-_id username name');

    // Add user to currentUser's friends list
    const updatedCurrentUser = await User.findByIdAndUpdate(
      currentUserId,
      {
        $addToSet: { friends: user._id },
      },
      { new: true },
    ).select('_id username name friends');

    // success response
    res.status(200).json({
      success: true,
      message: 'Friend added successfully',
      data: { friend: updatedUser, currentUser: updatedCurrentUser },
    });
  } catch (error) {
    console.log('Error while adding friend: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const getAllFriends = async (
  req: Request & { user?: { id: string } },
  res: Response,
): Promise<void> => {
  try {
    const currentUserId = req.user?.id;

    // find user by id
    const user: IUser | null = await User.findById(currentUserId)
      .populate('friends', {
        _id: 1,
        username: 1,
        name: 1,
        avatar: 1,
      })
      .select('friends -_id');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'fetched all friends',
      data: user.friends,
    });
  } catch (error) {
    console.log('Error while getting all friends: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    if (!username) {
      res.status(400).json({
        success: false,
        message: 'username is required',
      });
      return;
    }
    // Find user by username

    const user = await User.findOne({ username }).select(
      '-password -friends -blocked -updatedAt -__v',
    );
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    // Return success response
    res.status(200).json({
      success: true,
      message: 'fetched user details',
      data: user,
    });
  } catch (error) {
    console.log('Error while getting user details: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const updateMyDetails = async (
  req: Request & { user?: { id: string } },
  res: Response,
): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    const { name, age, gender, bio, avatar } = req.body;

    // find user by id and update
    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      currentUserId,
      { name, age, gender, bio, avatar },
      { new: true, runValidators: true, select: '-password -friends -blocked -__v' },
    );
    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'Unable to update User Details',
      });
      return;
    }

    // success response
    res.status(200).json({
      success: true,
      message: 'User details updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.log('Error while updating user details: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const deleteMyAccount = async (
  req: Request & { user?: { id: string } },
  res: Response,
): Promise<void> => {
  try {
    const currentUserId = req.user?.id;

    // find user by id and delete
    const deletedUser = await User.findByIdAndDelete(currentUserId);
    if (!deletedUser) {
      res.status(404).json({
        success: false,
        message: 'Unable to delete User Account',
      });
      return;
    }
    // Clear the cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production', // Set to true if using HTTPS
      sameSite: 'strict',
    });
    // Return success response
    res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
    });
  } catch (error) {
    console.log('Error while deleting user account: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
};
