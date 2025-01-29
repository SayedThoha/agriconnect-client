import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { logoutadmin } from '../store/admin.action';

@Component({
  selector: 'app-sidebar',
  imports: [ButtonModule, RouterLink, FormsModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private _router: Router,
    private store:Store
  ) {}

  logout() {
    this.store.dispatch(logoutadmin());
    localStorage.removeItem('adminToken');
    this._router.navigate(['admin/login']);
  }
}
