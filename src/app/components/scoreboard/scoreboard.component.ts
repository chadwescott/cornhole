import { Component, input } from '@angular/core';
import { Game } from '../../models/game';

@Component({
  selector: 'ch-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  standalone: false
})
export class ScoreboardComponent {
  game = input.required<Game>();
}
