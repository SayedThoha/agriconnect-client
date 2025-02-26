import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SocketServiceService } from '../../../shared/services/socket-service.service';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  imports: [CommonModule, FormsModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  unreadCount: number = 0;
  private notificationSubscription!: Subscription;
  showNotifications: boolean = false;

  constructor(
    private socketService: SocketServiceService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.socketService.register(userId);
    } else {
    }
    this.notificationSubscription = this.socketService
      .onNotification()
      .subscribe((message) => {
        if (!message) {
          console.error('Received an empty notification!');
          return;
        }
        this.notifications.unshift(message);
        this.unreadCount++;
        this.cdr.detectChanges();
      });
    this.fetchAllNotifications();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  fetchAllNotifications(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService
        .getAllNotifications({ userId: userId })
        .subscribe((notifications) => {
          // console.log('Fetched all notifications:', notifications);
          this.notifications = notifications;
          this.unreadCount = this.notifications.filter(
            (n) => !n.isReadByUser
          ).length;
          this.cdr.detectChanges();
        });
    }
  }

  markAsRead(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService
        .markNotificationsAsRead(userId as string)
        .subscribe(() => {
          this.unreadCount = 0;
          this.notifications.forEach((n) => (n.isReadByUser = true));
          this.cdr.detectChanges();
        });
    }
  }

  clearNotifications(): void {
    if (this.notifications.length === 0) return;

    const confirmClear = confirm(
      'Are you sure you want to clear all notifications?'
    );
    if (!confirmClear) return;

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.clearAllNotifications(userId as string).subscribe(() => {
        this.notifications = [];
        this.unreadCount = 0;
        this.cdr.detectChanges();
      });
    }
  }

  formatNotificationMessage(notification: any): string {
    let message = notification.message;

    // Extract date from message
    const dateMatch = message.match(
      /\w{3} \w{3} \d{1,2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4}/
    );

    if (dateMatch) {
      const originalDateString = dateMatch[0];
      const date = new Date(originalDateString);

      const formattedDate = date.toLocaleString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      });

      console.log(formattedDate);

      // Replace the original date in the message with the formatted date
      message = message.replace(originalDateString, formattedDate);
    }

    // Add Expert Name if Available
    if (notification.expertId?.firstName) {
      message = message.replace(
        'Your slot booking',
        `Your session with Expert: ${notification.expertId.firstName} ${notification.expertId.lastName} is confirmed`
      );
    }

    return message;
  }

  redirectToProfile() {
    this.router.navigate(['/user/user_profile/user_next_appointment']);
    this.showNotifications = false;
    this.markAsRead();
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
}
