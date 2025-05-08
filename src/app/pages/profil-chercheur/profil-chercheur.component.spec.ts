import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilChercheurComponent } from './profil-chercheur.component';

describe('ProfilChercheurComponent', () => {
  let component: ProfilChercheurComponent;
  let fixture: ComponentFixture<ProfilChercheurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilChercheurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilChercheurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
