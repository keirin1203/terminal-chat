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
    const username = client.handshake.query.username;

    this.messageToClient(String(username), payload)
  }

  handleDisconnect(client: Socket) {
    const username = client.handshake.query.username;

    this.messageToClient('Server', `Client disconnected ${username}`)
    this.logger.log(`Client disconnected: ${username}`);
  }

  handleConnection(client: Socket) {
    const username = client.handshake.query.username;

    this.messageToClient('Server', `Client connected ${username}`)
    this.logger.log(`Client connected: ${username}`);
  }

  messageToClient(senderName: string, message: string){
    this.server.emit('messageToClient', `[${senderName}]: ${message}`)
  }
}
