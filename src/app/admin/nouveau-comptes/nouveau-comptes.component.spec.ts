import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauComptesComponent } from './nouveau-comptes.component';

describe('NouveauComptesComponent', () => {
  let component: NouveauComptesComponent;
  let fixture: ComponentFixture<NouveauComptesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouveauComptesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouveauComptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
