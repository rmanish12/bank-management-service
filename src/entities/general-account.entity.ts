import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity('general_accounts')
export class GeneralAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserAccount, { nullable: false })
  @JoinColumn({ name: 'account_id' })
  account: UserAccount;

  @Column()
  balance: number;
}
