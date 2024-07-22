import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { CreatePermissionDto } from 'src/dtos/request/create-permission.dto';
import { UpdatePermissionDto } from 'src/dtos/request/update-permission-dto';
import { PermissionService } from 'src/services/permission.service';
import { getSuccessResponse } from 'src/utils/success-response.helper';

@ApiTags('Permission Controller')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async createPermission(@User() user, @Body() createPermissionDto: CreatePermissionDto) {
    await this.permissionService.createPermission(user, createPermissionDto);

    return getSuccessResponse('Permission has been created successfully');
  }

  @Get('/:id')
  getPermissionDetails(@Param('id') id: string) {
    return this.permissionService.getPermissionDetails(id);
  }

  @Patch('/:id')
  async updatePermission(@Param('id') id: string, @User() user, @Body() updatePermissionDto: UpdatePermissionDto) {
    await this.permissionService.updatePermissionDetails(user, id, updatePermissionDto);

    return getSuccessResponse('Permission has been updated successfully');
  }
}
