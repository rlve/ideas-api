import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query()
  async users(@Args('page') page: number = 1) {
    return this.userService.showAll(page, { fullIdeas: true });
  }
}
