import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemeTechniquesComponent } from './probleme-techniques.component';

describe('ProblemeTechniquesComponent', () => {
  let component: ProblemeTechniquesComponent;
  let fixture: ComponentFixture<ProblemeTechniquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemeTechniquesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemeTechniquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
