import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs';
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

  sendMessage(message: any): void {
  
    this.socket.emit('newMessage', message);
  }

  onMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('messageReceived', (data: any) => {
      
        observer.next(data);
      });
    });
  }

  messageSendfromUser(data: any) {
  
    this.socket.emit('newMessage', data);
  }

  messageSendfromExpert(data: any) {
  
    this.socket.emit('newMessage', data);
  }


 
 
 onNotification(): Observable<any> {
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
