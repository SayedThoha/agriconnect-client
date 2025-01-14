import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileDataComponent } from './user-profile-data.component';

describe('UserProfileDataComponent', () => {
  let component: UserProfileDataComponent;
  let fixture: ComponentFixture<UserProfileDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
