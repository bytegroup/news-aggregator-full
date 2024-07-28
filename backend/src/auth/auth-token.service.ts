import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async generateAuthTokens(user: User) {
    const payload = { email: user.email, sub: user.id };

    const refreshToken = await this.generateRefreshToken(user.id);
    //const refreshTokenPayload = this.jwtService.decode(refreshToken);
    //console.log("refreshTokenPayload: ", refreshTokenPayload);

    return {
      accessToken: await this.generateAccessToken(payload),
      refreshToken: refreshToken,
      loggedUser: user.email,
    };
  }

  async generateAccessToken(payload: { email: string; sub: number }) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRETE'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRY'),
    });
  }

  private async generateRefreshToken(authUserId: number) {
    const newRefreshToken = this.jwtService.sign(
      { sub: authUserId },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRETE'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRY'),
      },
    );

    const refreshTokens = await this.refreshTokenRepository.find({
      where: { userId: authUserId },
    });
    await this.refreshTokenRepository.remove(refreshTokens);
    await this.refreshTokenRepository.insert({
      refreshToken: newRefreshToken,
      expiresAt: new Date(),
      userId: authUserId,
    });

    return newRefreshToken;
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    return this.refreshTokenRepository.existsBy({ refreshToken, userId });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async clearExpiredRefreshTokens() {
    await this.refreshTokenRepository.delete({
      expiresAt: LessThanOrEqual(new Date()),
    });
  }
}
