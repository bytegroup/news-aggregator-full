import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private readonly logger = new Logger(JwtRefreshStrategy.name);
  constructor(
    private readonly userService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('REFRESH_TOKEN_SECRETE'),
    });
  }

  async validate(payload: any) {
    //console.log('refresh strategy: ', payload);
    const authUser = await this.userService.findOneById(payload.sub);
    if (!authUser) {
      throw new UnauthorizedException();
    }

    return authUser;
  }
}
