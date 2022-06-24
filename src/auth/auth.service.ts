import {Body, HttpException, HttpStatus, Injectable, Post, UnauthorizedException} from '@nestjs/common';
import { CreateUserDto } from "./create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import {User} from "../users/user.model";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private UserService: UsersService,
    private JwtService: JwtService,
  ) { }


  async login(userDto: CreateUserDto): Promise<string> {
    const user = await this.validateUser(userDto.username, userDto.password)
    return this.generateToken(user)
  }

  async registration(userDto: CreateUserDto): Promise<string> {
    const {username, password} = userDto

    const candidate = await this.UserService.getUserByUserName(username)
    if (candidate) {
      throw new HttpException({message: `Пользователь ${username} уже существует`}, HttpStatus.BAD_REQUEST)
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await this.UserService.createUser(username, hash)

    return this.generateToken(user)
  }

  generateToken(user): string {
    return this.JwtService.sign({
      userId: user.id,
      username: user.username
    })
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.UserService.getUserByUserName(username)
    const passwordEquals = await bcrypt.compare(password, user.password)

    if (user && passwordEquals){
      return user
    }
    throw new UnauthorizedException({message: 'Неверный логин или пароль'})
  }
}
