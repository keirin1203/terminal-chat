import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Chat } from "../chats/chat.model";
import { User } from "../users/user.model";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, chat => chat.messages)
  @JoinTable()
  chat: Chat;

  @ManyToOne(() => User, user => user.messages)
  @JoinTable()
  author: User;

  @Column()
  text: string;

  @CreateDateColumn()
  created_at: Date;
}