import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home/home.component';
import { UsersignupComponent } from './features/user/usersignup/usersignup.component';
import { UserloginComponent } from './features/user/userlogin/userlogin.component';
import { authGuard } from './core/guards/auth.guard';
import { userLoggedOutGuard } from './core/guards/user-auth.guard';
import { ExpertsignupComponent } from './features/expert/expertsignup/expertsignup.component';
import {
  expertLoggedInGuard,
  expertLoggedOutGuard,
} from './core/guards/expert-auth.guard';
import { VerifyemailComponent } from './shared/verifyemail/verifyemail.component';
import { VerifyotpComponent } from './shared/verifyotp/verifyotp.component';
import { UserHomeComponent } from './features/user/user-home/user-home.component';
import { ExpertHomeComponent } from './features/expert/expert-home/expert-home.component';

const userRoutes: Routes = [
  {
    path: 'userRegister',
    component: UsersignupComponent,
    canActivate: [userLoggedOutGuard],
  },
  {
    path: 'login',
    component: UserloginComponent,
    canActivate: [userLoggedOutGuard],
  },
  {
    path: 'verifyEmail',
    component: VerifyemailComponent,
    canActivate: [userLoggedOutGuard],
  },
  { path: 'verifyOtp', component: VerifyotpComponent },
  { path: 'registrationCompleted', redirectTo: 'login' },
  { path: 'userHome', component: UserHomeComponent },
];

const expertRoutes: Routes = [
  {
    path: 'expertRegister',
    component: ExpertsignupComponent,
    canActivate: [expertLoggedOutGuard],
  },
  {
    path: 'expertLogin',
    component: UserloginComponent,
    canActivate: [expertLoggedOutGuard],
  },
  { path: 'verifyEmail', component: VerifyemailComponent },
  { path: 'verifyOtp', component: VerifyotpComponent },
  { path: 'registrationCompleted', redirectTo: 'expertLogin' },
  {
    path: 'expertHome',
    component: ExpertHomeComponent,
  },
];

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'home', redirectTo: '' },
  { path: 'user', children: userRoutes },
  { path: 'expert', children: expertRoutes },
  
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
  },
];
