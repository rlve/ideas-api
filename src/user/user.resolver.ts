import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';
import { Logger } from '@nestjs/common';
import { UserDTO } from './user.dto';

@Resolver('User')
export class UserResolver {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  private logger = new Logger('UserController');

  @Query()
  async users(@Args('page') page: number = 1) {
    return this.userService.showAll(page, {
      fullIdeas: true,
    });
  }

  @Query()
  async user(@Args('id') id: string) {
    return this.userService.showOne(id);
  }

  @Mutation()
  async login(@Args() { username, password }: UserDTO) {
    this.logger.log(`Login: ${username}`);
    return this.userService.login({ username, password });
  }

  @Mutation()
  async register(@Args() { username, password }: UserDTO) {
    this.logger.log(`Register: ${username}`);
    return this.userService.create({ username, password });
  }

  @ResolveProperty()
  async comments(@Parent() user) {
    const { id } = user;

    return this.commentService.readByUser(id);
  }
}
