import {Controller, Get, Query, UseGuards} from "@nestjs/common";
import { UsersService } from "./users.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('users')
export class UsersController {
  constructor(private UserService: UsersService) {
  }

  @Get('check')
  checkUserByUsername(@Query('username') username: string){
    console.log(username)
    return this.UserService.checkUser(username)
  }
}
