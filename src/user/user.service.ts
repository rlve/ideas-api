import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll() {
    return await this.userRepository.find();
  }

  async create(data: UserDTO) {
    const user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user;
  }
}
