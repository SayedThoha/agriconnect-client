import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertPaymentDetailsComponent } from './expert-payment-details.component';

describe('ExpertPaymentDetailsComponent', () => {
  let component: ExpertPaymentDetailsComponent;
  let fixture: ComponentFixture<ExpertPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertPaymentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
