import { Component, Input, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'ch-team-score-streak',
  templateUrl: './team-score-streak.component.html',
  styleUrls: ['./team-score-streak.component.scss']
})
export class TeamScoreStreakComponent implements OnInit {
  @Input()
  team: Team;

  constructor() { }

  ngOnInit(): void {
  }

}
