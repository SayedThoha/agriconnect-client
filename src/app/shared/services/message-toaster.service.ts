import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class MessageToasterService {
  constructor(private toastr: ToastrService) {}

  showSuccessToastr(message: string) {
    return this.toastr.success(message, '', {
      timeOut: 5000,
      progressAnimation: 'increasing',
      progressBar: true,
      positionClass: 'toast-top-center',
    });
  }

  showWarningToastr(message: string) {
    return this.toastr.warning(message, '', {
      timeOut: 5000,
      progressAnimation: 'increasing',
      progressBar: true,
      positionClass: 'toast-top-center',
    });
  }

  
  showErrorToastr(message: string) {
    return this.toastr.error(message, '', {
      timeOut: 5000,
      progressAnimation: 'increasing',
      progressBar: true,
      positionClass: 'toast-top-center',
    });
  }
}
