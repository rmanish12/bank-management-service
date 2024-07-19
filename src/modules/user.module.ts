import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { UserDetails } from 'src/entities/user-details.entity';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserDetails])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
