import {
  Resolver,
  Args,
  Query,
  ResolveProperty,
  Parent,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { IdeaService } from './idea.service';
import { CommentService } from 'src/comment/comment.service';
import { IdeaDTO } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { LoggerExt } from 'src/shared/logging.extension';
import { Votes } from 'src/shared/votes.enum';

@Resolver('Idea')
export class IdeaResolver {
  constructor(
    private ideaService: IdeaService,
    private commentService: CommentService,
  ) {}

  private logger = LoggerExt('IdeaController');

  @Query()
  async ideas(
    @Args('page') page: number = 1,
    @Args('newest') newest: boolean = false,
  ) {
    return this.ideaService.showAll(page, newest);
  }

  @Query()
  async idea(@Args('id') id: string) {
    return this.ideaService.read(id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async createIdea(
    @Args() { idea, description }: IdeaDTO,
    @Context('user') user: UserEntity,
  ) {
    const data = { idea, description };
    this.logger.logData({ data, user });

    return this.ideaService.create(data, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async updateIdea(
    @Args('id') id: string,
    @Args('idea') idea: string,
    @Args('description') description: string,
    @Context('user') user: UserEntity,
  ) {
    const data: Partial<IdeaDTO> = {};
    if (idea) {
      data.idea = idea;
    }
    if (description) {
      data.description = description;
    }

    this.logger.logData({ idea: id, data, user });

    return this.ideaService.update(id, data, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async deleteIdea(@Args('id') id: string, @Context('user') user: UserEntity) {
    this.logger.logData({ idea: id, user });

    return this.ideaService.delete(id, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  upvote(@Args('id') id: string, @Context('user') user: UserEntity) {
    this.logger.logData({ idea: id, user });

    return this.ideaService.vote(id, user.id, Votes.UP);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  downvote(@Args('id') id: string, @Context('user') user: UserEntity) {
    this.logger.logData({ idea: id, user });

    return this.ideaService.vote(id, user.id, Votes.DOWN);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  bookmark(@Args('id') id: string, @Context('user') user: UserEntity) {
    this.logger.logData({ idea: id, user });

    return this.ideaService.addBookmark(id, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  unbookmark(@Args('id') id: string, @Context('user') user: UserEntity) {
    this.logger.logData({ idea: id, user });

    return this.ideaService.deleteBookmark(id, user.id);
  }

  @ResolveProperty()
  async comments(@Parent() idea) {
    const { id } = idea;

    return this.commentService.readByIdea(id);
  }
}
