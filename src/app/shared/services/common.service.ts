import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  getEmailFromLocalStrorage(): string {
    return localStorage.getItem('email') as string;
    // return this.getLocalStorageItem('email') as string;
  }

  //get the role from local storage for the verify otp action
  getRoleFromLocalStorage(): string {
    return localStorage.getItem('role') as string;
    // return this.getLocalStorageItem('role') as string;
  }

  //get userToken from the local storage
  getTokenFromLocalStorage(): string {
    return localStorage.getItem('userToken') as string;
    // return this.getLocalStorageItem('userToken') as string;
  }

  //get expert Token from the local storage
  getExpertTokenFromLocalStorage(): string {
    return localStorage.getItem('expertToken') as string;
    // return this.getLocalStorageItem('expertToken') as string;
  }

  //get expert Id from local storage
  getExpertIdFromLocalStorage(): string {
    return localStorage.getItem('expertId') as string;
    // return this.getLocalStorageItem('expertId') as string;
  }

  //get to know is user is there or not
  user_verify(): boolean {
    const userLoggedIn = this.getTokenFromLocalStorage();
    // const userLoggedIn = this.getTokenFromLocalStorage();
    return !!userLoggedIn;
  }

  //get auth from local storage to do the verifications
  getAuthFromLocalStorage(): string {
    return localStorage.getItem('auth') as string;
    // return this.getLocalStorageItem('auth') as string;
  }
}
