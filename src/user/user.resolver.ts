import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';
import { Logger, UseGuards } from '@nestjs/common';
import { UserDTO } from './user.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { UserEntity } from './user.entity';

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

  @Query()
  @UseGuards(AuthGuard)
  async whoami(@Context('user') user: UserEntity) {
    return this.userService.showOne(user.id);
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
