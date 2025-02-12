import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertVideoCallRoomComponent } from './expert-video-call-room.component';

describe('ExpertVideoCallRoomComponent', () => {
  let component: ExpertVideoCallRoomComponent;
  let fixture: ComponentFixture<ExpertVideoCallRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertVideoCallRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertVideoCallRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
