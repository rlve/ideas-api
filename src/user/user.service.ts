import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';
import { UserRO } from './user.ro';
import { UserROOptions } from './user.ro.options';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll(
    page: number = 1,
    options: UserROOptions = {},
  ): Promise<UserRO[]> {
    const users = await this.userRepository.find({
      relations: ['ideas', 'bookmarks', 'comments'],
      take: 20,
      skip: 20 * (page - 1),
    });

    return users.map(user => user.toResponseObject(options));
  }

  async showOne(userId: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ideas', 'bookmarks', 'comments'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user.toResponseObject({ fullComments: true, fullIdeas: true });
  }

  async login(data: UserDTO): Promise<UserRO> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject({ showToken: true });
  }

  async create(data: UserDTO): Promise<UserRO> {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);

    return user.toResponseObject({ showToken: true });
  }
}
