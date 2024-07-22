import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { User } from 'src/decorators/user.decorator';
import { CreateRoleDto } from 'src/dtos/create-role-dto';
import { PermissionGaurd } from 'src/gaurds/permission.gaurd';
import { RoleService } from 'src/services/role.service';
import { PERMISSIONS } from 'src/utils/permissions.enum';
import { getSuccessResponse } from 'src/utils/success-response.helper';

@ApiTags('Role Controller')
@Controller('role')
@UseGuards(PermissionGaurd)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @RequirePermissions(PERMISSIONS.MANAGE_ROLES, PERMISSIONS.VIEW_ROLES)
  async createRole(@User() user, @Body() createRoleDto: CreateRoleDto) {
    await this.roleService.createRole(user, createRoleDto);

    return getSuccessResponse('Role has been created successfully');
  }

  @Get('/:id')
  @RequirePermissions(PERMISSIONS.VIEW_ROLES)
  getRoleDetail(@Param('id') id: string) {
    return this.roleService.getRoleDetails(id);
  }

  @Patch('/:id')
  @RequirePermissions(PERMISSIONS.MANAGE_ROLES, PERMISSIONS.VIEW_ROLES)
  async updateRole(@Param('id') id: string, @User() user, @Body() updateUserDto) {
    await this.roleService.updateRole(user, id, updateUserDto);
    return getSuccessResponse('Role has been updated successfully');
  }

  @Get()
  @RequirePermissions(PERMISSIONS.VIEW_ROLES)
  async getAllRoles() {
    return this.roleService.getAllRoles();
  }
}
