import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';

@Controller('api/idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}

  private logger = new Logger('IdeaController');

  private logData(options: any) {
    const { data, id, user } = options;

    if (data) {
      this.logger.log(`DATA: ${JSON.stringify(data)}`);
    }
    if (id) {
      this.logger.log(`IDEA: ${JSON.stringify(id)}`);
    }
    if (user) {
      this.logger.log(`USER: ${JSON.stringify(user)}`);
    }
  }

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  createIdea(@Body() data: IdeaDTO, @User('id') user) {
    this.logData({ data, user });
    return this.ideaService.create(data, user);
  }

  @Get(':id')
  showIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateIdea(
    @Param('id') id: string,
    @Body() data: Partial<IdeaDTO>,
    @User('id') user,
  ) {
    this.logData({ id, data, user });
    return this.ideaService.update(id, data, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteIdea(@Param('id') id: string, @User('id') user) {
    this.logData({ id, user });
    return this.ideaService.delete(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(AuthGuard)
  addBookmark(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.addBookmark(id, user);
  }

  @Delete(':id/bookmark')
  @UseGuards(AuthGuard)
  deleteBookmark(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.deleteBookmark(id, user);
  }

  @Post(':id/upvote')
  @UseGuards(AuthGuard)
  upvote(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.upvote(id, user);
  }

  @Delete(':id/upvote')
  @UseGuards(AuthGuard)
  deleteUpvote(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.deleteUpvote(id, user);
  }

  @Post(':id/downvote')
  @UseGuards(AuthGuard)
  downvote(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.downvote(id, user);
  }

  @Delete(':id/downvote')
  @UseGuards(AuthGuard)
  deleteDownvote(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideaService.deleteDownvote(id, user);
  }
}
