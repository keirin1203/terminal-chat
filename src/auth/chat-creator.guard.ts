import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";

@Injectable()
export class ChatCreatorGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()

    const user = await this.usersService.getUsersChat(req.user.username)
    const chatname = req.body.name

    let status
    user.chats.forEach(item => {
      if (item.name == chatname) {
        status = true
      }
    })

    if (status) {
      return true
    } else {
      throw new UnauthorizedException({message: "You do not have access to this chat"})
    }
  }
}
