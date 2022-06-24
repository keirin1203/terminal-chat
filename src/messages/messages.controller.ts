import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./create-message.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('messages')
export class MessagesController {
  constructor(private MessagesService: MessagesService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  createMessage(@Body() dto: CreateMessageDto) {
    return this.MessagesService.createMessage(dto.chat, dto.author, dto.text)
  }
}
