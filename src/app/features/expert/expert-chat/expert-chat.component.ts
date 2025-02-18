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
import { Subscription } from 'rxjs';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';
import { ChatServiceService } from '../../../shared/services/chat-service.service';
import { SocketServiceService } from '../../../shared/services/socket-service.service';
import { io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { CapitaliseFirstPipe } from '../../../shared/pipes/capitalise-first.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expert-chat',
  imports: [HeaderComponent, CommonModule, FormsModule, ReactiveFormsModule,CapitaliseFirstPipe],
  templateUrl: './expert-chat.component.html',
  styleUrl: './expert-chat.component.css',
})
export class ExpertChatComponent implements OnInit, OnDestroy {
  private onMessageSubscription: Subscription | undefined;
  showScrollUpButton = false;
  socket!: any;
  senderId: any;
  selectedExpert!: any;
  profile_picture!: any;
  selectedChatMessages: any[] = [];
  lastSeen: string = '';
  @ViewChild('chatContainer')
  chatContainer!: ElementRef;
  expertId!: any;
  chatId!: any;
  chats!: any;
  messages!: any;
  chatForm!: FormGroup;

  constructor(
    private chatService: ChatServiceService,
    private messageService: MessageToasterService,
    private formBuilder: FormBuilder,
    private socketService: SocketServiceService,
    private router:Router
  ) {
    this.socket = io(environment.apiUrl);
  }

  ngOnInit(): void {
    this.intialiseForms();
    this.expertId = localStorage.getItem('expertId');
    this.fetch_all_chats();
    if (this.chatId) {
      this.socket.emit('joinChat', this.chatId);
    }
    this.scrollToBottom();
    this.messageSubscription();
  }

  intialiseForms(): void {
    //chatform
    this.chatForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  //call if any message comes
  messageSubscription() {
    // console.log('function get called...');
    this.onMessageSubscription = this.socketService
      .onMessage()
      .subscribe((res: any) => {
        if (res.chat === this.chatId) {
          this.messages.unshift(res);
          this.chats.filter((chat: any) => {
            if (chat._id === this.chatId) {
              chat.latestMessage.content = res.content;
              chat.updatedAt = res.updatedAt;
            }
          });
        }
        this.senderId = res?.sender?._id;
      });
  }

  //fetching accessible chats
  fetch_all_chats() {
    this.chatService
      .expert_accessed_chats({ expertId: this.expertId })
      .subscribe({
        next: (Response) => {
          // console.log('fetched chats:', Response);
          this.chats = Response;
        },
      });
  }

  //call a particular user
  selectExpert(chat: any): void {
    this.socketService.register(this.expertId);
    this.chatId = chat._id;
    this.fetchAllMessages(chat._id);
    this.selectedExpert = `${chat.user.firstName} ${chat.user.lastName}`;
    this.profile_picture = chat.user.profile_picture;
    this.lastSeen = chat.updatedAt;
  }

  //fetch all messages of a particular chatID
  fetchAllMessages(chatId: any) {
    this.chatService.expertFetchAllMessages({ chatId: chatId }).subscribe({
      next: (Response) => {
        this.messages = Response;
      },
      error: (error) => {
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  //submission of chat form
  chatFormSubmit() {
    if (this.chatForm.valid) {
      const message = this.chatForm.value.message;
      if (message && message.trim().length === 0) {
        return;
      }
      let data = {
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
    } catch (err) {}
  }


  onScroll(event: { target: any }): void {
    const element = event.target;
    this.showScrollUpButton =
      element.scrollTop + element.clientHeight < element.scrollHeight - 20;
  }

  scrollToTop(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = 0;
    } catch (err) {}
  }

  
  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.onMessageSubscription?.unsubscribe();
  }
  
  goToHome(){
    this.router.navigate(['/expert/expertHome'])
  }
}
