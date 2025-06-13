import { AppDataSource } from '../config/database';
import { AuthUser } from '../entities/user/auth-user.entity';
import { User } from '../entities/user/user.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  private authUserRepository = AppDataSource.getRepository(AuthUser);
  private userRepository = AppDataSource.getRepository(User);

  async register(name: string, email: string, password: string): Promise<AuthUser> {
    const existingUser = await this.authUserRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const authUser = new AuthUser();
    authUser.name = name;
    authUser.email = email;
    authUser.password = hashedPassword;

    return this.authUserRepository.save(authUser);
  }

  async login(email: string, password: string): Promise<string> {
    const authUser = await this.authUserRepository.findOne({ where: { email } });
    if (!authUser) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, authUser.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return jwt.sign(
      { email: authUser.email },
      process.env.JWT_SECRET || 'your-256-bit-secret-key-here-make-it-long-and-secure',
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );
  }

  async getCurrentUser(email: string): Promise<User | null> {
    const authUser = await this.authUserRepository.findOne({
      where: { email },
      relations: ['user'],
    });
    return authUser?.user || null;
  }
} 