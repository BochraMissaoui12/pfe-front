import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppelsOffresComponent } from './appels-offres.component';

describe('AppelsOffresComponent', () => {
  let component: AppelsOffresComponent;
  let fixture: ComponentFixture<AppelsOffresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppelsOffresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppelsOffresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
