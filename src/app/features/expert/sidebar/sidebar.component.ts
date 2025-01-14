import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-sidebar',
  imports: [ButtonModule,RouterModule,CommonModule,],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(
    private router:Router
  ){}

  logout(){
    localStorage.removeItem('expertToken')
    this.router.navigate(['/home'])
    localStorage.removeItem('auth')
  }

}
