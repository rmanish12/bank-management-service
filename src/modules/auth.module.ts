import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/controllers/auth.controller';
import { UserDetails } from 'src/entities/user-details.entity';
import { User } from 'src/entities/user.entity';
import { UserModule } from './user.module';
import { AuthService } from 'src/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/config/passport/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtGauard } from 'src/gaurds/jwt.gaurd';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDetails]), UserModule, JwtModule.register({}), PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtGauard,
    },
  ],
})
export class AuthModule {}
