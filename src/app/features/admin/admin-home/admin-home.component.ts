import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin-home',
  imports: [RouterOutlet,AdminHeaderComponent,SidebarComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit {
constructor(private router:Router) {
  
}
  ngOnInit(): void {
    this.router.navigate(['adminHome/dashboard']);
  }
}
