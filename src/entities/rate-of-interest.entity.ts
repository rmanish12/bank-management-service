import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('rate_of_interest')
export class RateOfInterest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'min_days', nullable: false, unique: true })
  minimumDays: number;

  @Column({ name: 'max_days', nullable: false, unique: true })
  maximumDays: number;

  @Column({ name: 'interest_rate', type: 'real' })
  interestRate: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_modified_at' })
  lastModifiedAt: Date;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'last_modified_by' })
  lastModifiedBy: User;
}
