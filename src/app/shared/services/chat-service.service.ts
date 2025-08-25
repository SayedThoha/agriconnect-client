import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatServiceService {
  constructor(private _http: HttpClient) {}

  private apiUrl: string = environment.apiUrl;

  accessChat(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get(`${this.apiUrl}/user/userAccessChat`, {
      params: httpParams,
    });
  }

  userFetchAllChat(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get(`${this.apiUrl}/user/userFetchAllChat`, {
      params: httpParams,
    });
  }

  sendMessage(data: object): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/user/sendMessage`, data);
  }

  userFetchAllMessages(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get(`${this.apiUrl}/user/userFetchAllMessages`, {
      params: httpParams,
    });
  }

  expert_accessed_chats(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get(`${this.apiUrl}/expert/expert_accessed_chats`, {
      params: httpParams,
    });
  }

  expertFetchAllMessages(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get(`${this.apiUrl}/expert/expertFetchAllMessages`, {
      params: httpParams,
    });
  }

  expertSendMessage(data: object): Observable<any> {
    return this._http.post<any>(
      `${this.apiUrl}/expert/expertSendMessage`,
      data
    );
  }
}
