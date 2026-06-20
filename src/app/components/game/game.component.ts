import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { Game } from '../../models/game.model';
import { Round } from '../../models/round.model';
import { Team } from '../../models/team.model';
import { FullScoreboardComponent } from '../full-scoreboard/full-scoreboard.component';
import { GameOptionsComponent } from '../game-options/game-options.component';
import { RoundComponent } from '../round/round.component';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';

@Component({
  selector: 'ch-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  standalone: true,
  imports: [
    FullScoreboardComponent,
    GameOptionsComponent,
    MatButtonModule,
    RoundComponent,
    ScoreboardComponent
  ]
})
export class GameComponent {
  game = input.required<Game>();
  activeRound = input.required<Round>();

  @Output()
  roundChanged = new EventEmitter<Round>();

  @Output()
  completeRound = new EventEmitter<Game>();

  @Output()
  roundScoreChanged = new EventEmitter<Round>();

  @Output()
  completeGame = new EventEmitter<Game>();

  @Output()
  gameSummary = new EventEmitter<Game>();

  @Output()
  playersChanged = new EventEmitter();

  @Output()
  teamColorChanged = new EventEmitter<Team>();

  @Output()
  resetStats = new EventEmitter<Game>();

  @Output()
  resetStreak = new EventEmitter<Game>();

  @Output()
  resetGame = new EventEmitter<Game>();

  showOptions = false;
  showFullScoreboard = false;

  onRoundChanged(index: number): void {
    if (this.game().rounds.length > index) {
      this.roundChanged.emit(this.game().rounds[index]);
    }
  }

  showGameSummary(): void {
    this.gameSummary.emit(this.game());
    this.showFullScoreboard = true;
  }

  gameSummaryClosed(): void {
    this.showFullScoreboard = false;
    if (this.game().complete) {
      this.completeGame.emit(this.game());
    }
  }
}
