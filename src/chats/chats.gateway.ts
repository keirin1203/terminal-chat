import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsException,} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatsService } from './chats.service';
import { JwtSocketAuthGuard } from 'src/auth/jwt-socket.guard';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'socket.io/dist/client';

@WebSocketGateway()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(
    private chatsService: ChatsService,
    private jwtService: JwtService
  ){}
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatsGateway');

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: string): void {
    const chatname = String(client.handshake.query.chatname)
    const username = client['user'].username

    this.messageToClient(chatname, String(username), payload)
  }

  handleDisconnect(client: Socket) {
    const chatname = String(client.handshake.query.chatname)
    const username = client['user'].username

    this.messageToClient(chatname, 'Server', `Client disconnected ${username}`)
    this.logger.log(`Client disconnected: ${username}, chatroom: ${chatname}`);
  }

  handleConnection(client: Socket) {
    const status = this.verifySocket(client)
    if (status === false) {
      client.emit('messageToClient', 'Необходима авторизация')
      client.disconnect()
      return
    }

    const chatname = String(client.handshake.query.chatname)
    const username = client['user'].username

    client.join(chatname)
    this.messageToClient(chatname ,'Server', `Client connected ${username}`)

    this.logger.log(`Client connected: ${username}, chatroom: ${chatname}`);
  }

  messageToClient(room: string, senderName: string, message: string){
    this.server.to(room).emit('messageToClient', `[${senderName}]: ${message}`)
  }

  verifySocket(client: Socket): boolean {
    try {
      const authHeader = client.handshake.auth.token;
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]


      if (bearer !== 'Bearer' || !token) {
        return false
      }

      const user = this.jwtService.verify(token);

      client['user'] = user;

    } catch (error) {
      return false
    }
  }
}
