import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { CommentDTO } from './comment.dto';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserEntity } from 'src/user/user.entity';
import { CommentRO } from './comment.ro';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async comment(
    id: string,
    data: CommentDTO,
    userId: string,
  ): Promise<CommentRO> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['comments'],
    });

    const comment = await this.commentRepository.create({
      ...data,
      author: user,
      idea,
    });

    await this.commentRepository.save(comment);

    return comment.toResponseObject();
  }
}
