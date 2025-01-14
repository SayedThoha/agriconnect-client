import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-user-sidebar',
  imports: [RouterModule,ButtonModule],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.css',
})
export class UserSidebarComponent {
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/home']);
    localStorage.removeItem('auth');
  }
}
