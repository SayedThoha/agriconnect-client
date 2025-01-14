import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private commonService: CommonService) {}
  private userLoggedIn$ = new BehaviorSubject<boolean>(false);
  // Observable for login state
  authState$ = this.userLoggedIn$.asObservable()

  setLoginState(isLoggedIn: boolean) {
    this.userLoggedIn$.next(isLoggedIn);
  }

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
