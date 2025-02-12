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
    // console.log('sendMessage:', message);
    this.socket.emit('newMessage', message);
  }

  onMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('messageReceived', (data: any) => {
        // console.log('message receives:', data);
        observer.next(data);
      });
    });
  }

  messageSendfromUser(data: any) {
    // console.log('data from user:', data);
    this.socket.emit('newMessage', data);
  }

  messageSendfromExpert(data: any) {
    // console.log('data from expert:', data);
    this.socket.emit('newMessage', data);
  }
}
