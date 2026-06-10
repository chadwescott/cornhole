import { Component, input, OnInit } from '@angular/core';
import { DesignOptions } from '../../models/design-options.enum';
import { Team } from '../../models/team';

@Component({
  selector: 'ch-team-score',
  templateUrl: './team-score.component.html',
  styleUrls: ['./team-score.component.scss'],
  standalone: true
})
export class TeamScoreComponent implements OnInit {
  teamNumber = input.required<number>();
  team = input.required<Team>();
  score = input.required<number>();

  designOptions = DesignOptions;

  constructor() { }

  ngOnInit(): void {
  }

}
