import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from "typeorm";
import { Message } from "../messages/message.model";
import {Chat} from "../chats/chat.model";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Chat, chat => chat.creator)
  chats: Chat[]

  @OneToMany(() => Message, message => message.author)
  messages: Message[]

  @CreateDateColumn()
  created_at: Date;
}