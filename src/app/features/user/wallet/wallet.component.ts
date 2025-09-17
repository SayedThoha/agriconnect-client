import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@AutoUnsubscribe
@Component({
  selector: 'app-wallet',
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',
})
export class WalletComponent implements OnInit {
  constructor(private userService: UserService) {}

  wallet!: number;

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getuserDetails({ _id: userId }).subscribe({
        next: (Response) => {
          this.wallet = Response.wallet!;
        },
      });
    }
  }
}
