import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpParamsInput } from '../../core/models/commonModel';
import { IChat, IMessage } from '../../core/models/chatModel';

@Injectable({
  providedIn: 'root',
})
export class ChatServiceService {
  constructor(private _http: HttpClient) {}

  private apiUrl: string = environment.apiUrl;

  accessChat(data: HttpParamsInput): Observable<IChat> {
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get<IChat>(`${this.apiUrl}/user/userAccessChat`, {
      params: httpParams,
    });
  }

  userFetchAllChat(data: HttpParamsInput): Observable<IChat[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get<IChat[]>(`${this.apiUrl}/user/userFetchAllChat`, {
      params: httpParams,
    });
  }

  sendMessage(data: object): Observable<IMessage> {
    return this._http.post<IMessage>(`${this.apiUrl}/user/sendMessage`, data);
  }

  userFetchAllMessages(data: HttpParamsInput): Observable<IMessage[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get<IMessage[]>(
      `${this.apiUrl}/user/userFetchAllMessages`,
      {
        params: httpParams,
      }
    );
  }

  expert_accessed_chats(data: HttpParamsInput): Observable<IChat[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get<IChat[]>(
      `${this.apiUrl}/expert/expert_accessed_chats`,
      {
        params: httpParams,
      }
    );
  }

  expertFetchAllMessages(data: HttpParamsInput): Observable<IMessage[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get<IMessage[]>(
      `${this.apiUrl}/expert/expertFetchAllMessages`,
      {
        params: httpParams,
      }
    );
  }

  expertSendMessage(data: object): Observable<IMessage> {
    return this._http.post<IMessage>(
      `${this.apiUrl}/expert/expertSendMessage`,
      data
    );
  }
}
