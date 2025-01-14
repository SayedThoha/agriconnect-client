import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Adminlogin } from '../store/admin.state';
import { HttpClient, HttpParams } from '@angular/common/http';
import { adminLoginResponse, HttpResponseModel } from '../models/commonModel';
import {
  expertData,
  kyc_verification,
  specialisation,
} from '../models/expertModel';
import { userdata } from '../models/userModel';

@Injectable({
  providedIn: 'root',
})
export class AdminServiceService {
  private api: String = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  //admin login
  adminLogin(data: Adminlogin): Observable<adminLoginResponse> {
    return this._http.post<adminLoginResponse>(`${this.api}/admin/login`, data);
  }

  //get all the expert details
  getExperts(params: { [key: string]: string }): Observable<expertData[]> {
    let httpParams = new HttpParams();
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this._http.get<expertData[]>(`${this.api}/admin/expertdata`, {
      params: httpParams,
    });
  }

  //change the status of a expert
  expertBlock(data: Object): Observable<HttpResponseModel> {
    console.log('expert block service:', data);
    return this._http.post<HttpResponseModel>(
      `${this.api}/admin/expertBlock`,
      data
    );
  }

  //get all the users
  getUsers(): Observable<userdata[]> {
    return this._http.get<userdata[]>(`${this.api}/admin/userdata`);
  }

  //change status of user
  userBlock(data: Object): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(
      `${this.api}/admin/userBlock`,
      data
    );
  }

  //get a single user
  userDetails(data: Object): Observable<userdata> {
    console.log('userDetails service:', data);
    return this._http.post<userdata>(`${this.api}/admin/userDetails`, data);
  }

  //userlist-search
  searchUser(data: Object): Observable<userdata[]> {
    console.log('search user service:', data);
    return this._http.post<userdata[]>(`${this.api}/admin/searchUser`, data);
  }

  //get specialisation
  getSpecialisation(): Observable<specialisation[]> {
    console.log('get specialisation Service');
    return this._http.get<specialisation[]>(
      `${this.api}/admin/getSpecialisation`
    );
  }

  //add specialization
  addSpecialisation(data: Object): Observable<HttpResponseModel> {
    console.log('add specialisation Service:', data);
    return this._http.post<HttpResponseModel>(
      `${this.api}/admin/addSpecialisation`,
      data
    );
  }

  //edit specialization
  editSpecialisation(data: specialisation): Observable<HttpResponseModel> {
    console.log('edit specialisation Service');
    return this._http.post<HttpResponseModel>(
      `${this.api}/admin/editSpecialisation`,
      data
    );
  }

  //delete specialization
  deleteSpecialisation(data: any): Observable<HttpResponseModel> {
    console.log('delete specialisation Service');
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.delete<HttpResponseModel>(
      `${this.api}/admin/deleteSpecialisation`,
      { params: httpParams }
    );
  }

  //edit payOut
  editpayOut(data: Object): Observable<HttpResponseModel> {
    console.log('delete specialisation Service');
    return this._http.post<HttpResponseModel>(
      `${this.api}/admin/editpayOut`,
      data
    );
  }

  //kyc data fetching
  kycdata(): Observable<kyc_verification[]> {
    console.log('kyc details');
    return this._http.get<kyc_verification[]>(
      `${this.api}/admin/kycDataCollection`
    );
  }

  //get a expert details
  get_expert_kyc_details_from_id(data: any): Observable<expertData> {
    console.log('expert detail Service');
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get<expertData>(
      `${this.api}/admin/get_kyc_details_of_expert`,
      { params: httpParams }
    );
  }

  submit_kyc_details(data: any): Observable<HttpResponseModel> {
    console.log('expert detail Service');
    return this._http.post<HttpResponseModel>(
      `${this.api}/admin/submit_kyc_details`,
      data
    );
  }

  download_kyc_documents(data: any): Observable<HttpResponseModel> {
    console.log('download_kyc_documents Service');
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get<HttpResponseModel>(
      `${this.api}/admin/download_kyc_documents`,
      { params: httpParams }
    );
  }

  //getAppointment
  getAppointment(): Observable<any> {
    return this._http.get<any>(`${this.api}/admin/get_appointment_details`);
  }

  get_admin_dashboard_details(data: any): Observable<any> {
    console.log('service call of get_booking_details_of_expert');
    const httpParams = new HttpParams({ fromObject: data });
    return this._http.get<any>(
      `${this.api}/admin/get_admin_dashboard_details`,
      { params: httpParams }
    );
  }
}
