import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SocketServiceService } from '../../../shared/services/socket-service.service';
import { ExpertService } from '../../../shared/services/expert.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { INotification } from '../../../core/models/notificationModel';

@Component({
  selector: 'app-expert-notification',
  imports: [CommonModule, FormsModule],
  templateUrl: './expert-notification.component.html',
  styleUrl: './expert-notification.component.css',
})
export class ExpertNotificationComponent implements OnInit, OnDestroy {
  notifications: INotification[] = [];
  unreadCount = 0;
  private notificationSubscription!: Subscription;
  showNotifications = false;

  constructor(
    private socketService: SocketServiceService,
    private cdr: ChangeDetectorRef,
    private expertService: ExpertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const expertId = localStorage.getItem('expertId');
    if (expertId) {
      this.socketService.register(expertId);
    }
    this.notificationSubscription = this.socketService
      .onNotification()
      .subscribe((message) => {
        if (!message) {
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
    const expertId = localStorage.getItem('expertId');
    if (expertId) {
      this.expertService
        .getAllNotifications({ expertId: expertId })
        .subscribe((notifications) => {
          this.notifications = notifications;
          this.unreadCount = this.notifications.filter(
            (n) => !n.isReadByExpert
          ).length;
          this.cdr.detectChanges();
        });
    }
  }

  markAsRead(): void {
    const expertId = localStorage.getItem('expertId');
    if (expertId) {
      this.expertService
        .markNotificationsAsRead(expertId as string)
        .subscribe(() => {
          this.unreadCount = 0;
          this.notifications.forEach((n) => (n.isReadByExpert = true));
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

    const expertId = localStorage.getItem('expertId');
    if (expertId) {
      this.expertService
        .clearAllNotifications(expertId as string)
        .subscribe(() => {
          this.notifications = [];
          this.unreadCount = 0;
          this.cdr.detectChanges();
        });
    }
  }

  formatNotificationMessage(notification: INotification): string {
    let message = notification.message;

    message = message.replace(/\(Coordinated Universal Time\)/g, '');
    message = message.replace(/\(UTC\)/g, '');

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

      message = message.replace(originalDateString, formattedDate);
    }

    if (notification.userId?.firstName) {
      message = message.replace(
        'Your slot booking',
        `Your session with User: "${notification.userId.firstName} ${notification.userId.lastName}"`
      );
    }

    return message;
  }

  redirectToProfile() {
    this.router.navigate(['/expert/expert_profile/next_appointment']);

    this.showNotifications = false;
    this.markAsRead();
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
}
