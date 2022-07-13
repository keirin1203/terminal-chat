import {Body, Controller, Post, UseGuards, Request, Get, Query} from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatsService } from "./chats.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {AddUserDto} from "./dto/add-user.dto";
import {ChatCreatorGuard} from "../auth/chat-creator.guard";

@Controller('chats')
export class ChatsController {
  constructor(private ChatsService: ChatsService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  createChat(@Body() dto: CreateChatDto, @Request() request) {
    return this.ChatsService.createChat(dto.name, request.user.username, dto.users)
  }

  @UseGuards(JwtAuthGuard, ChatCreatorGuard)
  @Post('addUsersToChat')
  addUserToChat(@Body() dto: AddUserDto) {
    return this.ChatsService.addUsersToChat(dto.name, dto.users)
  }

  @Get('test')
  test(@Query('chat') chat){
    return this.ChatsService.test(chat)
  }
}
