import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./create-user.dto";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
  constructor(private UserService: UsersService) {
  }

  @Post('add')
  add(@Body() user: CreateUserDto) {
    return this.UserService.createUser(user)
  }
}
