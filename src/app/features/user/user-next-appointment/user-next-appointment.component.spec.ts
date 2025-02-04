import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNextAppointmentComponent } from './user-next-appointment.component';

describe('UserNextAppointmentComponent', () => {
  let component: UserNextAppointmentComponent;
  let fixture: ComponentFixture<UserNextAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNextAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNextAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
