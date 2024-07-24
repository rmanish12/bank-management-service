import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { User } from 'src/decorators/user.decorator';
import { CreatePermissionDto } from 'src/dtos/request/create-permission.dto';
import { UpdatePermissionDto } from 'src/dtos/request/update-permission-dto';
import { PermissionGaurd } from 'src/gaurds/permission.gaurd';
import { PermissionService } from 'src/services/permission.service';
import { PERMISSIONS } from 'src/utils/permissions.enum';
import { getSuccessResponse } from 'src/utils/success-response.helper';

@ApiTags('Permission Controller')
@Controller('permission')
@UseGuards(PermissionGaurd)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @RequirePermissions(PERMISSIONS.MANAGE_PERMISSION)
  async createPermission(@User() user, @Body() createPermissionDto: CreatePermissionDto) {
    await this.permissionService.createPermission(user, createPermissionDto);

    return getSuccessResponse('Permission has been created successfully');
  }

  @Get('/:id')
  @RequirePermissions(PERMISSIONS.VIEW_PERMISSION, PERMISSIONS.MANAGE_PERMISSION)
  getPermissionDetails(@Param('id') id: string) {
    return this.permissionService.getPermissionDetails(id);
  }

  @Patch('/:id')
  @RequirePermissions(PERMISSIONS.MANAGE_PERMISSION)
  async updatePermission(@Param('id') id: string, @User() user, @Body() updatePermissionDto: UpdatePermissionDto) {
    await this.permissionService.updatePermissionDetails(user, id, updatePermissionDto);

    return getSuccessResponse('Permission has been updated successfully');
  }

  @Get()
  @RequirePermissions(PERMISSIONS.VIEW_PERMISSION, PERMISSIONS.MANAGE_PERMISSION)
  getAllPermissions() {
    return this.permissionService.getAllPermissions();
  }
}
