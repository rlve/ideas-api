import {
  Controller,
  Post,
  UseGuards,
  Body,
  Logger,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { CommentDTO } from './comment.dto';
import { User } from 'src/user/user.decorator';
import { LoggerExt } from 'src/shared/logging.extension';

@Controller()
export class CommentController {
  constructor(private commentService: CommentService) {}

  private logger = LoggerExt('CommentController');

  @Post('api/idea/:id/comment')
  @UseGuards(AuthGuard)
  comment(@Param('id') id: string, @Body() data: CommentDTO, @User('id') user) {
    this.logger.logData({ idea: id, data, user });
    return this.commentService.comment(id, data, user);
  }

  @Put('api/comments/:id')
  @UseGuards(AuthGuard)
  editComment(
    @Param('id') id: string,
    @Body() data: CommentDTO,
    @User('id') user,
  ) {
    this.logger.logData({ comment: id, data, user });
    return this.commentService.edit(id, data, user);
  }

  @Delete('api/comments/:id')
  @UseGuards(AuthGuard)
  deleteComment(@Param('id') id: string, @User('id') user) {
    this.logger.logData({ comment: id, user });
    return this.commentService.delete(id, user);
  }
}
