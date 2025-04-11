import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturesListComponent } from './candidatures-list.component';

describe('CandidaturesListComponent', () => {
  let component: CandidaturesListComponent;
  let fixture: ComponentFixture<CandidaturesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidaturesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidaturesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
