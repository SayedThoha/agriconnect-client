import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home/home.component';
import { UsersignupComponent } from './features/user/usersignup/usersignup.component';
import { UserloginComponent } from './features/user/userlogin/userlogin.component';
import { authGuard } from './core/guards/auth.guard';
import {
  userLoggedInGuard,
  userLoggedOutGuard,
} from './core/guards/user-auth.guard';
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
import { NewPasswordComponent } from './shared/new-password/new-password.component';
import { UserNextAppointmentComponent } from './features/user/user-next-appointment/user-next-appointment.component';
import { BookingDetailsComponent } from './features/user/booking-details/booking-details.component';
import { PaymentDetailsComponent } from './features/user/payment-details/payment-details.component';
import { SuccessPaymentComponent } from './features/user/success-payment/success-payment.component';
import { ExpertListingComponent } from './features/user/expert-listing/expert-listing.component';
import { UserExpertProfileComponent } from './features/user/user-expert-profile/user-expert-profile.component';
import { AppointmentBookingComponent } from './features/user/appointment-booking/appointment-booking.component';
import { WalletComponent } from './features/user/wallet/wallet.component';
import { AddPrescriptionComponent } from './features/expert/add-prescription/add-prescription.component';
import { BookingsComponent } from './features/expert/bookings/bookings.component';
import { UserPrescriptionHistoryComponent } from './features/user/user-prescription-history/user-prescription-history.component';
import { UserChatComponent } from './features/user/user-chat/user-chat.component';
import { UserVideoCallRoomComponent } from './features/user/user-video-call-room/user-video-call-room.component';
import { ExpertVideoCallRoomComponent } from './features/expert/expert-video-call-room/expert-video-call-room.component';
import { ExpertChatComponent } from './features/expert/expert-chat/expert-chat.component';

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
  {
    path: 'new_password',
    component: NewPasswordComponent,
    canActivate: [userLoggedOutGuard],
  },
  {
    path: 'userHome',
    component: UserHomeComponent,
    canActivate: [userLoggedInGuard],
  },
  {
    path: 'user_profile',
    component: UserProfileComponent,
    canActivate: [userLoggedInGuard],
    children: [
      { path: '', redirectTo: 'user_profile_data', pathMatch: 'full' },
      { path: 'user_profile_data', component: UserProfileDataComponent },
      {
        path: 'user_next_appointment',
        component: UserNextAppointmentComponent,
      },
      { path: 'user_booking_details', component: BookingDetailsComponent },
      { path: 'user_payment_details', component: PaymentDetailsComponent },
      {
        path: 'prescription_history',
        component: UserPrescriptionHistoryComponent,
      },
      { path: 'user_wallet', component: WalletComponent },
    ],
  },
  {
    path: 'success_payment/:id',
    component: SuccessPaymentComponent,
    canActivate: [userLoggedInGuard],
  },
  { path: 'expert_listing', component: ExpertListingComponent },
  {
    path: 'expert_profile/:id',
    component: UserExpertProfileComponent,
    canActivate: [userLoggedInGuard],
  },
  {
    path: 'appoinment_booking',
    component: AppointmentBookingComponent,
    canActivate: [userLoggedInGuard],
  },
  {
    path: 'userchat',
    component: UserChatComponent,
    canActivate: [userLoggedInGuard],
  },
  {
    path: 'user_video_call_room/:id/:appointmentId',
    component: UserVideoCallRoomComponent,
    canActivate: [userLoggedInGuard],
  },

  { path: '**', redirectTo: 'userHome' },
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
    path: 'new_password',
    component: NewPasswordComponent,
    canActivate: [expertLoggedOutGuard],
  },
  {
    path: 'expertHome',
    component: ExpertHomeComponent,
  },
  {
    path: 'expert_profile',
    component: ExpertProfileComponent,
    canActivate: [expertLoggedInGuard],
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
  {
    path: 'expert_chat',
    component: ExpertChatComponent,
    canActivate: [expertLoggedInGuard],
  },
  {
    path: 'expert_video_call_room/:id/:appointmentId',
    component: ExpertVideoCallRoomComponent,
    canActivate: [expertLoggedInGuard],
  },
  {
    path: 'add_prescription/:appointmentId',
    component: AddPrescriptionComponent,
    canActivate: [expertLoggedInGuard],
  },
  {
    path: 'bookings',
    component: BookingsComponent,
    canActivate: [expertLoggedInGuard],
  },
  { path: '**', redirectTo: 'expertHome' },
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
