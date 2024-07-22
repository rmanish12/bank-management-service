import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/config/db/db.module';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RoleModule } from './role.module';
import { PermissionModule } from './permission.module';
import { PermissionGaurd } from 'src/gaurds/permission.gaurd';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 15 * 60 * 1000,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: PermissionGaurd,
    // },
  ],
})
export class AppModule {}
