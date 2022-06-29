import { Module, forwardRef } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "./chat.model";
import { UsersModule } from "../users/users.module";
import {ChatsGateway} from "./chats.gateway";
import {AuthModule} from "../auth/auth.module";
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    forwardRef(() => MessagesModule),
    UsersModule,
    AuthModule
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway],
  exports: [ChatsService]
})
export class ChatsModule {}
