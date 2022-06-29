import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./message.model";
import { ChatsService } from "../chats/chats.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class MessagesService {
  constructor(
    private ChatService: ChatsService,
    private UserService: UsersService,

    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async createMessage(chatName: string, author: string, text: string): Promise<Message> {
    let chat = await this.ChatService.getChatByName(chatName)
    let user = await this.UserService.getUserByUserName(author)

    if (!chat || !user) {
      throw new HttpException(
        "Такого пользователя или чата не существует",
        HttpStatus.BAD_REQUEST
      )
    }

    let message = this.messagesRepository.create({
      chat: chat,
      author: user,
      text: text
    })
    return this.messagesRepository.save(message)
  }

}
