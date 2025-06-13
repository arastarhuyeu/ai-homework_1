import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Address } from '../address/address.entity';
import { Company } from '../company/company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  address: Address;

  @Column()
  phone: string;

  @Column()
  website: string;

  @OneToOne(() => Company, { cascade: true })
  @JoinColumn()
  company: Company;
} 