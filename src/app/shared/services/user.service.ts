import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  HttpParamsInput,
  HttpResponseModel,
  OtpData,
  UpdatePasswordRequest,
} from '../../core/models/commonModel';
import {
  IUser,
  LoginModel,
  LoginResponseModel,
} from '../../core/models/userModel';
import {
  expertData,
  Specialisation,
} from '../../features/admin/models/expertModel';
import {
  BookedSlot,
  IPrescription,
  PaymentOrder,
  Slot,
} from '../../core/models/slotModel';
import { INotification } from '../../core/models/notificationModel';
import { AppointMent } from '../../features/admin/models/appointmentModel';
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

  getuserDetails(data: { _id: string }): Observable<IUser> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<IUser>(`${this.apiUrl}/user/getuserDetails`, {
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

  checkUserStatus(userId: string): Observable<{ blocked: boolean }> {
    return this.http.get<{ blocked: boolean }>(
      `${this.apiUrl}/user/status/${userId}`
    );
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

  getExpertDetails(data: HttpParamsInput): Observable<expertData> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<expertData>(`${this.apiUrl}/user/getExpertDetails`, {
      params: httpParams,
    });
  }

  getSlots(data: HttpParamsInput): Observable<Slot[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<Slot[]>(`${this.apiUrl}/user/getSlots`, {
      params: httpParams,
    });
  }

  addSlot(data: object): Observable<Slot[]> {
    return this.http.post<Slot[]>(`${this.apiUrl}/user/addSlots`, data);
  }

  getSlot(data: HttpParamsInput): Observable<Slot> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<Slot>(`${this.apiUrl}/user/getSlot`, {
      params: httpParams,
    });
  }

  appointmnet_booking(data: object): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/user/appointment_booking`,
      data
    );
  }

  check_if_the_slot_available(
    data: HttpParamsInput
  ): Observable<{ isAvailable: boolean; message: string }> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<{ isAvailable: boolean; message: string }>(
      `${this.apiUrl}/user/check_if_the_slot_available`,
      { params: httpParams }
    );
  }

  booking_payment(data: object): Observable<PaymentOrder> {
    return this.http.post<PaymentOrder>(
      `${this.apiUrl}/user/booking_payment`,
      data
    );
  }

  userDetails(data: HttpParamsInput): Observable<IUser> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<IUser>(`${this.apiUrl}/user/userDetails`, {
      params: httpParams,
    });
  }

  get_booking_details_of_user(
    data: HttpParamsInput
  ): Observable<AppointMent[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<AppointMent[]>(
      `${this.apiUrl}/user/get_booking_details`,
      {
        params: httpParams,
      }
    );
  }

  cancelSlot(data: HttpParamsInput): Observable<{ message: string }> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<{ message: string }>(
      `${this.apiUrl}/user/cancelSlot`,
      {
        params: httpParams,
      }
    );
  }

  upcoming_appointment(data: HttpParamsInput): Observable<BookedSlot> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<BookedSlot>(
      `${this.apiUrl}/user/upcoming_appointment`,
      {
        params: httpParams,
      }
    );
  }

  getUpcomingSlot(data: HttpParamsInput): Observable<BookedSlot> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<BookedSlot>(`${this.apiUrl}/user/getUpcomingSlot`, {
      params: httpParams,
    });
  }

  prescription_history(data: HttpParamsInput): Observable<IPrescription[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<IPrescription[]>(
      `${this.apiUrl}/user/prescription_history`,
      {
        params: httpParams,
      }
    );
  }

  get_prescription_details(data: HttpParamsInput): Observable<IPrescription> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<IPrescription>(
      `${this.apiUrl}/user/get_prescription_details`,
      {
        params: httpParams,
      }
    );
  }

  get_bookings_of_user(data: HttpParamsInput): Observable<BookedSlot> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<BookedSlot>(
      `${this.apiUrl}/user/get_bookings_of_user`,
      {
        params: httpParams,
      }
    );
  }

  getAllNotifications(data: HttpParamsInput): Observable<INotification[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<INotification[]>(`${this.apiUrl}/user/notifications`, {
      params: httpParams,
    });
  }

  markNotificationsAsRead(userId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/user/notifications/mark-as-read`,
      {
        userId,
      }
    );
  }

  clearAllNotifications(userId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/user/notifications/clear`,
      {
        userId,
      }
    );
  }
}
