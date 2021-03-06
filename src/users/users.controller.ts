import {Controller, Get, Query, Request, UseGuards} from "@nestjs/common";
import { UsersService } from "./users.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {
  }

  @Get('check')
  checkUserByUsername(@Query('username') username: string){
    return this.userService.checkUser(username)
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkByToken')
  checkUserByToken(@Request() request) {
    return request.user.username
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUserChats')
  getUserChats(@Request() request){
    return this.userService.getUserChats(request.user.username)
  }

  @Get('getUserList')
  getUserList(){
    return this.userService.getUserList()
  }
}
