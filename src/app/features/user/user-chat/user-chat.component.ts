import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CapitaliseFirstPipe } from '../../../shared/pipes/capitalise-first.pipe';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { ChatServiceService } from '../../../shared/services/chat-service.service';
import { SocketServiceService } from '../../../shared/services/socket-service.service';
import { environment } from '../../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { debounceTime, Subscription } from 'rxjs';
import { expertData } from '../../admin/models/expertModel';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
import { IChat, IMessage } from '../../../core/models/chatModel';

@Component({
  selector: 'app-user-chat',
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    CapitaliseFirstPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './user-chat.component.html',
  styleUrl: './user-chat.component.css',
})
export class UserChatComponent implements OnInit, OnDestroy {
  private socketServiceSubscription: Subscription | undefined;
  socket!: Socket;
  showScrollUpButton = false;
  expertId!: string;
  userId!: string;
  chats!: IChat[];
  messages!: IMessage[];
  chatId!: string;
  selectedExpert!: string;
  profile_picture!: string;
  selectedChatMessages!: IMessage[];
  lastSeen = '';
  experts: expertData[] = [];
  displayed_expert: expertData[] = [];

  chatForm!: FormGroup;
  @ViewChild('chatContainer')
  chatContainer!: ElementRef;

  userChatSubscription!: Subscription;
  searchForm!: FormGroup;
  filteredChats!: IChat[];
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageToasterService,
    private chatService: ChatServiceService,
    private socketService: SocketServiceService,
    private userService: UserService,
    private router: Router
  ) {
    this.socket = io(environment.apiUrl);
  }

  ngOnInit() {
    this.getExpertDetails();
    this.initialiseForms();
    this.userId = localStorage.getItem('userId')!;
    this.userFetchAllChat();
    this.setupSearchSubscription();
    this.joinChat();
    this.scrollToBottom();
    this.messageSubscription();
  }

  initialiseForms(): void {
    this.searchForm = this.formBuilder.group({
      searchData: ['', Validators.required],
    });

    this.chatForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  joinChat() {
    if (this.chatId) {
      this.socket.emit('joinChat', this.chatId);
    }
  }

  messageSubscription() {
    this.socketServiceSubscription = this.socketService
      .onMessage()
      .subscribe((res) => {
        if (res.chat === this.chatId) {
          this.messages.unshift(res);
          this.chats.filter((chat) => {
            if (chat._id === this.chatId) {
              chat.latestMessage!.content = res.content;
              chat.updatedAt = res.updatedAt!;
            }
          });
        }
      });
  }

  getExpertDetails() {
    this.userChatSubscription = this.userService.getExperts().subscribe({
      next: (Response) => {
        this.experts = Response;
        this.displayed_expert = this.experts;
      },
      error: (error) => {
        console.error(error);
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  accessedchat(expertId: string) {
    this.expertId = expertId;
    this.chatService
      .accessChat({ userId: this.userId, expertId: this.expertId })
      .subscribe({
        next: (Response) => {
          this.selectExpert(Response);
        },
        error: (error) => {
          this.messageService.showErrorToastr(error.error.message);
        },
      });
  }

  userFetchAllChat() {
    this.chatService.userFetchAllChat({ userId: this.userId }).subscribe({
      next: (Response) => {
        this.chats = Response;
      },
      error: (error) => {
        console.error('error:', error);
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  setupSearchSubscription() {
    this.searchForm
      .get('searchData')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        this.filterExperts(value);
      });
  }

  filterExperts(searchTerm: string | null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.displayed_expert = this.experts.filter(
        (experts) =>
          regex.test(experts.firstName) || regex.test(experts.lastName)
      );
    } else {
      this.displayed_expert = this.experts;
    }
  }

  selectExpert(chat: IChat): void {
    this.socketService.register(this.userId);
    this.chatId = chat._id;
    this.fetchAllMessages(chat._id);
    this.selectedExpert = `${chat.expert.firstName} ${chat.expert.lastName}`;
    this.profile_picture = chat.expert.profile_picture;
    this.selectedChatMessages = this.messages;
    this.lastSeen = chat.updatedAt.toString();
  }

  fetchAllMessages(chatId: string) {
    this.chatService.userFetchAllMessages({ chatId: chatId }).subscribe({
      next: (Response) => {
        this.messages = Response;
      },
      error: (error) => {
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  async chatFormSubmit() {
    if (this.chatForm.valid) {
      const message = this.chatForm.value.message;
      if (message && message.trim().length === 0) {
        return;
      }
      const data = {
        content: message,
        chatId: this.chatId,
        userId: this.userId,
      };
      this.chatService.sendMessage(data).subscribe((data) => {
        this.socketService.messageSendfromUser(data);
      });
      this.chatForm.reset();
    }
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    this.showScrollUpButton =
      element.scrollTop + element.clientHeight < element.scrollHeight - 20;
  }

  scrollToTop(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = 0;
    } catch (err) {
      console.error(err);
    }
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.on('disconnect', () => {
        console.warn('Socket disconnected');
      });
    }
    if (this.socketServiceSubscription) {
      this.socketServiceSubscription.unsubscribe();
    }
  }

  goToHome() {
    this.router.navigate(['/user/userHome']);
  }
}
