import { Request, Response } from 'express';
import { AuthService } from '../core/auth.core';

export class AuthHandler {
  private authService = new AuthService();

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const authUser = await this.authService.register(name, email, password);
      res.status(201).json(authUser);
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already registered') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error registering user' });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);
      res.json({ token });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error logging in' });
      }
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      const user = await this.authService.getCurrentUser(req.user.email);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching current user' });
    }
  }
} 