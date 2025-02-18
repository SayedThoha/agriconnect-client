import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-home',
  imports: [RouterOutlet,AdminHeaderComponent,SidebarComponent,RouterModule,CommonModule,FormsModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit {
constructor(private router:Router) {
  
}
  ngOnInit(): void {
    if (this.router.url === '/adminHome') {
    this.router.navigate(['/adminHome/dashboard']);
    }
  }
}
