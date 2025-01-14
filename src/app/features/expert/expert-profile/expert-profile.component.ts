import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expert-profile',
  imports: [HeaderComponent,SidebarComponent,CommonModule,RouterModule],
  templateUrl: './expert-profile.component.html',
  styleUrl: './expert-profile.component.css'
})
export class ExpertProfileComponent implements OnInit {

  constructor(private router:Router){}

  ngOnInit(): void {
      this.router.navigate(['/expert/expert_profile/expertDashboard'])
  }
  
}
