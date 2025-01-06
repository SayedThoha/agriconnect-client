import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialisationComponent } from './specialisation.component';

describe('SpecialisationComponent', () => {
  let component: SpecialisationComponent;
  let fixture: ComponentFixture<SpecialisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
