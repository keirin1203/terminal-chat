import { Body, Controller, Post } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./create-message.dto";

@Controller('messages')
export class MessagesController {
  constructor(private MessagesService: MessagesService) {
  }

  @Post('add')
  createMessage(@Body() dto: CreateMessageDto) {
    return this.MessagesService.createMessage(dto.chat, dto.author, dto.text)
  }
}
