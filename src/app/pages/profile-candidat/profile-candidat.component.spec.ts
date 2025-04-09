import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCandidatComponent } from './profile-candidat.component';

describe('ProfileCandidatComponent', () => {
  let component: ProfileCandidatComponent;
  let fixture: ComponentFixture<ProfileCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileCandidatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
