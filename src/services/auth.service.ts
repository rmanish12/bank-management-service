import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from 'src/dtos/request/create-user.dto';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from './user.service';
import { isEmpty, isEqual } from 'lodash';
import { EncryptionUtil } from 'src/utils/encryption.helper';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from 'src/dtos/request/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { ChangePasswordDto } from 'src/dtos/request/change-password.dto';
import { RoleService } from './role.service';
import { UpdateUserDto } from 'src/dtos/request/update-user-dto';
import { MapperUtils } from 'src/utils/mapper';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private encryptionUtil;

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectDataSource() private dataSource: DataSource,
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private roleService: RoleService,
  ) {
    this.encryptionUtil = new EncryptionUtil(this.configService);
  }

  createUser(createUserDto: CreateUserDto) {
    const encryptedPassword = this.encryptionUtil.getEncryptedValue(createUserDto.password);

    const newUser = this.userRepo.create({
      id: uuidv4(),
      password: encryptedPassword,
    });

    return newUser;
  }

  async createUserWithDetails(createUserDto: CreateUserDto) {
    const existingUserDetails = await this.userService.getUserDetailsByEmail(createUserDto.email);

    if (!isEmpty(existingUserDetails)) {
      this.logger.error(`User with email ${createUserDto.email} already exists`);
      throw new ConflictException('User with given email already exists');
    }

    return this.dataSource.transaction(async (manager) => {
      const user = await this.createUser(createUserDto);
      const newUser = await manager.save(user);

      const userDetails = this.userService.createUserDetails(createUserDto, newUser);
      await manager.save(userDetails);

      this.logger.log('User created successfully with email - ', createUserDto.email);
    });
  }

  private validateUser(loginUserDto: LoginUserDto, user: User) {
    const { password } = loginUserDto;
    const { password: userPassword, isActive } = user;

    if (!isActive) {
      throw new UnauthorizedException('Inactive user');
    }

    const decryptedUserPassword = this.encryptionUtil.getDecryptedValue(userPassword);

    if (!isEqual(password, decryptedUserPassword)) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async getUserById(userId: string): Promise<User> {
    return this.userRepo.findOneBy({ id: userId });
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email } = loginUserDto;

    const existingUserDetails = await this.userService.getUserDetailsForLogin(email);

    if (isEmpty(existingUserDetails)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.validateUser(loginUserDto, existingUserDetails.user);

    const {
      user: { id },
      firstName,
      lastName,
    } = existingUserDetails;

    const payload = { sub: id, name: `${firstName} ${lastName}` };

    const accessToken = this.jwtService.sign(
      { payload },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: 15 * 60 * 1000,
      },
    );

    await this.cacheManager.set(id, accessToken);

    this.logger.log(`User with email ${existingUserDetails.email} has been logged in successfully`);
    return { accessToken };
  }

  async logoutUser(user: User) {
    await this.cacheManager.del(user.id);
    this.logger.log(`User with id ${user.id} has been logged out successfully`);
    return;
  }

  async updatePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const { newPassword } = changePasswordDto;

    const userToUpdate = await this.getUserById(user.id);
    const decryptedPassword = this.encryptionUtil.getDecryptedValue(userToUpdate.password);

    if (newPassword === decryptedPassword) {
      throw new BadRequestException('New password should be same as the current password');
    }

    const newEncrypedPassword = this.encryptionUtil.getEncryptedValue(newPassword);

    userToUpdate.password = newEncrypedPassword;

    const result = await this.userRepo.save(userToUpdate);

    this.logger.log(`Password for user with id ${user.id} has been changed successfully`);
    return result;
  }

  async updateUser(currentUser: User, userId: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Received request to update user with id: ${userId} by user with id: ${currentUser.id}`);

    const userToUpdate = await this.getUserById(userId);

    if (isEmpty(userToUpdate)) {
      this.logger.error(`User with id: ${userId} not found`);
      throw new NotFoundException(`User with id: ${userId} not found`);
    }

    const { isActive, roles } = updateUserDto;

    const rolesInfo = await this.roleService.getRoleListByIds(roles);

    userToUpdate.isActive = isActive;
    userToUpdate.roles = rolesInfo;

    await this.userRepo.save(userToUpdate);

    this.logger.log(`User with id: ${userId} updated`);
  }
}
