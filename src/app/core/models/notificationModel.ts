import { IExpert } from './expertModel';
import { IUser } from './userModel';

export interface INotification {
  userId: IUser;
  expertId: IExpert;
  message: string;
  type: string;
  isReadByUser: boolean;
  isReadByExpert: boolean;
  isClearedByUser: boolean;
  isClearedByExpert: boolean;
  createdAt: Date;
}
