import { Component, Input, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'ch-team-score',
  templateUrl: './team-score.component.html',
  styleUrls: ['./team-score.component.scss']
})
export class TeamScoreComponent implements OnInit {
  @Input()
  teamNumber: number;

  @Input()
  team: Team;

  @Input()
  score: number;

  @Input()
  winner: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
