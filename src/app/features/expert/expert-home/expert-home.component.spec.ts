import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertHomeComponent } from './expert-home.component';

describe('ExpertHomeComponent', () => {
  let component: ExpertHomeComponent;
  let fixture: ComponentFixture<ExpertHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
