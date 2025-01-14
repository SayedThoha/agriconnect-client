import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotAddingComponent } from './slot-adding.component';

describe('SlotAddingComponent', () => {
  let component: SlotAddingComponent;
  let fixture: ComponentFixture<SlotAddingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotAddingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotAddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
