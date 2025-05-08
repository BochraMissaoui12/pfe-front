import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EproblemesComponent } from './eproblemes.component';

describe('EproblemesComponent', () => {
  let component: EproblemesComponent;
  let fixture: ComponentFixture<EproblemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EproblemesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EproblemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
