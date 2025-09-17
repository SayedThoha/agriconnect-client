import {
  AfterViewInit,
  Component,
  ElementRef,
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
  roomID!: string | null;
  appointmentId!: string | null;
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
    const appID = 81955247;
    const serverSecret = '5c7063a4640154acc0779bcc6a1a2200';
    if (this.roomID) {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        this.roomID,
        Date.now().toString(),
        Date.now().toString()
      );

      const videoCallLink =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?roomID=' +
        this.roomID;

      const zp = ZegoUIKitPrebuilt.create(kitToken);

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
  }

  consultationStatus() {
    const status = this.consultation_status;
    if (this.appointmentId) {
      this.expertService
        .update_consultationStatus({
          appointmentId: this.appointmentId,
          status: status,
        })
        .subscribe({
          next: () => {
            this._messageService.showSuccessToastr(
              'consultation status updated'
            );
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
}
