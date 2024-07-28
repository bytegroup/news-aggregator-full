import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends Repository<User> {}
