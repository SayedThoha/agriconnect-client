import { Component } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { AutoUnsubscribe } from '../../../core/decorators/auto-usub.decorator';

@AutoUnsubscribe
@Component({
  selector: 'app-wallet',
  imports: [],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',
})
export class WalletComponent {
  constructor(private userService: UserService) {}

  wallet!: any;

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getuserDetails({ _id: userId }).subscribe({
        next: (Response) => {
          this.wallet = Response.wallet;
        },
      });
    }
    
  }
}
