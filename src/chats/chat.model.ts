import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany, ManyToOne
} from 'typeorm';
import { User } from "../users/user.model";
import { Message } from "../messages/message.model";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @ManyToOne(() => User, user => user.chatsCreatedByUser)
  creator: User

  @ManyToMany(() => User, user => user.chats)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];

  @CreateDateColumn()
  created_at: Date;
}