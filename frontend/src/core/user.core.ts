import { AppDataSource } from '../config/database';
import { User } from '../entities/user/user.entity';
import { Address } from '../entities/address/address.entity';
import { Company } from '../entities/company/company.entity';
import { Geo } from '../entities/geo/geo.entity';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private addressRepository = AppDataSource.getRepository(Address);
  private companyRepository = AppDataSource.getRepository(Company);
  private geoRepository = AppDataSource.getRepository(Geo);

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['address', 'address.geo', 'company'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['address', 'address.geo', 'company'],
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = new User();
    Object.assign(user, userData);

    if (userData.address) {
      const address = new Address();
      Object.assign(address, userData.address);

      if (userData.address.geo) {
        const geo = new Geo();
        Object.assign(geo, userData.address.geo);
        address.geo = await this.geoRepository.save(geo);
      }

      user.address = await this.addressRepository.save(address);
    }

    if (userData.company) {
      const company = new Company();
      Object.assign(company, userData.company);
      user.company = await this.companyRepository.save(company);
    }

    return this.userRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    Object.assign(user, userData);

    if (userData.address) {
      if (user.address) {
        Object.assign(user.address, userData.address);
        if (userData.address.geo && user.address.geo) {
          Object.assign(user.address.geo, userData.address.geo);
          await this.geoRepository.save(user.address.geo);
        }
        await this.addressRepository.save(user.address);
      } else {
        const address = new Address();
        Object.assign(address, userData.address);
        if (userData.address.geo) {
          const geo = new Geo();
          Object.assign(geo, userData.address.geo);
          address.geo = await this.geoRepository.save(geo);
        }
        user.address = await this.addressRepository.save(address);
      }
    }

    if (userData.company) {
      if (user.company) {
        Object.assign(user.company, userData.company);
        await this.companyRepository.save(user.company);
      } else {
        const company = new Company();
        Object.assign(company, userData.company);
        user.company = await this.companyRepository.save(company);
      }
    }

    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;

    await this.userRepository.remove(user);
    return true;
  }
} 