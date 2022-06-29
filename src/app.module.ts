import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from "./users/user.model";
import { ChatsModule } from './chats/chats.module';
import { Chat } from "./chats/chat.model";
import { MessagesModule } from './messages/messages.module';
import { Message } from "./messages/message.model";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import 'dotenv/config'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Chat, Message],
      synchronize: true,
      logging: false,
      logger: 'advanced-console',
    }),
    UsersModule,
    ChatsModule,
    MessagesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
