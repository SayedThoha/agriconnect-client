import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertProfileDataComponent } from './expert-profile-data.component';

describe('ExpertProfileDataComponent', () => {
  let component: ExpertProfileDataComponent;
  let fixture: ComponentFixture<ExpertProfileDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertProfileDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertProfileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
