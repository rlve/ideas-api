import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'validator';

import { IdeaEntity } from './idea.entity';
import { IdeaDTO } from './idea.dto';

const validateId = (id: string): boolean => {
  const result = isUUID(id);

  if (!result) {
    throw new HttpException(
      'Id must be a valid UUID',
      HttpStatus.NOT_ACCEPTABLE,
    );
  }

  return result;
};

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
  ) {}

  async showAll() {
    return await this.ideaRepository.find();
  }

  async create(data: IdeaDTO) {
    const idea = await this.ideaRepository.create(data);
    await this.ideaRepository.save(idea);
    return idea;
  }

  async read(id: string) {
    let idea: IdeaDTO | undefined;
    if (validateId(id)) {
      idea = await this.ideaRepository.findOne({ where: { id } });

      if (!idea) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
    }
    return idea;
  }

  async update(id: string, data: Partial<IdeaDTO>) {
    let idea: IdeaDTO | undefined;
    if (validateId(id)) {
      idea = await this.ideaRepository.findOne({ where: { id } });

      if (!idea) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
    }

    await this.ideaRepository.update({ id }, data);
    idea = await this.ideaRepository.findOne({ where: { id } });
    return await idea;
  }

  async delete(id: string) {
    let idea: IdeaDTO | undefined;
    if (validateId(id)) {
      idea = await this.ideaRepository.findOne({ where: { id } });

      if (!idea) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
    }

    await this.ideaRepository.delete({ id });
    return idea;
  }
}
