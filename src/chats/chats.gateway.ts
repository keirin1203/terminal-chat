import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,} from '@nestjs/websockets';
import { Logger, } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatsService } from './chats.service';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(
    private chatsService: ChatsService,
    private messageService: MessagesService,
    private jwtService: JwtService
  ){}
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatsGateway');

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: string): void {
    const chatname = String(client.handshake.query.chatname)
    const username = client['user'].username

    this.messageService.createMessage(
      chatname,
      username,
      payload
    )
    this.messageToClient(
      chatname, 
      String(username), 
      payload)
  }

  handleDisconnect(client: Socket) {
    const chatname = String(client.handshake.query.chatname)
    const username = client['user'].username

    this.messageToClient(
      chatname, 
      'Server', 
      `Client disconnected ${username}`
      )
    this.logger.log(`Client disconnected: ${username}, chatroom: ${chatname}`);
  }

  async handleConnection(client: Socket) {
    const socketStatus = this.verifySocket(client)
    const chatStatus = await this.verifyChat(client)
    const chatname = String(client.handshake.query.chatname)
    const username = client['user'].username

    if (!socketStatus || !chatStatus) {
      client.emit('messageToClient', 'You do not have access')
      client.disconnect()
      return
    }

    client.join(chatname)

    await this.sendLastMessages(client, chatname)
    this.messageToClient(
      chatname ,
      'Server', 
      `Client connected ${username}`)
    this.logger.log(`Client connected: ${username}, chatroom: ${chatname}`);
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
      return true
    } catch (error) {
      return false
    }
  }

  async verifyChat(client: Socket) {
    const username = client['user'].username
    const chatname = String(client.handshake.query.chatname)
    const chatUsers = await this.chatsService.getChatUsers(chatname)

    if(!chatUsers) {
      client.emit('messageToClient', `Chat ${chatname} does not exist`)
      client.disconnect()
      return
    }

    for (const user of chatUsers) {
      if (user.username == username) {
        return true
      }
    }

    return false
  } 

  async sendLastMessages(client: Socket, chatname: string) {
    const lastMessages = await this.chatsService.getChatLastMessages(chatname)
    for (const message of lastMessages) {
      client.emit('messageToClient', `[${message.author.username}]: ${message.text}`)
    }
  }

  messageToClient(room: string, senderName: string, message: string){
    this.server.to(room).emit('messageToClient', `[${senderName}]: ${message}`)
  }
}
