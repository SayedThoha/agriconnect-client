import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SocketServiceService } from '../../../shared/services/socket-service.service';
import { ExpertService } from '../../../shared/services/expert.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expert-notification',
  imports: [CommonModule, FormsModule],
  templateUrl: './expert-notification.component.html',
  styleUrl: './expert-notification.component.css',
})
export class ExpertNotificationComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  unreadCount: number = 0;
  private notificationSubscription!: Subscription;
  showNotifications: boolean = false;

  constructor(
    private socketService: SocketServiceService,
    private cdr: ChangeDetectorRef,
    private expertService: ExpertService
  ) {}

  ngOnInit(): void {
    // console.log('Initializing NotificationComponent...');

    const expertId = localStorage.getItem('expertId');
    if (expertId) {
      // console.log('Registering user for notifications:', expertId);
      this.socketService.register(expertId);
    } else {
      // console.warn('expert ID not found! Skipping registration.');
    }
    this.notificationSubscription = this.socketService
      .onNotification()
      .subscribe((message) => {
        // console.log('New notification received:', message);
        if (!message) {
          // console.error('Received an empty notification!');
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
          // console.log('Fetched all notifications:', notifications);
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

  formatNotificationTime(message: string): string {
    // Extract the date from the message (assuming consistent format)
    const dateMatch = message.match(/\w{3} \w{3} \d{1,2} \d{4} \d{2}:\d{2}:\d{2}/);
    
    if (dateMatch) {
      const date = new Date(dateMatch[0]); // Convert to Date object
      
      // Format to 12-hour format
      const formattedTime = date.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",

      });
  
      // Replace in message
      return message.replace(dateMatch[0], formattedTime);
    }
  
    
    return message;
  }
  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
}
