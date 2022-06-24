import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from "typeorm";
import { Message } from "../messages/message.model";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Message, message => message.author)
  messages: Message[]

  @CreateDateColumn()
  created_at: Date;
}