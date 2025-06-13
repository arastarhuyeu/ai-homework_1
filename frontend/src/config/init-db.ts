import { AppDataSource } from './database';
import { User } from '../entities/user/user.entity';
import { AuthUser } from '../entities/user/auth-user.entity';
import { Address } from '../entities/address/address.entity';
import { Geo } from '../entities/geo/geo.entity';
import { Company } from '../entities/company/company.entity';
import * as bcrypt from 'bcryptjs';

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Check if we already have data
    const userCount = await AppDataSource.getRepository(User).count();
    if (userCount > 0) {
      console.log('Database already initialized');
      return;
    }

    // Create initial admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminAuthUser = AppDataSource.getRepository(AuthUser).create({
      email: 'admin@example.com',
      password: hashedPassword,
    });
    await AppDataSource.getRepository(AuthUser).save(adminAuthUser);

    const adminUser = AppDataSource.getRepository(User).create({
      name: 'Admin User',
      email: 'admin@example.com',
      address: {
        street: 'Admin Street',
        suite: 'Suite 1',
        city: 'Admin City',
        zipcode: '12345',
        geo: {
          lat: '0',
          lng: '0',
        },
      },
      phone: '123-456-7890',
      website: 'admin.com',
      company: {
        name: 'Admin Company',
        catchPhrase: 'Admin Phrase',
        bs: 'Admin BS',
      },
    });
    await AppDataSource.getRepository(User).save(adminUser);

    console.log('Database initialized with admin user');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
} 