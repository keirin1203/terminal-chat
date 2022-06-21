import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatsGateway');

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: string): void {
    this.messageToClient(client.id, payload)
  }

  handleDisconnect(client: Socket) {
    this.messageToClient('Server', `Client disconnected ${client.id}`)
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.messageToClient('Server', `Client connected ${client.id}`)
    this.logger.log(`Client connected: ${client.id}`);
  }

  messageToClient(senderName: string, message: string){
    this.server.emit('messageToClient', `[${senderName}]: ${message}`)
  }
}
