import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CprojetsComponent } from './cprojets.component';

describe('CprojetsComponent', () => {
  let component: CprojetsComponent;
  let fixture: ComponentFixture<CprojetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CprojetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CprojetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
