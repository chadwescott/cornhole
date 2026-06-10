import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { Game } from '../../models/game';
import { ThrowResult } from '../../models/throw-result';
import { CardComponent } from '../card/card.component';
import { GameStatsComponent } from '../game-stats/game-stats.component';
import { ThrowResultIconComponent } from '../throw-result-icon/throw-result-icon.component';

@Component({
  selector: 'ch-full-scoreboard',
  templateUrl: './full-scoreboard.component.html',
  styleUrls: ['./full-scoreboard.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    GameStatsComponent,
    MatButtonModule,
    ThrowResultIconComponent
  ]
})
export class FullScoreboardComponent implements OnInit {
  game = input.required<Game>();

  @Output()
  resetStreak = new EventEmitter<Game>();

  @Output()
  resetStats = new EventEmitter<Game>();

  @Output()
  resetGame = new EventEmitter<Game>();

  @Output()
  close = new EventEmitter();

  throwResult = ThrowResult;

  ngOnInit(): void {
  }
}
