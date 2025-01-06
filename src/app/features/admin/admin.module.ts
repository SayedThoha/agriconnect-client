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
      
      {path: '**', redirectTo:'dashboard',pathMatch:'full' }
    ],
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
