import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertChatComponent } from './expert-chat.component';

describe('ExpertChatComponent', () => {
  let component: ExpertChatComponent;
  let fixture: ComponentFixture<ExpertChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
