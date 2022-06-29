import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Chat} from "./chat.model";
import {UsersService} from "../users/users.service";
import { User } from "src/users/user.model";
import { Message } from "src/messages/message.model";

@Injectable()
export class ChatsService {
  constructor(
    private userService: UsersService,
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {}

  async getChatByName(name: string): Promise<Chat> {
    return await this.chatsRepository.findOne({
      where: {name: name}
    })
  }

  async createChat(name: string, creatorName: string, userNames: string[]): Promise<Chat> {
    const candidate = await this.getChatByName(name)
    if (candidate) {
      throw new HttpException(
        "Такой чат уже существует",
        HttpStatus.BAD_REQUEST)
    }

    const creator = await this.userService.getUserByUserName(creatorName)
    let chat = await this.chatsRepository.save({
      name: name,
      creator: creator,
      users: [creator]
    })

    return this.addUsersToChat(chat.name, userNames)
  }

  async addUsersToChat(chatName: string, userNames: string[]): Promise<Chat> {
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
      const user = await this.userService.getUserByUserName(username)
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

  async getChatUsers(chatname: string): Promise<User[]> {
    const chat = await this.chatsRepository.findOne({
      where: {name: chatname},
      relations: ['users']
    })
    if (!chat) {
      return null
    }

    return chat.users
  }

  async getChatLastMessages(chatName: string): Promise<Message[]> {
    let chat = await this.chatsRepository.findOne({
      where: {name: chatName},
      relations: ['messages', 'messages.author']
    })
    if (!chat) {
      throw new HttpException(
        `Chat ${chatName} does not exist`,
        HttpStatus.BAD_REQUEST)
    }

    return chat.messages
  }

  async test(chat){
    return await this.chatsRepository.findOne({
      where: {name: chat},
      relations: ['creator', 'users']
    })
  }
}
