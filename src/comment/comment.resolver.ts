import { Resolver, Mutation, Context, Args, Query } from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { CommentService } from './comment.service';
import { Logger, UseGuards } from '@nestjs/common';
import { LoggerExt } from 'src/shared/logging.extension';
import { UserEntity } from 'src/user/user.entity';
import { CommentDTO } from './comment.dto';
import { AuthGuard } from 'src/shared/auth.guard';

@Resolver('Comment')
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  private logger = LoggerExt('CommentResolver');

  @Query()
  async comment(@Args('id') id: string) {
    this.logger.logData({ comment: id });
    return this.commentService.read(id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async createComment(
    @Args('idea') idea: string,
    @Args('content') content: string,
    @Context('user') user: UserEntity,
  ) {
    const data: CommentDTO = { content };
    this.logger.logData({ idea, data, user });

    return this.commentService.comment(idea, data, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async editComment(
    @Args('id') id: string,
    @Args('content') content: string,
    @Context('user') user: UserEntity,
  ) {
    const data: CommentDTO = { content };
    this.logger.logData({ comment: id, data, user });

    return this.commentService.edit(id, data, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async deleteComment(
    @Args('id') id: string,
    @Context('user') user: UserEntity,
  ) {
    this.logger.logData({ comment: id, user });

    return this.commentService.delete(id, user.id);
  }
}
