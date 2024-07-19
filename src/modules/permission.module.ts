import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { UserModule } from './user.module';
import { PermissionController } from 'src/controllers/permission.controller';
import { PermissionService } from 'src/services/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), UserModule],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
