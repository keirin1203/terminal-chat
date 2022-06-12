import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany
} from 'typeorm';
import { User } from "../users/user.model";
import { Message } from "../messages/message.model";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];

  @CreateDateColumn()
  created_at: Date;
}