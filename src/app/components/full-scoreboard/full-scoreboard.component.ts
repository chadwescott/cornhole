import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { Game } from '../../models/game.model';
import { ThrowResult } from '../../models/throw-result.model';
import { CardComponent } from '../card/card.component';
import { GamePointsComponent } from '../game-points/game-points.component';
import { GameThrowsComponent } from '../game-throws/game-throws.component';
import { RoundScoresComponent } from '../round-scores/round-scores.component';

@Component({
  selector: 'ch-full-scoreboard',
  templateUrl: './full-scoreboard.component.html',
  styleUrls: ['./full-scoreboard.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    GamePointsComponent,
    GameThrowsComponent,
    MatButtonModule,
    RoundScoresComponent
  ]
})
export class FullScoreboardComponent implements OnInit {
  game = input.required<Game>();

  @Output()
  close = new EventEmitter();

  throwResult = ThrowResult;

  ngOnInit(): void {
  }
}
