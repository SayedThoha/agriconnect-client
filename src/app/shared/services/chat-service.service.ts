import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatServiceService {
  constructor(private _http: HttpClient) {}

  private apiUrl: String = environment.apiUrl;

  //access chat userSide
  accessChat(data: any): Observable<any> {
    // console.log('access chat from userSide');
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get(`${this.apiUrl}/user/userAccessChat`, {
      params: httpParams,
    });
  }

  //userFetchAllChat
  userFetchAllChat(data: any): Observable<any> {
    // console.log('userFetchAllChat from userSide');
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get(`${this.apiUrl}/user/userFetchAllChat`, {
      params: httpParams,
    });
  }

  //send message service userSide
  sendMessage(data: Object): Observable<any> {
    //any refer the chat interface
    // console.log('send message from user service');
    return this._http.post<any>(`${this.apiUrl}/user/sendMessage`, data);
  }

  //userFetchAllMessages
  userFetchAllMessages(data: any): Observable<any> {
    // console.log('userFetchAllMessages from userSide');
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get(`${this.apiUrl}/user/userFetchAllMessages`, {
      params: httpParams,
    });
  }

  //expert_accessed_chats
  expert_accessed_chats(data: any): Observable<any> {
    // console.log('expert_accessed_chats from userSide');
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get(`${this.apiUrl}/expert/expert_accessed_chats`, {
      params: httpParams,
    });
  }

  expertFetchAllMessages(data: any): Observable<any> {
    // console.log('expertFetchAllMessages from userSide');
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get(`${this.apiUrl}/expert/expertFetchAllMessages`, {
      params: httpParams,
    });
  }

  expertSendMessage(data: Object): Observable<any> {
    //any refer the chat interface
    // console.log('send message from expert service');
    return this._http.post<any>(
      `${this.apiUrl}/expert/expertSendMessage`,
      data
    );
  }
}
