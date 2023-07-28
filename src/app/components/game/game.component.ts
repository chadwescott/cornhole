import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from 'src/app/models/game';
import { Round } from 'src/app/models/round';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'ch-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Input()
  game: Game;

  @Input()
  activeRound: Round;

  @Output()
  roundChanged = new EventEmitter<Round>();

  @Output()
  completeRound = new EventEmitter<Game>();

  @Output()
  roundScoreChanged = new EventEmitter<Round>();

  @Output()
  completeGame = new EventEmitter<Game>();

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
  showPlayerStats = false;
  showFullScoreboard = false;

  constructor() { }

  ngOnInit(): void {
  }

  onRoundChanged(index: number): void {
    if (this.game.rounds.length > index) {
      this.roundChanged.emit(this.game.rounds[index]);
    }
  }

  gameSummaryClosed(): void {
    this.showFullScoreboard = false;
    if (this.game.complete) {
      this.completeGame.emit(this.game);
    }
  }
}
