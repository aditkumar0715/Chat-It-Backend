import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next(); // Proceed if validation passes
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.errors, // Structured error messages from Zod
        });
        return;
      }
      // Optionally, handle other types of errors here
      res.status(500).json({
        success: false,
        error: 'Unknown error occurred',
      });
      return;
    }
  };
