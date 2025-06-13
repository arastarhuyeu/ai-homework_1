import { AuthUser } from '../entities/user/auth-user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
} 