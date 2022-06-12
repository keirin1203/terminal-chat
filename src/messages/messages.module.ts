import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { UsersModule } from "../users/users.module";
import { ChatsModule } from "../chats/chats.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./message.model";

@Module({
  imports: [
    UsersModule,
    ChatsModule,
    TypeOrmModule.forFeature([Message])
  ],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {}