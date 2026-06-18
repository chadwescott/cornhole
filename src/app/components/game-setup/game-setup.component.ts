import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { Game } from '../../models/game.model';
import { Team } from '../../models/team.model';
import { TeamSelectorComponent } from '../team-selector/team-selector.component';

@Component({
  selector: 'ch-game-setup',
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    TeamSelectorComponent
  ]
})
export class GameSetupComponent {
  @Output()
  createGame = new EventEmitter<Game>();

  team1: Team | null = null;
  team2: Team | null = null;
}
