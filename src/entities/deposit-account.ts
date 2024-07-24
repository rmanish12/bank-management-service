import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('deposit_accounts')
export class DepositAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserAccount, { nullable: false })
  @JoinColumn({ name: 'account_id' })
  account: UserAccount;

  @Column({ name: 'start_date', nullable: false, type: 'date' })
  startDate: Date;

  @Column({ name: 'maturity_date', nullable: false, type: 'date' })
  maturityDate: Date;

  @Column({ name: 'start_balance', nullable: false, type: 'real' })
  startBalance: number;

  @Column({ name: 'maturity_balance', nullable: false, type: 'real' })
  maturityBalance: number;

  @Column({ name: 'interest_rate', nullable: false, type: 'real' })
  interestRate: number;
}
