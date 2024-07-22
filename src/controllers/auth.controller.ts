import { Body, ClassSerializerInterceptor, Controller, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'src/decorators/user.decorator';
import { ChangePasswordDto } from 'src/dtos/change-password.dto';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { LoginUserDto } from 'src/dtos/login-user.dto';
import { AuthService } from 'src/services/auth.service';
import { getSuccessResponse } from 'src/utils/success-response.helper';

@ApiTags('Auth Controller')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.authService.createUserWithDetails(createUserDto);

    return getSuccessResponse('User created successfully');
  }

  @Public()
  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('/logout')
  async logout(@User() user) {
    return this.authService.logoutUser(user);
  }

  @Patch('/password')
  async updatePassword(@User() user, @Body() changePasswordDto: ChangePasswordDto) {
    await this.authService.updatePassword(user, changePasswordDto);

    return getSuccessResponse('Password has been updated successfully');
  }

  @Patch('/user/:userId')
  async updateUser(@Param('userId') userId: string, @User() currentUser, @Body() updateUserDto) {
    await this.authService.updateUser(currentUser, userId, updateUserDto);

    return getSuccessResponse('User has been updated successfully');
  }
}
