import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EoffresComponent } from './eoffres.component';

describe('EoffresComponent', () => {
  let component: EoffresComponent;
  let fixture: ComponentFixture<EoffresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EoffresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EoffresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
