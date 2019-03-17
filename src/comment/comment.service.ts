import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  async readByUser(id: string): Promise<CommentRO[]> {
    const comment = await this.commentRepository.find({
      where: { author: { id } },
      relations: ['author', 'idea'],
    });

    return comment.map(_ => _.toResponseObject());
  }

  async readByIdea(id: string): Promise<CommentRO[]> {
    const comment = await this.commentRepository.find({
      where: { idea: { id } },
      relations: ['author', 'idea'],
    });

    return comment.map(_ => _.toResponseObject());
  }

  async read(id: string): Promise<CommentRO> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'idea'],
    });

    this.ensureExistence(comment);

    return comment.toResponseObject();
  }

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

  async edit(
    id: string,
    data: Partial<CommentDTO>,
    userId: string,
  ): Promise<CommentRO> {
    let comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    this.ensureExistence(comment);
    this.ensureOwnership(comment, userId);

    await this.commentRepository.update({ id }, data);
    comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    return comment.toResponseObject();
  }

  async delete(id: string, userId: string): Promise<CommentRO> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    this.ensureExistence(comment);
    this.ensureOwnership(comment, userId);

    await this.commentRepository.delete({ id });

    return comment.toResponseObject();
  }

  private ensureExistence(comment: CommentEntity) {
    if (!comment) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  private ensureOwnership(comment: CommentEntity, userId: string) {
    if (comment.author.id !== userId) {
      throw new HttpException('Permission denied.', HttpStatus.UNAUTHORIZED);
    }
  }
}
