import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from "./chat.model";
import { UsersService } from "../users/users.service";

@Injectable()
export class ChatsService {
  constructor(
    private UserService: UsersService,

    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {}

  async getChatByName(name: string): Promise<Chat> {
    return await this.chatsRepository.findOne({
      where: { name: name }
    })
  }

  async createChat(name: string, usersNames: string[]) {
    const candidate = await this.getChatByName(name)

    if (candidate) {
      throw new HttpException(
        "Такой чат уже существует",
        HttpStatus.BAD_REQUEST)
    }

    let chat = await this.chatsRepository.create({name: name})

    let users = []
    for (const username of usersNames) {
      const user = await this.UserService.getUserByUserName(username)
      users.push(user)
    }

    chat.users = users
    return this.chatsRepository.save(chat)
  }

  async addUserToChat(username: string, chatName: string) {
    let chat = await this.chatsRepository.findOne({
      where: {name: chatName}
    })

    if (!chat) {
      throw new HttpException(
        `Чата ${chatName} не существует`,
        HttpStatus.BAD_REQUEST)
    }

    let user = await this.UserService.getUserByUserName(username)

    if (!user) {
      throw new HttpException(
        `Пользователя ${username} не существует`,
        HttpStatus.BAD_REQUEST)
    }

    chat.users.push(user)
    return await this.chatsRepository.save(chat)
  }

}
