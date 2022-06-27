import { Injectable } from "@nestjs/common";
import { User } from "./user.model";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";

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
      return {
        status: 'true'
      }
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

  async getUsersChat(username: string): Promise<User>{
    return await this.usersRepository.findOne({
      where: {username: username},
      relations: ['chats']  
    })
  }

  async test(name){
    return await this.usersRepository.findOne({
      where: {username: name},
      relations: ['chats']
    })
  }
}
