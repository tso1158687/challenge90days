import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinCardComponent } from './checkin-card.component';

describe('CheckinCardComponent', () => {
  let component: CheckinCardComponent;
  let fixture: ComponentFixture<CheckinCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckinCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
