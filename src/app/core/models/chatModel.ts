import { IExpert } from './expertModel';
import { IUser } from './userModel';

export interface IMessage {
  _id: string;
  sender: IUser | IExpert;
  senderModel: 'User' | 'Expert';
  content: string;
  chat: string | IChat;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChat {
  _id: string;
  chatName: string;
  user: IUser;
  expert: IExpert;
  latestMessage?: IMessage;
  createdAt: Date;
  updatedAt: Date;
}
