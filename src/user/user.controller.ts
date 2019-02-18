import { Controller, Post, Get, Body, Logger } from '@nestjs/common';

import { UserService } from './user.service';
import { UserDTO } from './user.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  private logger = new Logger('UserController');

  @Get('api/users')
  showAllUsers() {
    return this.userService.showAll();
  }

  @Post('login')
  login(@Body() data: UserDTO) {
    // this.logger.log(`User ${data.username} logged in.`);
  }

  @Post('register')
  register(@Body() data: UserDTO) {
    this.logger.log(data.password);
    return this.userService.create(data);
  }
}
