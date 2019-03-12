import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  @Query()
  async users(@Args('page') page: number = 1) {
    return this.userService.showAll(page, {
      fullIdeas: true,
    });
  }

  @ResolveProperty()
  async comments(@Parent() user) {
    const { id } = user;

    return this.commentService.readByUser(id);
  }
}
