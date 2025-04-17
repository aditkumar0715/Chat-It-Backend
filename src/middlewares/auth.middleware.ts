import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { env } from '@/config/enviroment';

export const auth = (
  req: Request & { user?: JwtPayload | string },
  res: Response,
  next: NextFunction,
): void => {
  try {
    // get token from cookies
    const token = req.cookies.token;

    // check if token is present
    if (!token) {
      res.status(401).json({ success: false, message: 'authorization token not found' });
      return;
    }

    // verify token
    const decode = jwt.verify(token, env.JWT_SECRET as string);
    // attatch user info to request object
    req.user = decode; // Attach user info to request object
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ success: false, message: 'Invalid token' });
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
};
