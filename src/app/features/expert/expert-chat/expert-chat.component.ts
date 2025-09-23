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
import { debounceTime, Subscription } from 'rxjs';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { ChatServiceService } from '../../../shared/services/chat-service.service';
import { SocketServiceService } from '../../../shared/services/socket-service.service';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { CapitaliseFirstPipe } from '../../../shared/pipes/capitalise-first.pipe';
import { Router } from '@angular/router';
import { IChat, IMessage } from '../../../core/models/chatModel';

@Component({
  selector: 'app-expert-chat',
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CapitaliseFirstPipe,
  ],
  templateUrl: './expert-chat.component.html',
  styleUrl: './expert-chat.component.css',
})
export class ExpertChatComponent implements OnInit, OnDestroy {
  private onMessageSubscription: Subscription | undefined;
  showScrollUpButton = false;
  socket!: Socket;
  senderId!: string;
  selectedExpert!: string;
  profile_picture!: string;
  selectedChatMessages!: IMessage[];
  lastSeen = '';
  @ViewChild('chatContainer')
  chatContainer!: ElementRef;
  expertId!: string | null;
  chatId!: string;
  chats!: IChat[];
  messages!: IMessage[];
  chatForm!: FormGroup;
  searchForm!: FormGroup;
  filteredChats!: IChat[];
  constructor(
    private chatService: ChatServiceService,
    private messageService: MessageToasterService,
    private formBuilder: FormBuilder,
    private socketService: SocketServiceService,
    private router: Router
  ) {
    this.socket = io(environment.apiUrl);
  }

  ngOnInit(): void {
    this.expertId = localStorage.getItem('expertId');
    this.intialiseForms();
    this.fetch_all_chats();
    this.setupSearchSubscription();
    this.messageSubscription();
  }

  intialiseForms(): void {
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
    this.onMessageSubscription = this.socketService
      .onMessage()
      .subscribe((res) => {
        if (res.chat === this.chatId) {
          this.messages.unshift(res);
          this.scrollToBottom();
          this.chats.filter((chat) => {
            if (chat._id === this.chatId) {
              if (chat.latestMessage) {
                chat.latestMessage.content = res.content;
                chat.updatedAt = res.updatedAt!;
              }
            }
          });
        }
        this.senderId = res?.sender?._id;
      });
  }

  fetch_all_chats() {
    if (this.expertId) {
      this.chatService
        .expert_accessed_chats({ expertId: this.expertId })
        .subscribe({
          next: (Response) => {
            this.chats = Response;
            this.filteredChats = this.chats;
          },
        });
    }
  }

  setupSearchSubscription() {
    this.searchForm
      .get('searchData')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        this.filterChats(value);
      });
  }

  filterChats(searchTerm: string | null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.filteredChats = this.chats.filter(
        (chats) =>
          regex.test(chats.user.firstName) || regex.test(chats.user.lastName)
      );
    } else {
      this.filteredChats = this.chats;
    }
  }

  selectExpert(chat: IChat): void {
    if (this.expertId) {
      this.socketService.register(this.expertId);
    }
    this.chatId = chat._id;
    this.joinChat();
    this.fetchAllMessages(chat._id);
    this.selectedExpert = `${chat.user.firstName} ${chat.user.lastName}`;
    this.profile_picture = chat.user.profile_picture!;
    this.lastSeen = chat.updatedAt.toString();
  }

  fetchAllMessages(chatId: string) {
    this.chatService.expertFetchAllMessages({ chatId: chatId }).subscribe({
      next: (Response) => {
        this.messages = Response;
      },
      error: (error) => {
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  chatFormSubmit() {
    if (this.chatForm.valid) {
      const message = this.chatForm.value.message;
      if (message && message.trim().length === 0) {
        return;
      }
      const data = {
        content: message,
        chatId: this.chatId,
        expertId: this.expertId,
      };
      this.chatService.expertSendMessage(data).subscribe((data) => {
        this.socketService.messageSendfromExpert(data);
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
      this.socket.disconnect();
    }
    this.onMessageSubscription?.unsubscribe();
  }

  goToHome() {
    this.router.navigate(['/expert/expertHome']);
  }
}
