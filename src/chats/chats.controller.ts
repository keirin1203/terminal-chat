import { Body, Controller, Post } from "@nestjs/common";
import { CreateChatDto } from "./create-chat.dto";
import { ChatsService } from "./chats.service";

@Controller('chats')
export class ChatsController {
  constructor(private ChatsService: ChatsService) {
  }

  @Post('add')
  createChat(@Body() dto: CreateChatDto) {
    return this.ChatsService.createChat(dto.name, dto.users)
  }
}
