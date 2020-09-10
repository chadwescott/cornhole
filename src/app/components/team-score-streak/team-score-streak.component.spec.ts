import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamScoreStreakComponent } from './team-score-streak.component';

describe('TeamScoreStreakComponent', () => {
  let component: TeamScoreStreakComponent;
  let fixture: ComponentFixture<TeamScoreStreakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamScoreStreakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamScoreStreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
