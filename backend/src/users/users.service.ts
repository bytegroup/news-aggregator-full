import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    try {
      await this.usersRepository.save(user);
    } catch (e) {
      this.logger.error('user-create-err: ', e.message);
      throw e;
    }
    this.logger.debug('user ' + user.email + ' created successfully');
    return true;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(userId: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: userId });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const { password } = updateUserDto;
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    await this.usersRepository.update(id, {
      ...(password && { password: hashedPassword }),
    });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
