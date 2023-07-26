import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScoreboardComponent } from './full-scoreboard.component';

describe('FullScoreboardComponent', () => {
  let component: FullScoreboardComponent;
  let fixture: ComponentFixture<FullScoreboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FullScoreboardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
