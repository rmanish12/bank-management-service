import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountType } from './account-type.entity';
import { User } from './user.entity';

@Entity('user_accounts')
export class UserAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_number' })
  accountNumber: number;

  @OneToOne(() => AccountType, { nullable: false })
  @JoinColumn({ name: 'account_type' })
  accountType: AccountType;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'closed_at' })
  closedAt: Date;
}
