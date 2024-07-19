import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { CreateRoleDto } from 'src/dtos/create-role-dto';
import { RoleService } from 'src/services/role.service';
import { getSuccessResponse } from 'src/utils/success-response.helper';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@User() user, @Body() createRoleDto: CreateRoleDto) {
    await this.roleService.createRole(user, createRoleDto);

    return getSuccessResponse('Role has been created successfully');
  }

  @Get('/:id')
  getRoleDetail(@Param('id') id: string) {
    return this.roleService.getRoleDetails(id);
  }

  @Patch('/:id')
  async updateRole(@Param('id') id: string, @User() user, @Body() updateUserDto) {
    await this.roleService.updateRole(user, id, updateUserDto);
    return getSuccessResponse('Role has been updated successfully');
  }
}
