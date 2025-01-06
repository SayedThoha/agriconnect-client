import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpResponseModel, OtpData, UpdatePasswordRequest } from '../../core/models/commonModel';
import { LoginModel, LoginResponseModel ,UserInfo} from '../../core/models/userModel';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  private apiUrl: string =environment.apiUrl

  //register user
  // userRegister(data: any): Observable<HttpResponseModel> {
  //   console.log('userRegister services')
  //   return this._http.post<HttpResponseModel>(`${this._api}/user/userregister`, data);
  // }

  userRegister(data:object):Observable<HttpResponseModel>{
    return this.http.post<HttpResponseModel>(`${this.apiUrl}/user/userRegister`,data)
  }

//resendotp
resendOtp(email: object): Observable<HttpResponseModel> {
  console.log('resend otp')
  return this.http.post<HttpResponseModel>(`${this.apiUrl}/user/resendOtp`, email)
}

//verifyOtp
verifyOtp(data: OtpData): Observable<HttpResponseModel> {
  console.log('verify otp service')
  return this.http.post<HttpResponseModel>(`${this.apiUrl}/user/verifyOtp`, data)
}

//login user
userLogin(data: LoginModel): Observable<LoginResponseModel> {
  console.log('userLogin method triggered with data:', data);
  return this.http.post<LoginResponseModel>(`${this.apiUrl}/user/login`, data)
}

//verifyEmail_Forgetpassword
verifyEmail(data: object): Observable<HttpResponseModel> {
  return this.http.post<HttpResponseModel>(`${this.apiUrl}/user/verifyEmail`, data)
}

//newPassword
updatePassword(data: UpdatePasswordRequest): Observable<HttpResponseModel> {
  return this.http.post<HttpResponseModel>(`${this.apiUrl}/user/updatePassword`, data)
}

//get user profile
// getuserDetails(data: any): Observable<UserInfo>
getuserDetails(data:{ _id: string } ): Observable<UserInfo> {
  console.log('user profile _api')
  const httpParams = new HttpParams({ fromObject: data })
  return this.http.get<UserInfo>(`${this.apiUrl}/user/getuserDetails`, { params: httpParams })
}

edit_user_profile_picture(data:object): Observable<HttpResponseModel>{
  return this.http.post<HttpResponseModel>(`${this.apiUrl}/user/edit_user_profile_picture`, data)
}

editUserProfile_name(data: object): Observable<HttpResponseModel> {
  console.log('edit UserProfile_name service');
  return this.http.post<HttpResponseModel>(`${this.apiUrl}/user/editUserProfile_name`, data)
}

opt_for_new_email(data:object): Observable<HttpResponseModel> {
  console.log('edit opt_for_new_email service');
  return this.http.post<HttpResponseModel>(`${this.apiUrl}/user/opt_for_new_email`, data)
}
}
