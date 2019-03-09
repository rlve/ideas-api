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

@Controller()
export class CommentController {
  constructor(private commentService: CommentService) {}

  private logger = new Logger('IdeaController');

  // TODO: DRY!
  private logData(options: any) {
    const { data, id, user, commentId } = options;

    if (data) {
      this.logger.log(`DATA: ${JSON.stringify(data)}`);
    }
    if (id) {
      this.logger.log(`IDEA: ${JSON.stringify(id)}`);
    }
    if (user) {
      this.logger.log(`USER: ${JSON.stringify(user)}`);
    }
    if (commentId) {
      this.logger.log(`COMMENT: ${JSON.stringify(commentId)}`);
    }
  }

  @Post('api/idea/:id/comment')
  @UseGuards(AuthGuard)
  comment(@Param('id') id: string, @Body() data: CommentDTO, @User('id') user) {
    this.logData({ id, data, user });
    return this.commentService.comment(id, data, user);
  }

  @Put('api/comments/:id')
  @UseGuards(AuthGuard)
  editComment(
    @Param('id') id: string,
    @Body() data: CommentDTO,
    @User('id') user,
  ) {
    this.logData({ commentId: id, data, user });
    return this.commentService.edit(id, data, user);
  }

  @Delete('api/comments/:id')
  @UseGuards(AuthGuard)
  deleteComment(@Param('id') id: string, @User('id') user) {
    this.logData({ commentId: id, user });
    return this.commentService.delete(id, user);
  }
}
