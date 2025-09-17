import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Adminlogin } from '../store/admin.state';
import { HttpClient, HttpParams } from '@angular/common/http';
import { adminLoginResponse, HttpResponseModel } from '../models/commonModel';
import {
  expertData,
  ExpertKyc,
  IKycVerificationPayload,
  kyc_verification,
  Specialisation,
} from '../models/expertModel';
import { userdata } from '../models/userModel';
import { AdminDashboardResponse } from '../models/dashboardModel';
import { AppointMent } from '../models/appointmentModel';

type HttpParamsInput = Record<
  string,
  string | number | boolean | readonly (string | number | boolean)[]
>;

@Injectable({
  providedIn: 'root',
})
export class AdminServiceService {
  private api: string = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  adminLogin(data: Adminlogin): Observable<adminLoginResponse> {
    return this._http.post<adminLoginResponse>(`${this.api}/admin/login`, data);
  }

  getExperts(params: Record<string, string>): Observable<expertData[]> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this._http.get<expertData[]>(`${this.api}/admin/expertdata`, {
      params: httpParams,
    });
  }

  expertBlock(data: object): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(
      `${this.api}/admin/expertBlock`,
      data
    );
  }

  getUsers(): Observable<userdata[]> {
    return this._http.get<userdata[]>(`${this.api}/admin/userdata`);
  }

  userBlock(data: object): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(
      `${this.api}/admin/userBlock`,
      data
    );
  }

  userDetails(data: object): Observable<userdata> {
    return this._http.post<userdata>(`${this.api}/admin/userDetails`, data);
  }

  searchUser(data: object): Observable<userdata[]> {
    return this._http.post<userdata[]>(`${this.api}/admin/searchUser`, data);
  }

  searchExpert(data: object): Observable<expertData[]> {
    return this._http.post<expertData[]>(
      `${this.api}/admin/searchExpert`,
      data
    );
  }

  getSpecialisation(): Observable<Specialisation[]> {
    return this._http.get<Specialisation[]>(
      `${this.api}/admin/getSpecialisation`
    );
  }

  addSpecialisation(data: object): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(
      `${this.api}/admin/addSpecialisation`,
      data
    );
  }

  editSpecialisation(data: Specialisation): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(
      `${this.api}/admin/editSpecialisation`,
      data
    );
  }
  deleteSpecialisation(data: Specialisation): Observable<HttpResponseModel> {
    const httpParams = new HttpParams({ fromObject: data } as object);
    return this._http.delete<HttpResponseModel>(
      `${this.api}/admin/deleteSpecialisation`,
      { params: httpParams }
    );
  }

  editpayOut(data: object): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(
      `${this.api}/admin/editpayOut`,
      data
    );
  }

  kycdata(): Observable<kyc_verification[]> {
    return this._http.get<kyc_verification[]>(
      `${this.api}/admin/kycDataCollection`
    );
  }

  get_expert_kyc_details_from_id(data: HttpParamsInput): Observable<ExpertKyc> {
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get<ExpertKyc>(
      `${this.api}/admin/get_kyc_details_of_expert`,
      { params: httpParams }
    );
  }

  submit_kyc_details(
    data: IKycVerificationPayload
  ): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(
      `${this.api}/admin/submit_kyc_details`,
      data
    );
  }

  download_kyc_documents(data: HttpParamsInput): Observable<HttpResponseModel> {
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get<HttpResponseModel>(
      `${this.api}/admin/download_kyc_documents`,
      { params: httpParams }
    );
  }

  getAppointment(): Observable<AppointMent[]> {
    return this._http.get<AppointMent[]>(
      `${this.api}/admin/get_appointment_details`
    );
  }

  get_admin_dashboard_details(): Observable<AdminDashboardResponse> {
    return this._http.get<AdminDashboardResponse>(
      `${this.api}/admin/get_admin_dashboard_details`
    );
  }
}
