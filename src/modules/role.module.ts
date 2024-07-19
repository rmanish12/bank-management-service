import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from 'src/controllers/role.controller';
import { Role } from 'src/entities/role.entity';
import { RoleService } from 'src/services/role.service';
import { UserModule } from './user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), UserModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
