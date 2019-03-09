import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  UsePipes,
  Param,
  Query,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { UserRO } from './user.ro';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  private logger = new Logger('UserController');

  @Get('api/users')
  showAllUsers(@Query('page') page: number): Promise<UserRO[]> {
    return this.userService.showAll(page);
  }

  @Get('api/users/:id')
  showOneUsers(@Param('id') id: string): Promise<UserRO> {
    return this.userService.showOne(id);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() data: UserDTO): Promise<UserRO> {
    this.logger.log(`Login: ${data.username}`);
    return this.userService.login(data);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() data: UserDTO): Promise<UserRO> {
    this.logger.log(`Register: ${data.username}`);
    return this.userService.create(data);
  }
}
