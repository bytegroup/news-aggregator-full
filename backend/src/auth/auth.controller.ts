import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginStatus } from './interface/login-status.interface';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtRefreshAuthGuard } from './jwt/jwt-refresh-auth.guard';
import { AuthUser } from './decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { Request } from 'express';
import { LocalAuthGuard } from './jwt/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@AuthUser() user: UserEntity): Promise<LoginStatus> {
    this.logger.debug('trying to login: ' + user.email);
    try {
      return await this.authService.login(user);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('token-refresh')
  async refreshTokens(@AuthUser() authUser: UserEntity, @Req() req: Request) {
    console.log('generating access token on refreshing....');
    const refreshToken = req.headers.authorization?.split(' ')[1];
    //console.log('refresh token from refreshToken: ', refreshToken);

    return await this.authService.accessTokenRefresh(refreshToken, {
      email: authUser.email,
      sub: authUser.id,
    });
  }
}
