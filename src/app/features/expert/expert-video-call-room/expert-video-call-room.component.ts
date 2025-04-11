import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ExpertService } from '../../../shared/services/expert.service';
import { MessageToasterService } from '../../../shared/services/message-toaster.service';

import { ActivatedRoute, Router } from '@angular/router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  selector: 'app-expert-video-call-room',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarComponent,
    HeaderComponent,
  ],
  templateUrl: './expert-video-call-room.component.html',
  styleUrl: './expert-video-call-room.component.css',
})
export class ExpertVideoCallRoomComponent implements OnInit, AfterViewInit {
  roomID!: any;
  appointmentId!: any;
  consultation_status = 'consulted';

  constructor(
    private route: ActivatedRoute,
    private expertService: ExpertService,
    private _messageService: MessageToasterService,
    private router: Router
  ) {}

  @ViewChild('root')
  root!: ElementRef;

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
    this.roomID = this.route.snapshot.paramMap.get('id');
  }

  ngAfterViewInit(): void {
    // generate Kit Token
    const appID = 1306784341;
    const serverSecret = 'd5103205597e4a1d479bfdefed94dd19';
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      this.roomID,
      Date.now().toString(),
      Date.now().toString()
    );

    //generate link
    const videoCallLink =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname +
      '?roomID=' +
      this.roomID;

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // Start a call.
    zp.joinRoom({
      container: this.root.nativeElement,
      sharedLinks: [
        {
          name: 'Personal link',
          url: videoCallLink,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
    });
  }

  consultationStatus() {
    const status = this.consultation_status;
    this.expertService
      .update_consultationStatus({
        appointmentId: this.appointmentId,
        status: status,
      })
      .subscribe({
        next: (Response) => {
          this._messageService.showSuccessToastr('consultation status updated');
          if (status === 'consulted') {
            this.router.navigate([
              '/expert/add_prescription',
              this.appointmentId,
            ]);
          } else {
            this.router.navigate(['/expert/expert_profile/next_appointment']);
          }
        },
        error: (error) => {
          this._messageService.showErrorToastr(error.error.message);
        },
      });
  }
}
