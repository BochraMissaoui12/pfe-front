import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppeldOffresComponent } from './appeld-offres.component';

describe('AppeldOffresComponent', () => {
  let component: AppeldOffresComponent;
  let fixture: ComponentFixture<AppeldOffresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppeldOffresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppeldOffresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
