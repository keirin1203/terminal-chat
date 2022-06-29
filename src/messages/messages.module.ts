import { Module, forwardRef } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { UsersModule } from "../users/users.module";
import { ChatsModule } from "../chats/chats.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./message.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    forwardRef(() => ChatsModule),
    TypeOrmModule.forFeature([Message])
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports:[MessagesService]
})
export class MessagesModule {}
