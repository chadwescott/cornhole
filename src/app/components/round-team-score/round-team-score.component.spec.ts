import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundTeamScoreComponent } from './round-team-score.component';

describe('RoundTeamScoreComponent', () => {
  let component: RoundTeamScoreComponent;
  let fixture: ComponentFixture<RoundTeamScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundTeamScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundTeamScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
