import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CevenementsActualitesComponent } from './cevenements-actualites.component';

describe('CevenementsActualitesComponent', () => {
  let component: CevenementsActualitesComponent;
  let fixture: ComponentFixture<CevenementsActualitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CevenementsActualitesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CevenementsActualitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
