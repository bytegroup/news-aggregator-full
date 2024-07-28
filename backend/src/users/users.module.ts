import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { AuthTokenService } from '../auth/auth-token.service';
import { RefreshToken } from '../auth/entities/refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  providers: [UsersService, AuthService, JwtService, AuthTokenService],
  controllers: [UsersController],
})
export class UsersModule {}
