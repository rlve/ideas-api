import { Controller, Post, Get, Body, Logger, UsePipes } from '@nestjs/common';

import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  private logger = new Logger('UserController');

  @Get('api/users')
  showAllUsers() {
    return this.userService.showAll();
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() data: UserDTO) {
    this.logger.log(`Login: ${data.username}`);
    return this.userService.login(data);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() data: UserDTO) {
    this.logger.log(`Register: ${data.username}`);
    return this.userService.create(data);
  }
}
