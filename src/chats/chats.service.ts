import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Chat} from "./chat.model";
import {UsersService} from "../users/users.service";

@Injectable()
export class ChatsService {
  constructor(
    private UserService: UsersService,
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {
  }

  async getChatByName(name: string): Promise<Chat> {
    return await this.chatsRepository.findOne({
      where: {name: name}
    })
  }

  async createChat(name: string, creatorName: string, userNames: string[]) {
    const candidate = await this.getChatByName(name)

    if (candidate) {
      throw new HttpException(
        "Такой чат уже существует",
        HttpStatus.BAD_REQUEST)
    }

    const creator = await this.UserService.getUserByUserName(creatorName)
    let chat = await this.chatsRepository.create({
      name: name,
      creator: creator
    })

    let users = []
    for (const username of userNames) {
      const user = await this.UserService.getUserByUserName(username)
      users.push(user)
    }

    chat.users = users
    return this.chatsRepository.save(chat)
  }

  async addUsersToChat(chatName: string, userNames: string[]) {
    let chat = await this.chatsRepository.findOne({
      where: {name: chatName},
      relations: ['users']
    })

    if (!chat) {
      throw new HttpException(
        `Chat ${chatName} does not exist`,
        HttpStatus.BAD_REQUEST)
    }

    for (const username of userNames) {
      const user = await this.UserService.getUserByUserName(username)
      if (!user) {
        throw new HttpException(
          {message: `User ${username} does not exist`},
          HttpStatus.BAD_REQUEST)
      }

      chat.users.forEach(item => {
        if (item.username === user.username) {
          throw new HttpException(
            {message: `The ${item.username} is already in this chat`},
            HttpStatus.BAD_REQUEST)
        }
      })

      chat.users.push(user)
    }
    return this.chatsRepository.save(chat)
  }

  async test(chat){
    return await this.chatsRepository.findOne({
      where: {name: chat},
      relations: ['creator', 'users']
    })
  }
}
