import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ nullable: false, length: 255 })
  @Exclude()
  password: string;

  @Column({ name: 'is_active', default: true })
  @Exclude()
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at' })
  @Exclude()
  modifiedAt: Date;
}
