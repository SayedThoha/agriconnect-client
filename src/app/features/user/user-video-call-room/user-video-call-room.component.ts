import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { HeaderComponent } from '../../../shared/header/header.component';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';
@Component({
  selector: 'app-user-video-call-room',
  imports: [HeaderComponent, UserSidebarComponent],
  templateUrl: './user-video-call-room.component.html',
  styleUrl: './user-video-call-room.component.css',
})
export class UserVideoCallRoomComponent implements OnInit, AfterViewInit {
  roomID!: any;
  constructor(private route: ActivatedRoute) {}

  @ViewChild('root')
  root!: ElementRef;
  ngOnInit(): void {
    this.roomID = this.route.snapshot.paramMap.get('id');
  }

  ngAfterViewInit(): void {
    const appID = 81955247;
    const serverSecret = '5c7063a4640154acc0779bcc6a1a2200';
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
