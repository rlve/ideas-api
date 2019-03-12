import { Resolver, Args, Query } from '@nestjs/graphql';
import { IdeaService } from './idea.service';

@Resolver('Idea')
export class IdeaResolver {
  constructor(private ideaService: IdeaService) {}

  @Query()
  async ideas(
    @Args('page') page: number = 1,
    @Args('newest') newest: boolean = false,
  ) {
    return this.ideaService.showAll(page, newest);
  }
}
