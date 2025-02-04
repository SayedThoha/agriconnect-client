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
import { expertData, specialisation } from '../../features/admin/models/expertModel';
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

  //resendotp
  resendOtp(email: object): Observable<HttpResponseModel> {
    console.log('resend otp');
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/user/resendOtp`,
      email
    );
  }

  //verifyOtp
  verifyOtp(data: OtpData): Observable<HttpResponseModel> {
    console.log('verify otp service');
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/user/verifyOtp`,
      data
    );
  }

  //login user
  userLogin(data: LoginModel): Observable<LoginResponseModel> {
    console.log('userLogin method triggered with data:', data);
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
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/user/updatePassword`,
      data
    );
  }

  // getuserDetails(data: { _id: string }): Observable<UserInfo> {
  getuserDetails(data: { _id: string }): Observable<UserInfo> {
    console.log('user profile _api', data);
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
    console.log('edit UserProfile_name service');
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/user/editUserProfile_name`,
      data
    );
  }

  opt_for_new_email(data: object): Observable<HttpResponseModel> {
    console.log('edit opt_for_new_email service');
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/user/opt_for_new_email`,
      data
    );
  }

  googleLogin(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/googleLogin`, { token });
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
  

  getSpecialisation(): Observable<specialisation[]> {
    return this.http.get<specialisation[]>(`${this.apiUrl}/user/getSpecialisation`)
  }

  getExperts(): Observable<expertData[]> {
    return this.http.get<expertData[]>(`${this.apiUrl}/user/getExperts`)
  }

  getExpertDetails(data: any): Observable<expertData> {
    const httpParams = new HttpParams({ fromObject: data })
    return this.http.get<expertData>(`${this.apiUrl}/user/getExpertDetails`, { params: httpParams })
  }

  getSlots(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this.http.get<any>(`${this.apiUrl}/user/getSlots`, { params: httpParams })
  }

  addSlot(data: Object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/addSlots`, data)
  }


   //get a particular slot
   getSlot(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this.http.get<any>(`${this.apiUrl}/user/getSlot`, { params: httpParams })
  }

  //submit appointmnet letter
  appointmnet_booking(data: Object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/appointment_booking`, data)
  }

  check_if_the_slot_available(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    console.log('httpParams contains slotId:',httpParams)
    return this.http.get<any>(`${this.apiUrl}/user/check_if_the_slot_available`, { params: httpParams })
  }

  //payment for slot booking
  booking_payment(data: Object): Observable<any> {
    console.log('razorpay booking service');
    return this.http.post<any>(`${this.apiUrl}/user/booking_payment`, data)
  }

  userDetails(data: any): Observable<any> {
    console.log('wallet_details service');
    const httpParams = new HttpParams({ fromObject: data })
    return this.http.get<any>(`${this.apiUrl}/user/userDetails`, { params: httpParams })
  }

  //get booking details of this user
  get_booking_details_of_user(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    console.log('data', FormDataEvent);
    return this.http.get<any>(`${this.apiUrl}/user/get_booking_details`, { params: httpParams })
  }

  //to cancel slot
  cancelSlot(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this.http.get<any>(`${this.apiUrl}/user/cancelSlot`, { params: httpParams })
  }

  upcoming_appointment(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this.http.get<any>(`${this.apiUrl}/user/upcoming_appointment`, { params: httpParams })
  }

  getUpcomingSlot(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this.http.get<any>(`${this.apiUrl}/user/getUpcomingSlot`, { params: httpParams })
  }

  prescription_history(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this.http.get<any>(`${this.apiUrl}/user/prescription_history`, { params: httpParams })
  }

  get_prescription_details(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this.http.get<any>(`${this.apiUrl}/user/get_prescription_details`, { params: httpParams })
  }
  
  get_bookings_of_user(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this.http.get<any>(`${this.apiUrl}/user/get_bookings_of_user`, { params: httpParams })
  }

}
