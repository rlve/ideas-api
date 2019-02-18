import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller('api/idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}

  private logger = new Logger('IdeaController');

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createIdea(@Body() data: IdeaDTO) {
    this.logger.log(JSON.stringify(data));
    return this.ideaService.create(data);
  }

  @Get(':id')
  showIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
    this.logger.log(JSON.stringify(data));
    return this.ideaService.update(id, data);
  }

  @Delete(':id')
  deleteIdea(@Param('id') id: string) {
    return this.ideaService.delete(id);
  }
}
