import { Component, input } from '@angular/core';
import { Game } from '../../models/game.model';

import { TeamScoreComponent } from '../team-score/team-score.component';

@Component({
  selector: 'ch-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  standalone: true,
  imports: [TeamScoreComponent]
})
export class ScoreboardComponent {
  game = input.required<Game>();
}
