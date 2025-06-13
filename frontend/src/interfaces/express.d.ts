import { AuthUser } from '../models/user/auth-user.model';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
} 