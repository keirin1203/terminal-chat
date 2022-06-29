import { Injectable } from "@nestjs/common";
import { User } from "./user.model";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "src/chats/chat.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async checkUser(username: string): Promise<object> {
    const user = await this.usersRepository.findOne({
      where: {username: username}
    })
    
    if (user) {
      return {status: 'true'}
    }
    return {status: 'false'}
  }

  async getUserByUserName(username: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {username: username}
    })
  }

  async createUser(username: string, password: string): Promise<User> {
    return await this.usersRepository.save({
      username: username,
      password: password
    });
  }

  async getUserCreatedChats(username: string): Promise<Chat[]>{
    const user =  await this.usersRepository.findOne({
      where: {username: username},
      relations: ['chatsCreatedByUser']  
    })
    return user.chatsCreatedByUser
  }

  async getUserChats(username: string): Promise<Chat[]>{
    const user =  await this.usersRepository.findOne({
      where: {username: username},
      relations: ['chats']  
    })
    return user.chats
  }
}
