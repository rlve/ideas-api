import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'validator';

import { IdeaEntity } from './idea.entity';
import { IdeaDTO } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';
import { User } from 'src/user/user.decorator';
import { IdeaRO } from './idea.ro';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll(): Promise<IdeaRO[]> {
    const ideas = await this.ideaRepository.find({ relations: ['author'] });

    return ideas.map(idea => idea.toResponseObject());
  }

  async create(data: IdeaDTO, userId: string): Promise<IdeaRO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const idea = await this.ideaRepository.create({ ...data, author: user });

    await this.ideaRepository.save(idea);

    return idea.toResponseObject();
  }

  async read(id: string): Promise<IdeaRO> {
    this.validateId(id);

    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    this.ensureExistence(idea);

    return idea.toResponseObject();
  }

  async update(
    id: string,
    data: Partial<IdeaDTO>,
    userId: string,
  ): Promise<IdeaRO> {
    this.validateId(id);

    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    this.ensureExistence(idea);
    this.ensureOwnership(idea, userId);

    await this.ideaRepository.update({ id }, data);
    idea = await this.ideaRepository.findOne({ where: { id } });

    return idea.toResponseObject();
  }

  async delete(id: string, userId: string): Promise<IdeaRO> {
    this.validateId(id);

    const idea = await this.ideaRepository.findOne({ where: { id } });

    this.ensureExistence(idea);
    this.ensureOwnership(idea, userId);

    await this.ideaRepository.delete({ id });

    return idea.toResponseObject();
  }

  private validateId(id: string) {
    if (!isUUID(id)) {
      throw new HttpException(
        'Id must be a valid UUID',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  private ensureExistence(idea: IdeaEntity) {
    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  private ensureOwnership(idea: IdeaEntity, userId: string) {
    if (idea.author.id !== userId) {
      throw new HttpException('Permission denied.', HttpStatus.UNAUTHORIZED);
    }
  }
}
