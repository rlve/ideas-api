import {
  Controller,
  Post,
  UseGuards,
  Body,
  Logger,
  Param,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { CommentDTO } from './comment.dto';
import { User } from 'src/user/user.decorator';

@Controller('api/idea')
export class CommentController {
  constructor(private commentService: CommentService) {}

  private logger = new Logger('IdeaController');

  // TODO: DRY!
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

  @Post(':id/comment')
  @UseGuards(AuthGuard)
  comment(@Param('id') id: string, @Body() data: CommentDTO, @User('id') user) {
    this.logData({ id, data, user });
    return this.commentService.comment(id, data, user);
  }
}
