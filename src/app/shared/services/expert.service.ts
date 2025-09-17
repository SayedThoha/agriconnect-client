import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpParamsInput, OtpData } from '../../core/models/commonModel';
import { Observable } from 'rxjs';
import {
  HttpResponseModel,
  UpdatePasswordRequest,
} from '../../core/models/commonModel';

import {
  LoginModel,
  ExpertLoginResponseModel,
} from '../../core/models/expertModel';
import {
  expertData,
  Specialisation,
} from '../../features/admin/models/expertModel';
import { BookedSlot, IPrescription, Slot } from '../../core/models/slotModel';
import { INotification } from '../../core/models/notificationModel';

@Injectable({
  providedIn: 'root',
})
export class ExpertService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl;

  expertRegister(data: FormData): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/registration`,
      data
    );
  }

  getSpecialisation(): Observable<Specialisation[]> {
    return this.http.get<Specialisation[]>(
      `${this.apiUrl}/expert/specialisation`
    );
  }

  expertLogin(data: LoginModel): Observable<ExpertLoginResponseModel> {
    return this.http.post<ExpertLoginResponseModel>(
      `${this.apiUrl}/expert/login`,
      data
    );
  }

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

  verifyOtp(data: OtpData): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/verifyOtp`,
      data
    );
  }

  updatePassword(data: UpdatePasswordRequest): Observable<HttpResponseModel> {
    return this.http.patch<HttpResponseModel>(
      `${this.apiUrl}/expert/updatePassword`,
      data
    );
  }

  getExpertDetails(data: { _id: string }): Observable<expertData> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<expertData>(`${this.apiUrl}/expert/getExpertDetails`, {
      params: httpParams,
    });
  }

  editExpertProfile(data: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/editExpertProfile`,
      data
    );
  }

  edit_expert_profile_picture(data: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/edit_expert_profile_picture`,
      data
    );
  }

  opt_for_new_email(data: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/opt_for_new_email`,
      data
    );
  }

  checkExpertStatus(expertId: string): Observable<{ blocked: boolean }> {
    return this.http.get<{ blocked: boolean }>(
      `${this.apiUrl}/expert/status/${expertId}`
    );
  }

  getSlots(data: HttpParamsInput): Observable<Slot[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<Slot[]>(`${this.apiUrl}/expert/expertSlotDetails`, {
      params: httpParams,
    });
  }

  addSlots(data: object): Observable<HttpResponseModel> {
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/slotCreation`,
      data
    );
  }

  add_all_slots(data: object): Observable<Slot[]> {
    return this.http.post<Slot[]>(`${this.apiUrl}/expert/add_all_slots`, data);
  }

  removeSlot(data: HttpParamsInput): Observable<HttpResponseModel> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.delete<HttpResponseModel>(
      `${this.apiUrl}/expert/removeSlot`,
      { params: httpParams }
    );
  }

  get_booking_details_of_expert(
    data: HttpParamsInput
  ): Observable<BookedSlot[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<BookedSlot[]>(
      `${this.apiUrl}/expert/get_booking_details`,
      {
        params: httpParams,
      }
    );
  }

  get_bookings_of_expert(data: HttpParamsInput): Observable<BookedSlot[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<BookedSlot[]>(
      `${this.apiUrl}/expert/get_bookings_of_expert`,
      {
        params: httpParams,
      }
    );
  }

  get_expert_dashboard_details(
    data: HttpParamsInput
  ): Observable<BookedSlot[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<BookedSlot[]>(
      `${this.apiUrl}/expert/get_expert_dashboard_details`,
      { params: httpParams }
    );
  }

  upcomingAppointment(data: HttpParamsInput): Observable<BookedSlot> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<BookedSlot>(
      `${this.apiUrl}/expert/upcoming_appointment`,
      {
        params: httpParams,
      }
    );
  }

  updateUpcomingSlot(data: HttpParamsInput): Observable<BookedSlot> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<BookedSlot>(
      `${this.apiUrl}/expert/updateUpcomingSlot`,
      {
        params: httpParams,
      }
    );
  }

  update_consultationStatus(data: HttpParamsInput): Observable<BookedSlot> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<BookedSlot>(
      `${this.apiUrl}/expert/update_consultationStatus`,
      { params: httpParams }
    );
  }

  add_prescription(
    data: HttpParamsInput
  ): Observable<{ message: string; prescription: IPrescription }> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<{ message: string; prescription: IPrescription }>(
      `${this.apiUrl}/expert/add_prescription`,
      {
        params: httpParams,
      }
    );
  }

  share_roomId_through_email(
    data: HttpParamsInput
  ): Observable<{ message: string }> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<{ message: string }>(
      `${this.apiUrl}/expert/share_roomId_through_email`,
      { params: httpParams }
    );
  }

  refreshExpertToken(refreshToken: string) {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.apiUrl}/expert/auth/refresh-token`,
      { refreshToken }
    );
  }

  get_prescription_details(data: HttpParamsInput): Observable<IPrescription> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<IPrescription>(
      `${this.apiUrl}/expert/get_prescription_details`,
      { params: httpParams }
    );
  }

  getPrescriptionHistory(data: HttpParamsInput): Observable<IPrescription[]> {
    new HttpParams({ fromObject: data });
    return this.http.get<IPrescription[]>(
      `${this.apiUrl}/expert/prescriptions`
    );
  }

  getAllNotifications(data: HttpParamsInput): Observable<INotification[]> {
    const httpParams = new HttpParams({ fromObject: data });
    return this.http.get<INotification[]>(
      `${this.apiUrl}/expert/notifications`,
      {
        params: httpParams,
      }
    );
  }

  markNotificationsAsRead(expertId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/expert/notifications/mark-as-read`,
      {
        expertId,
      }
    );
  }

  clearAllNotifications(expertId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/expert/notifications/clear`,
      {
        expertId,
      }
    );
  }
}
