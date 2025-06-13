import { Request, Response } from 'express';
import { UserService } from '../core/user.core';

export class UserHandler {
  private userService = new UserService();

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.findById(id);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.update(id, req.body);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.userService.delete(id);
      
      if (!success) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user' });
    }
  }
} 