import { Component, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { CommonService } from '../../../shared/services/common.service';
import { adminlogin } from '../store/admin.action';

@Component({
  selector: 'app-admin-login',
  imports: [AdminHeaderComponent,ReactiveFormsModule,FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit {

  loginForm!: FormGroup;
  auth!:string;
  constructor( 
    private formbuilder: FormBuilder,
    private showMessage:MessageToasterService,
    private store:Store,
    private commonService:CommonService,
  ){}

  ngOnInit(){
    this.admin_login()
    console.log(this.commonService.getAuthFromLocalStorage())
  }

  admin_login(){
    this.loginForm = this.formbuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    });
  }

    
  //email error
  emailError():string{
    const email=this.loginForm.get('email')
    if(email?.errors?.['required']){
      return 'Email is required'
    }else if(email?.errors?.['email']){
      return 'Invalid Email'
    }
    return ''
  }

   //password Error
   passwordError():string{
    const password=this.loginForm.get('password')
    if(password?.errors?.['required']){
      return 'Password is required'
    }else if(password?.errors?.['pattern']){
      return 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (?@$!%*).'
    }
    return ''
  }

  //form submission
  onSubmit(){
    console.log('email:',this.loginForm.value.email)
    if(this.loginForm.invalid){
      if(this.emailError()){
        this.showMessage.showWarningToastr(this.emailError())
      }else if(this.passwordError()){
        this.showMessage.showWarningToastr(this.passwordError())
      }
    }else{
      const data={
        email:this.loginForm.value.email,
        password:this.loginForm.value.password
      }
      this.store.dispatch(adminlogin({data}))
    }
  }

}
