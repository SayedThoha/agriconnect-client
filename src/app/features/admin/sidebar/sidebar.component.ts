import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  imports: [ButtonModule, RouterLink, FormsModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private _router: Router) {}

  logout() {
    localStorage.removeItem('adminToken');
    this._router.navigate(['admin/login']);
  }
}
