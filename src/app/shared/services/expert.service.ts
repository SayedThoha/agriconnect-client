import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OtpData } from '../../core/models/commonModel';
import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpResponseModel,
  UpdatePasswordRequest,
} from '../../core/models/commonModel';

import {
  LoginModel,
  ExpertLoginResponseModel,
  // ExpertData,
  // Specialization,
} from '../../core/models/expertModel';
import {
  expertData,
  specialisation,
} from '../../features/admin/models/expertModel';

@Injectable({
  providedIn: 'root',
})
export class ExpertService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl;

  //Expert registration
  expertRegister(data: FormData): Observable<HttpResponseModel> {
    // Log FormData entries
    for (const [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }
    return this.http
      .post<HttpResponseModel>(`${this.apiUrl}/expert/registration`, data)
      .pipe(
        catchError((error) => {
          console.error('Registration failed:', error.error);
          return throwError(
            () => new Error('Registration failed. Please try again.')
          );
        })
      );
  }

  getSpecialisation(): Observable<specialisation> {
    return this.http.get<specialisation>(
      `${this.apiUrl}/expert/specialisation`
    );
  }

  //Expert login
  expertLogin(data: LoginModel): Observable<ExpertLoginResponseModel> {
    return this.http.post<ExpertLoginResponseModel>(
      `${this.apiUrl}/expert/login`,
      data
    );
  }

  //verifyEmail_Forgetpassword
  verifyEmail(data: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/verifyEmail`,
      data
    );
  }

  //resendotp
  resendOtp(email: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/resendOtp`,
      email
    );
  }

  //verifyOtp
  verifyOtp(data: OtpData): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/verifyOtp`,
      data
    );
  }

  //newPassword
  updatePassword(data: UpdatePasswordRequest): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/updatePassword`,
      data
    );
  }

  //get experts details
  getExpertDetails(data: { _id: string }): Observable<expertData> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<expertData>(`${this.apiUrl}/expert/getExpertDetails`, {
      params: httpParams,
    });
  }

  //edit expert profile
  editExpertProfile(data: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/editExpertProfile`,
      data
    );
  }

  edit_expert_profile_picture(data:object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/edit_expert_profile_picture`,
      data
    );
  }


  opt_for_new_email(data: object): Observable<HttpResponseModel> {
    console.log('edit opt_for_new_email service');
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/opt_for_new_email`,
      data
    );
  }

  checkExpertStatus(expertId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/expert/status/${expertId}`);
  }

  //get slots for expert
  getSlots(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/expert/expertSlotDetails`, {
      params: httpParams,
    });
  }

  //add slot for expert
  addSlots(data: Object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/slotCreation`,
      data
    );
  }

  add_all_slots(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/expert/add_all_slots`, data);
  }

  removeSlot(data: any): Observable<HttpResponseModel> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.delete<HttpResponseModel>(
      `${this.apiUrl}/expert/RemoveSlot`,
      { params: httpParams }
    );
  }

  get_booking_details_of_expert(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/expert/get_booking_details`, {
      params: httpParams,
    });
  }

  get_bookings_of_expert(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/expert/get_bookings_of_doctor`, {
      params: httpParams,
    });
  }

  get_expert_dashboard_details(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(
      `${this.apiUrl}/expert/get_expert_dashboard_details`,
      { params: httpParams }
    );
  }

  // upcomingAppointment(data: upcomingAppointment): Observable<any> {
  //   const httpParams = new HttpParams({ fromObject: data })
  //   return this.http.get<any>(`${this.apiUrl}/expert/upcoming_appointment`, { params: httpParams })
  // }

  updateUpcomingSlot(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/expert/updateUpcomingSlot`, {
      params: httpParams,
    });
  }

  update_consultationStatus(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(
      `${this.apiUrl}/expert/update_consultationStatus`,
      { params: httpParams }
    );
  }

  add_prescription(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(`${this.apiUrl}/expert/add_prescription`, {
      params: httpParams,
    });
  }

  share_roomId_through_email(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<any>(
      `${this.apiUrl}/expert/share_roomId_through_email`,
      { params: httpParams }
    );
  }

  refreshToken(refreshToken: string) {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.apiUrl}/expert/auth/refresh-token`,
      { refreshToken }
    );
  }

}
