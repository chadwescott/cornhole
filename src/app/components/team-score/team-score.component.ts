import { Component, input } from '@angular/core';
import { DesignOptions } from '../../models/design-options.enum';
import { Team } from '../../models/team.model';

@Component({
  selector: 'ch-team-score',
  templateUrl: './team-score.component.html',
  styleUrls: ['./team-score.component.scss'],
  standalone: true
})
export class TeamScoreComponent {
  teamNumber = input.required<number>();
  team = input.required<Team>();
  score = input.required<number>();
  throwIndex = input<number>(0);

  designOptions = DesignOptions;
}
