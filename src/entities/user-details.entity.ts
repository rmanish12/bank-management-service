import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { USER_GENDER } from 'src/utils/enums';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_details' })
export class UserDetails {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 50, nullable: false })
  email: string;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: USER_GENDER,
    default: USER_GENDER.MALE,
  })
  gender: USER_GENDER;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @CreateDateColumn({ name: 'created_at' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at' })
  @Exclude()
  modifiedAt: Date;
}
