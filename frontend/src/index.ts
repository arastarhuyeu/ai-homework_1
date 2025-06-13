import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { UserHandler } from './handlers/user.handler';
import { AuthHandler } from './handlers/auth.handler';
import { authMiddleware } from './middleware/auth.middleware';
import { initializeDatabase } from './config/init-db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Controllers
const userHandler = new UserHandler();
const authHandler = new AuthHandler();

// Auth routes
app.post('/auth/register', (req, res) => authHandler.register(req, res));
app.post('/auth/login', (req, res) => authHandler.login(req, res));
app.get('/auth/me', authMiddleware, (req, res) => authHandler.getCurrentUser(req, res));

// User routes
app.get('/users', authMiddleware, (req, res) => userHandler.getAllUsers(req, res));
app.get('/users/:id', authMiddleware, (req, res) => userHandler.getUserById(req, res));
app.post('/users', authMiddleware, (req, res) => userHandler.createUser(req, res));
app.put('/users/:id', authMiddleware, (req, res) => userHandler.updateUser(req, res));
app.delete('/users/:id', authMiddleware, (req, res) => userHandler.deleteUser(req, res));

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error during application startup:', error);
    process.exit(1);
  }); 