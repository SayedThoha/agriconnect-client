
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs';
import { IMessage } from '../../core/models/chatModel';
import { INotification } from '../../core/models/notificationModel';
@Injectable({
  providedIn: 'root',
})
export class SocketServiceService {
  private socket: Socket;
  private _baseUrl: string = environment.apiUrl;

  constructor() {
    this.socket = io(this._baseUrl);
  }

  register(userId: string) {
    this.socket.emit('register', userId);
  }

  sendMessage(message: {
    content: string;
    chatId: string;
    userId: string;
  }): void {
    this.socket.emit('newMessage', message);
  }

  onMessage(): Observable<IMessage> {
    return new Observable((observer) => {
      this.socket.on('messageReceived', (data) => {
        observer.next(data);
      });
    });
  }

  messageSendfromUser(data: IMessage) {
    this.socket.emit('newMessage', data);
  }

  messageSendfromExpert(data: IMessage) {
    this.socket.emit('newMessage', data);
  }

  onNotification(): Observable<INotification> {
    return new Observable((observer) => {
      this.socket.on('notification', (message) => {
        observer.next(message);
      });
    });
  }

  markNotificationsAsRead() {
    this.socket.emit('notificationsRead');
  }
}
