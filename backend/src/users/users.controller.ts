import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User as UserEntity } from './entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggedUserDto } from '../auth/dto/logged-user.dto';
import { AuthUser } from '../auth/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../utilities/global-resonse.interceptor';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async getUsers(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Public()
  @Post('create')
  @UseInterceptors(TransformInterceptor)
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('user register action called', createUserDto);
    return await this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(@AuthUser() authUser: UserEntity): Promise<LoggedUserDto> {
    return { name: authUser.name, email: authUser.email };
  }

  @ApiBearerAuth()
  @Patch('profile')
  async updateProfile(
    @AuthUser() authUser: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<LoggedUserDto> {
    await this.usersService.update(authUser.id, updateUserDto);
    return { name: authUser.name, email: authUser.email };
  }

  /*@UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() req: Request) {
    const user = req.user;
    await this.usersService.remove(user.id);
  }*/
}
