import { Component, output } from '@angular/core';

import { Team } from '../../models/team';

@Component({
  selector: 'ch-team-selector',
  templateUrl: './team-selector.component.html',
  styleUrls: ['./team-selector.component.scss'],
  standalone: true
})
export class TeamSelectorComponent {
  teamSelected = output<Team>();
}
