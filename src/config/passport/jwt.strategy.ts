import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/services/auth.service';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const {
      payload: { sub },
    } = payload;

    const isPresentInCache = await this.cacheManager.get(sub);

    if (isPresentInCache) {
      const userDetails = await this.authService.getUserById(sub);

      if (userDetails.isActive) {
        return userDetails;
      }
    }

    return null;
  }
}
