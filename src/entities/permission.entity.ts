import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 50 })
  name: string;

  @Column({ length: 255 })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Date;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'last_modified_by' })
  lastModifiedBy: User;
}
