import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetThesesComponent } from './projet-theses.component';

describe('ProjetThesesComponent', () => {
  let component: ProjetThesesComponent;
  let fixture: ComponentFixture<ProjetThesesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjetThesesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetThesesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
