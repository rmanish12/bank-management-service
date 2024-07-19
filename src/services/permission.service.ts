import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDto } from 'src/dtos/create-permission.dto';
import { Permission } from 'src/entities/permission.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { isEmpty } from 'lodash';
import { MapperUtils } from 'src/utils/mapper';
import { UpdatePermissionDto } from 'src/dtos/update-permission-dto';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);
  private readonly mapperUtils = new MapperUtils();

  constructor(
    @InjectRepository(Permission) private readonly permissionRepo: Repository<Permission>,
    private readonly userService: UserService,
  ) {}

  private checkIfPermissionExistsByName(name: string) {
    return this.permissionRepo.existsBy({ name });
  }

  private async getPermissionDetailsById(id: string) {
    const permissionDetails = await this.permissionRepo.findOne({
      where: { id },
      relations: {
        createdBy: true,
        lastModifiedBy: true,
      },
    });

    if (isEmpty(permissionDetails)) {
      this.logger.error(`Permission with id: ${id} not found`);
      throw new NotFoundException('Permission does not exist');
    }

    return permissionDetails;
  }

  async createPermission(user: User, createPermissionDto: CreatePermissionDto) {
    const { name, description } = createPermissionDto;

    this.logger.log(`Received request for creating permission with name: ${name}`);

    if (await this.checkIfPermissionExistsByName(name)) {
      this.logger.error(`Permission with the name: ${name} already exists`);
      throw new ConflictException(`Permission with the name: ${name} already exists`);
    }

    const newPermission = this.permissionRepo.create({
      name,
      description,
      createdBy: user,
      lastModifiedBy: user,
    });

    await this.permissionRepo.save(newPermission);

    this.logger.log(`Permission with name: ${name} has been created successfully`);
  }

  async getPermissionDetails(permissionId: string) {
    this.logger.log(`Received request for getting details for permission with id: ${permissionId}`);
    const permissionDetails = await this.getPermissionDetailsById(permissionId);

    const { createdBy, lastModifiedBy } = permissionDetails;

    const [createdByUserDetails, updatedByUserDetails] = await Promise.all([
      this.userService.getUserDetailsByUserId(createdBy.id),
      this.userService.getUserDetailsByUserId(lastModifiedBy.id),
    ]);

    this.logger.log(`Returning details for permission with id:${permissionId}`);

    return {
      ...permissionDetails,
      createdBy: this.mapperUtils.mapUserDetailsForResponse(createdByUserDetails),
      lastModifiedBy: this.mapperUtils.mapUserDetailsForResponse(updatedByUserDetails),
    };
  }

  async updatePermissionDetails(user: User, permissionId: string, updatePermissionDto: UpdatePermissionDto) {
    this.logger.log(`Received request for updating permission with id ${permissionId}`);

    const permissionDetails = await this.getPermissionDetailsById(permissionId);

    permissionDetails.description = updatePermissionDto.description;
    permissionDetails.lastModifiedBy = user;

    await this.permissionRepo.save(permissionDetails);

    this.logger.log(`Updated permission with id ${permissionId}`);
  }
}
