import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { AuthUser } from '../models/user/auth-user.model';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-256-bit-secret-key-here-make-it-long-and-secure') as { email: string };
    const authUserRepository = AppDataSource.getRepository(AuthUser);
    const authUser = await authUserRepository.findOne({ where: { email: decoded.email } });

    if (!authUser) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = authUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}; 