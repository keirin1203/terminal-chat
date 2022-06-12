import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from "./users/user.model";
import { ChatsModule } from './chats/chats.module';
import { Chat } from "./chats/chat.model";
import { MessagesModule } from './messages/messages.module';
import { Message } from "./messages/message.model";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'terminal-chat',
      entities: [User, Chat, Message],
      synchronize: true,
      logging: true,
      logger: 'advanced-console',
    }),
    UsersModule,
    ChatsModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
