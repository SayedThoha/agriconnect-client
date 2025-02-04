import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExpertProfileComponent } from './user-expert-profile.component';

describe('UserExpertProfileComponent', () => {
  let component: UserExpertProfileComponent;
  let fixture: ComponentFixture<UserExpertProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserExpertProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserExpertProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
