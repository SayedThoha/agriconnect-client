import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SocketServiceService } from '../../../shared/services/socket-service.service';
import { UserService } from '../../../shared/services/user.service';


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
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // console.log('Initializing NotificationComponent...');

    const userId = localStorage.getItem('userId');
    if (userId) {
      // console.log('Registering user for notifications:', userId);
      this.socketService.register(userId);
    } else {
      // console.warn('User ID not found! Skipping registration.');
    }
    this.notificationSubscription = this.socketService
      .onNotification()
      .subscribe((message) => {
        // console.log('New notification received:', message);
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
        this.notifications = []; // Clear notifications from UI
        this.unreadCount = 0; // Reset unread count
        this.cdr.detectChanges(); // Trigger change detection
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
