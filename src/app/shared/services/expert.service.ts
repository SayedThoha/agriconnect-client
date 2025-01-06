import { HttpClient, HttpParams } from '@angular/common/http';
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
    return this.http.post<HttpResponseModel>(
      `${this.apiUrl}/expert/registration`,
      data
    ).pipe(
      catchError(error => {
        console.error('Registration failed:', error);
        return throwError(() => new Error('Registration failed. Please try again.'));
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

  edit_expert_profile_picture(data: object): Observable<HttpResponseModel> {
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
}
