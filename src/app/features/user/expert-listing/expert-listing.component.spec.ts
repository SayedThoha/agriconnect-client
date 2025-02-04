import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertListingComponent } from './expert-listing.component';

describe('ExpertListingComponent', () => {
  let component: ExpertListingComponent;
  let fixture: ComponentFixture<ExpertListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
