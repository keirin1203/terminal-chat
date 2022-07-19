import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {JwtService} from "@nestjs/jwt";
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtSocketAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient()

    try {
      const authHeader = client.handshake.auth.token;
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]


      if (bearer !== 'Bearer' || !token) {
        throw new WsException({message: "Необходима авторизация!"})
      }

      const user = this.jwtService.verify(token);

      client.user = user;

      return true
    } catch (error) {
      throw new WsException({message: "Необходима авторизация!"})
    }
  }
}