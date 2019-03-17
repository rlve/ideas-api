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
  Query,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';
import { Votes } from 'src/shared/votes.enum';
import { LoggerExt } from 'src/shared/logging.extension';

@Controller('api/idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}

  private logger = LoggerExt('IdeaController');

  @Get()
  showAllIdeas(@Query('page') page: number) {
    return this.ideaService.showAll(page);
  }

  @Get('/newest')
  showNewestIdeas(@Query('page') page: number) {
    return this.ideaService.showAll(page, true);
  }

  @Post()
  @UseGuards(AuthGuard)
  createIdea(@Body() data: IdeaDTO, @User('id') user) {
    this.logger.logData({ data, user });
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
    this.logger.logData({ idea: id, data, user });
    return this.ideaService.update(id, data, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteIdea(@Param('id') id: string, @User('id') user) {
    this.logger.logData({ idea: id, user });
    return this.ideaService.delete(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(AuthGuard)
  addBookmark(@Param('id') id: string, @User('id') user: string) {
    this.logger.logData({ idea: id, user });
    return this.ideaService.addBookmark(id, user);
  }

  @Delete(':id/bookmark')
  @UseGuards(AuthGuard)
  deleteBookmark(@Param('id') id: string, @User('id') user: string) {
    this.logger.logData({ idea: id, user });
    return this.ideaService.deleteBookmark(id, user);
  }

  @Post(':id/upvote')
  @UseGuards(AuthGuard)
  upvote(@Param('id') id: string, @User('id') user: string) {
    this.logger.logData({ idea: id, user });
    return this.ideaService.vote(id, user, Votes.UP);
  }

  @Post(':id/downvote')
  @UseGuards(AuthGuard)
  downvote(@Param('id') id: string, @User('id') user: string) {
    this.logger.logData({ idea: id, user });
    return this.ideaService.vote(id, user, Votes.DOWN);
  }
}
