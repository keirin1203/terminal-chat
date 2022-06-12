import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./user.model";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUserByUserName(username: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {username: username}
    })
  }

  async createUser(user: CreateUserDto) {
    const candidate = await this.getUserByUserName(user.username)

    if (candidate) {
      throw new HttpException(
        "Такой пользователь уже существует",
        HttpStatus.BAD_REQUEST)
    }

    return await this.usersRepository.save(user);
  }
}
