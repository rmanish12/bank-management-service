import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDetailsDto } from 'src/dtos/create-user-details.dto';
import { UserDetails } from 'src/entities/user-details.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { isEmpty } from 'lodash';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectRepository(UserDetails) private userDetailsRepo: Repository<UserDetails>) {}

  createUserDetails(createUserDetailsDto: CreateUserDetailsDto, user: User) {
    const userDetails = this.userDetailsRepo.create({
      id: uuidv4(),
      user,
      ...createUserDetailsDto,
    });

    return userDetails;
  }

  getUserDetailsByEmail(email: string) {
    return this.userDetailsRepo.findOneBy({ email });
  }

  getUserDetailsForLogin(email: string) {
    return this.userDetailsRepo.findOne({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        user: {
          id: true,
          password: true,
          isActive: true,
        },
      },
      where: { email },
      relations: {
        user: true,
      },
    });
  }

  getUserProfile(user: User): Promise<UserDetails> {
    this.logger.log(`Retrieving profile for user with id: ${user.id}`);
    return this.userDetailsRepo.findOneBy({
      user: {
        id: user.id,
      },
    });
  }

  async updateUserProfile(user: User, updateUserDto: CreateUserDetailsDto) {
    this.logger.log(`Updating profile for user with id: ${user.id}`);
    const loggedInUserDetails = await this.getUserProfile(user);

    const newUserDetails = this.createUserDetails(updateUserDto, user);
    newUserDetails.id = loggedInUserDetails.id;

    return this.userDetailsRepo.upsert(newUserDetails, ['email']);
  }

  getUserDetailsByUserId(userId: string) {
    return this.userDetailsRepo.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}
