import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import * as process from 'node:process';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthTokenService } from './auth-token.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { LocalStrategy } from './jwt/local.strategy';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRETE, // Change this to an environment variable
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    AuthTokenService,
    LocalStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
