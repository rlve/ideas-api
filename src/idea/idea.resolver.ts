import {
  Resolver,
  Args,
  Query,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { IdeaService } from './idea.service';
import { CommentService } from 'src/comment/comment.service';

@Resolver('Idea')
export class IdeaResolver {
  constructor(
    private ideaService: IdeaService,
    private commentService: CommentService,
  ) {}

  @Query()
  async ideas(
    @Args('page') page: number = 1,
    @Args('newest') newest: boolean = false,
  ) {
    return this.ideaService.showAll(page, newest);
  }

  @ResolveProperty()
  async comments(@Parent() idea) {
    const { id } = idea;

    return this.commentService.readByIdea(id);
  }
}
