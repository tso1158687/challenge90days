import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallenageComponent } from './challenage.component';

describe('ChallenageComponent', () => {
  let component: ChallenageComponent;
  let fixture: ComponentFixture<ChallenageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallenageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallenageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
