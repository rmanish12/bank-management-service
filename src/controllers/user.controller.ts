import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { CreateUserDetailsDto } from 'src/dtos/create-user-details.dto';
import { UserService } from 'src/services/user.service';
import { getSuccessResponse } from 'src/utils/success-response.helper';

@ApiTags('User Controller')
@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/profile')
  getProfile(@User() user) {
    return this.userService.getUserProfile(user);
  }

  @Put('/profile')
  async updateProfile(@Body() updateUserDto: CreateUserDetailsDto, @User() user) {
    await this.userService.updateUserProfile(user, updateUserDto);

    return getSuccessResponse('User profile has been updated successfully');
  }
}
