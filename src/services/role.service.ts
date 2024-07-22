import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from 'src/dtos/request/create-role-dto';
import { Role } from 'src/entities/role.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { isEmpty } from 'lodash';
import { UpdateRoleDto } from 'src/dtos/request/update-role-dto';
import { MapperUtils } from 'src/utils/mapper';
import { PermissionService } from './permission.service';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);
  private readonly mapperUtil = new MapperUtils();

  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
  ) {}

  private checkRoleExistsByName(name: string) {
    return this.roleRepo.existsBy({ name });
  }

  private getPermissionsDetails(permissionIds) {
    if (isEmpty(permissionIds)) {
      return [];
    }

    return this.permissionService.getPermissionsListByIds(permissionIds);
  }

  async createRole(user: User, createRoleDto: CreateRoleDto) {
    const { name, description, permissions } = createRoleDto;

    this.logger.log(`Received request for creating role with name: ${name}`);

    if (await this.checkRoleExistsByName(name)) {
      throw new ConflictException('Role with given name already exists');
    }

    const permissionDetails = await this.getPermissionsDetails(permissions);

    const newRole = this.roleRepo.create({
      name,
      description,
      createdBy: user,
      modifiedBy: user,
      permissions: permissionDetails,
    });

    await this.roleRepo.save(newRole);

    this.logger.log(`Role: ${name} has been created successfully`);
  }

  private async getRoleDetailsById(roleId: string): Promise<Role> {
    const roleDetails = await this.roleRepo.findOne({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        modifiedAt: true,
        permissions: {
          id: true,
          name: true,
        },
      },
      where: { id: roleId },
      relations: {
        createdBy: true,
        modifiedBy: true,
        permissions: true,
      },
    });

    if (isEmpty(roleDetails)) {
      this.logger.error(`Role with ${roleId} not found`);
      throw new NotFoundException('Role does not exists');
    }

    return roleDetails;
  }

  async getRoleDetails(roleId: string) {
    this.logger.log(`Received request for getting details with id: ${roleId}`);

    const roleDetails = await this.getRoleDetailsById(roleId);

    const { createdBy, modifiedBy } = roleDetails;

    const createdByUserDetails = await this.userService.getUserDetailsByUserId(createdBy.id);
    const modifiedByUserDetails = await this.userService.getUserDetailsByUserId(modifiedBy.id);

    const details = {
      ...roleDetails,
      createdBy: this.mapperUtil.mapUserDetailsForResponse(createdByUserDetails),
      modifiedBy: this.mapperUtil.mapUserDetailsForResponse(modifiedByUserDetails),
    };

    this.logger.log(`Returning details for role with id ${roleId}`);
    return details;
  }

  async updateRole(user: User, roleId: string, updateRoleDto: UpdateRoleDto) {
    this.logger.log(`Received request for updating details for role with id: ${roleId}`);

    const roleDetails = await this.getRoleDetailsById(roleId);

    const { description, permissions } = updateRoleDto;

    const permissionDetails = await this.permissionService.getPermissionsListByIds(permissions);
    roleDetails.description = description;
    roleDetails.modifiedBy = user;
    roleDetails.permissions = permissionDetails;

    await this.roleRepo.save(roleDetails);

    this.logger.log(`Details updated for role with id: ${roleId}`);
  }

  getRoleListByIds(roleIds: string[]): Promise<Role[]> {
    return this.roleRepo.findBy({ id: In(roleIds) });
  }

  async getAllRoles(): Promise<Role[]> {
    this.logger.log(`Received request for fetching all roles`);

    const roles = await this.roleRepo.find({
      select: {
        id: true,
        name: true,
      },
    });

    this.logger.log(`Returning all roles details`);
    return roles;
  }
}
