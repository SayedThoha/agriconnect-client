import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import {
  adminLoggedInGuard,
  adminLoggedOutGuard,
} from './guards/admin-auth.guard';
import { ExpertListComponent } from './expert-list/expert-list.component';
import { KycVerificationComponent } from './kyc-verification/kyc-verification.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { KycComponent } from './kyc/kyc.component';
import { SpecialisationComponent } from './specialisation/specialisation.component';
import { StoreModule } from '@ngrx/store';
import { adminReducer } from './store/admin.reducer';
import { EffectsModule } from '@ngrx/effects';
import { adminEffects } from './store/admin.effects';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: AdminLoginComponent,
    canActivate: [adminLoggedInGuard],
  },
  {
    path: 'adminHome',
    component: AdminHomeComponent,
    canActivate: [adminLoggedOutGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'expert_listing', component: ExpertListComponent },
      { path: 'kyc_verification', component: KycComponent },
      { path: 'pdf_viewer', component: PdfViewerComponent },
      { path: 'user_listing', component: UserListComponent },
      { path: 'userProfile/:id', component: UserProfileComponent },
      { path: 'checkDocumentsKyc', component: KycVerificationComponent },
      { path: 'specialisation', component: SpecialisationComponent },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
   
  ],
})
export class AdminModule {}
