import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private commonService: CommonService) {}

  checkUserLoggedIn(): boolean {
    const userLoggedIn = this.commonService.getTokenFromLocalStorage();
    return !!userLoggedIn;
  }

  checkExpertLoggedIn(): boolean {
    // const expertLoggedIn = this.commonService.getExpertIdFromLocalStorage();
    const expertLoggedIn = this.commonService.getExpertTokenFromLocalStorage();
    return !!expertLoggedIn;
  }
}
