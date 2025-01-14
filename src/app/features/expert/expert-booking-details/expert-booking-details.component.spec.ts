import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertBookingDetailsComponent } from './expert-booking-details.component';

describe('ExpertBookingDetailsComponent', () => {
  let component: ExpertBookingDetailsComponent;
  let fixture: ComponentFixture<ExpertBookingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertBookingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
