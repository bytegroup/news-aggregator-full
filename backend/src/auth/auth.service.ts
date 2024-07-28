import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthTokenService } from './auth-token.service';
import { LoginStatus } from './interface/login-status.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private authTokenService: AuthTokenService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<LoginStatus> {
    const token = await this.authTokenService.generateAuthTokens(user);
    return {
      ...token,
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  async accessTokenRefresh(
    refreshToken: string,
    payload: { email: string; sub: number },
  ) {
    if (
      !(await this.authTokenService.validateRefreshToken(
        payload.sub,
        refreshToken,
      ))
    )
      throw new UnauthorizedException('Invalid refresh token');
    return {
      accessToken: await this.authTokenService.generateAccessToken(payload),
    };
  }
}
