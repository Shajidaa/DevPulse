import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync } from './error.middleware';


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        role: 'contributor' | 'maintainer';
      };
    }
  }
}

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith('Bearer ')) {
  throw new Error('Unauthorized: Missing or malformed token');
}

const token = authHeader.split(' ')[1];

  if (!token) {
    throw new Error( 'Unauthorized: Missing token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };
    next();
  } catch (error) {
    throw new Error('Unauthorized: Invalid or expired token');
  }
});

export const restrictTo = (...roles: ('contributor' | 'maintainer')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new Error('Forbidden: You do not have permission to perform this action');
    }
    next();
  };
};