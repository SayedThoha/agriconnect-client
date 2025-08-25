import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  HttpResponseModel,
  OtpData,
  UpdatePasswordRequest,
} from '../../core/models/commonModel';
import {
  LoginModel,
  LoginResponseModel,
  UserInfo,
} from '../../core/models/userModel';
import {
  expertData,
  Specialisation,
} from '../../features/admin/models/expertModel';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl;

  userRegister(data: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/user/userRegister`,
      data
    );
  }

  resendOtp(email: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/user/resendOtp`,
      email
    );
  }

  verifyOtp(data: OtpData): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/user/verifyOtp`,
      data
    );
  }

  userLogin(data: LoginModel): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(
      `${this.apiUrl}/user/login`,
      data
    );
  }

  verifyEmail(data: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/user/verifyEmail`,
      data
    );
  }

  updatePassword(data: UpdatePasswordRequest): Observable<HttpResponseModel> {
    return this.http.patch<HttpResponseModel>(
      `${this.apiUrl}/user/updatePassword`,
      data
    );
  }

  getuserDetails(data: { _id: string }): Observable<UserInfo> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<UserInfo>(`${this.apiUrl}/user/getuserDetails`, {
      params: httpParams,
    });
  }

  edit_user_profile_picture(data: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/user/edit_user_profile_picture`,
      data
    );
  }

  editUserProfile_name(data: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/user/editUserProfile_name`,
      data
    );
  }

  opt_for_new_email(data: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/user/opt_for_new_email`,
      data
    );
  }

  googleLogin(token: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/user/googleLogin`, { token });
  }

  checkUserStatus(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/status/${userId}`);
  }

  refreshUserToken(refreshToken: string) {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.apiUrl}/user/auth/refresh-token`,
      { refreshToken }
    );
  }

  getSpecialisation(): Observable<Specialisation[]> {
    return this.http.get<Specialisation[]>(
      `${this.apiUrl}/user/getSpecialisation`
    );
  }

  getExperts(): Observable<expertData[]> {
    return this.http.get<expertData[]>(`${this.apiUrl}/user/getExperts`);
  }

  getExpertDetails(data: any): Observable<expertData> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<expertData>(`${this.apiUrl}/user/getExpertDetails`, {
      params: httpParams,
    });
  }

  getSlots(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/user/getSlots`, {
      params: httpParams,
    });
  }

  addSlot(data: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/addSlots`, data);
  }

  getSlot(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/user/getSlot`, {
      params: httpParams,
    });
  }

  appointmnet_booking(data: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/appointment_booking`, data);
  }

  check_if_the_slot_available(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });

    return this.http.get<any>(
      `${this.apiUrl}/user/check_if_the_slot_available`,
      { params: httpParams }
    );
  }

  booking_payment(data: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/booking_payment`, data);
  }

  userDetails(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/user/userDetails`, {
      params: httpParams,
    });
  }

  get_booking_details_of_user(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });

    return this.http.get<any>(`${this.apiUrl}/user/get_booking_details`, {
      params: httpParams,
    });
  }

  cancelSlot(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/user/cancelSlot`, {
      params: httpParams,
    });
  }

  upcoming_appointment(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/user/upcoming_appointment`, {
      params: httpParams,
    });
  }

  getUpcomingSlot(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/user/getUpcomingSlot`, {
      params: httpParams,
    });
  }

  prescription_history(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/user/prescription_history`, {
      params: httpParams,
    });
  }

  get_prescription_details(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/user/get_prescription_details`, {
      params: httpParams,
    });
  }

  get_bookings_of_user(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/user/get_bookings_of_user`, {
      params: httpParams,
    });
  }

  getAllNotifications(data: any): Observable<any[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any[]>(`${this.apiUrl}/user/notifications`, {
      params: httpParams,
    });
  }

  markNotificationsAsRead(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/notifications/mark-as-read`, {
      userId,
    });
  }

  clearAllNotifications(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/notifications/clear`, {
      userId,
    });
  }
}
