import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home/home.component';
import { UsersignupComponent } from './features/user/usersignup/usersignup.component';
import { UserloginComponent } from './features/user/userlogin/userlogin.component';
import { authGuard } from './core/guards/auth.guard';
import { userLoggedInGuard, userLoggedOutGuard } from './core/guards/user-auth.guard';
import { ExpertsignupComponent } from './features/expert/expertsignup/expertsignup.component';
import {
  expertLoggedInGuard,
  expertLoggedOutGuard,
} from './core/guards/expert-auth.guard';
import { VerifyemailComponent } from './shared/verifyemail/verifyemail.component';
import { VerifyotpComponent } from './shared/verifyotp/verifyotp.component';
import { UserHomeComponent } from './features/user/user-home/user-home.component';
import { ExpertHomeComponent } from './features/expert/expert-home/expert-home.component';
import { ExpertProfileComponent } from './features/expert/expert-profile/expert-profile.component';
import { ExpertProfileDataComponent } from './features/expert/expert-profile-data/expert-profile-data.component';
import { ExpertDashboardComponent } from './features/expert/expert-dashboard/expert-dashboard.component';
import { SlotAddingComponent } from './features/expert/slot-adding/slot-adding.component';
import { NextAppointmentComponent } from './features/expert/next-appointment/next-appointment.component';
import { ExpertPaymentDetailsComponent } from './features/expert/expert-payment-details/expert-payment-details.component';
import { ExpertBookingDetailsComponent } from './features/expert/expert-booking-details/expert-booking-details.component';
import { PrescriptionHistoryComponent } from './features/expert/prescription-history/prescription-history.component';

import { UserProfileDataComponent } from './features/user/user-profile-data/user-profile-data.component';
import { UserProfileComponent } from './features/user/user-profile/user-profile.component';

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
  { path: 'userHome', component: UserHomeComponent ,canActivate:[userLoggedInGuard] },
  {
    path: 'user_profile',
    component: UserProfileComponent,
    canActivate:[userLoggedInGuard],
    children: [
      { path: '', redirectTo: 'user_profile_data', pathMatch: 'full' },
      { path: 'user_profile_data', component: UserProfileDataComponent },
    ],
  },
  { path: '**', redirectTo: 'userHome' }
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
  {
    path: 'expert_profile',
    component: ExpertProfileComponent,
    children: [
      { path: 'expertDashboard', component: ExpertDashboardComponent },
      { path: 'expert_profile_data', component: ExpertProfileDataComponent },
      { path: 'slot_details', component: SlotAddingComponent },
      { path: 'next_appointment', component: NextAppointmentComponent },
      { path: 'payment_details', component: ExpertPaymentDetailsComponent },
      { path: 'booking_history', component: ExpertBookingDetailsComponent },
      { path: 'prescription_history', component: PrescriptionHistoryComponent },
    ],
  },
  { path: '**', redirectTo: 'expertHome' }
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
