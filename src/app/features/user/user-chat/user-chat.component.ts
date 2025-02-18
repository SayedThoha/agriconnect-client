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
import { io } from 'socket.io-client';
import { Subscription } from 'rxjs';
import { expertData } from '../../admin/models/expertModel';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';

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
  socket!: any;

  showScrollUpButton = false;
  expertId!: any;
  userId!: any;
  chats!: any;
  messages!: any;
  chatId!: any;

  //specific chats
  selectedExpert!: any;
  profile_picture!: any;
  selectedChatMessages: any[] = [];
  lastSeen: string = '';

  experts: expertData[] = [];
  displayed_expert: expertData[] = [];

  chatForm!: FormGroup;
  @ViewChild('chatContainer')
  chatContainer!: ElementRef;

  userChatSubscription!:Subscription
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageToasterService,
    private chatService: ChatServiceService,
    private socketService: SocketServiceService,
    private userService: UserService,
    private router:Router
  ) {
    this.socket = io(environment.apiUrl);
  }

  ngOnInit() {
    // this.expertId =

    this.getExpertDetails();
   
    this.userId = localStorage.getItem('userId');
    // this.accessedchat(this.expertId);
    this.userFetchAllChat();
    if (this.chatId) {
      this.socket.emit('joinChat', this.chatId);
    }
    this.scrollToBottom();

    this.messageSubscription();
    this.initialiseForms();
  }

  initialiseForms(): void {
    this.chatForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  messageSubscription() {
    this.socketServiceSubscription = this.socketService
      .onMessage()
      .subscribe((res: any) => {
        if (res.chat === this.chatId) {
          // console.log('newMEssage recieved in userside by socketIO:', res);
          this.messages.unshift(res);
          this.chats.filter((chat: any) => {
            if (chat._id === this.chatId) {
              chat.latestMessage.content = res.content;
              chat.updatedAt = res.updatedAt;
            }
          });
        }
      });
  }

  getExpertDetails() {
    this.userChatSubscription= this.userService.getExperts().subscribe({
      next: (Response) => {
        // console.log(Response);
        this.experts = Response;

        this.displayed_expert = this.experts;
        this.displayed_expert.forEach((data) => {
          // console.log(data);
          // console.log('profile pic', data.profile_picture);
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  accessedchat(expertId: any) {
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
        console.log('error:', error);
        this.messageService.showErrorToastr(error.error.message);
      },
    });
  }

  selectExpert(chat: any): void {
    this.socketService.register(this.userId);
    this.chatId = chat._id;
    this.fetchAllMessages(chat._id);
    this.selectedExpert = `${chat.expert.firstName} ${chat.expert.lastName}`;
    this.profile_picture = chat.expert.profile_picture;
    this.selectedChatMessages = this.messages; // Assuming `messages` is an array of messages for the selected chat
    this.lastSeen = chat.updatedAt;
  }

  fetchAllMessages(chatId: any) {
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
      // console.log(message);
      let data = {
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
      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    if (this.socketServiceSubscription) {
      this.socketServiceSubscription.unsubscribe();
    }
  }

  
  goToHome(){
    this.router.navigate(['/user/userHome'])
  }

}
