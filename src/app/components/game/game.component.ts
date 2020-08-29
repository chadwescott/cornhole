import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameConstants } from 'src/app/constants/game.constants';
import { Game } from 'src/app/models/game';
import { Round } from 'src/app/models/round';

@Component({
  selector: 'ch-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Input()
  game: Game;

  @Output()
  addRound = new EventEmitter<Game>();

  @Output()
  completeGame = new EventEmitter<Game>();

  constructor() { }

  ngOnInit(): void {
  }

  onRoundChanged(round: Round): void {
    let team1Score = 0;
    this.game.rounds.map(x => team1Score += x.team1NetScore);
    this.game.team1Score = team1Score;

    let team2Score = 0;
    this.game.rounds.map(x => team2Score += x.team2NetScore);
    this.game.team2Score = team2Score;

    this.game.complete = this.game.team1Score >= GameConstants.WINNING_SCORE || this.game.team2Score >= GameConstants.WINNING_SCORE;
  }
}
