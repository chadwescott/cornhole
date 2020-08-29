import { Component, OnInit } from '@angular/core';

import { GameConstants } from './constants/game.constants';
import { Game } from './models/game';
import { GameService } from './services/game.service';

@Component({
  selector: 'ch-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  game: Game;

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    this.createNewGame();
  }

  createNewGame(): void {
    this.gameService.clearData();
    const player1 = this.gameService.createPlayer('Chad');
    const player2 = this.gameService.createPlayer('Nancy');
    const player3 = this.gameService.createPlayer('Molly');
    const player4 = this.gameService.createPlayer('Elizabeth');
    const team1 = this.gameService.createTeam([player1, player2]);
    const team2 = this.gameService.createTeam([player3, player4]);
    this.game = this.gameService.createGame(team1, team2);
  }

  onAddRound(game: Game): void {
    this.gameService.addRound(game);
  }

  onRoundChanged(game: Game): void {
    let team1Score = 0;
    game.rounds.map(x => team1Score += x.team1NetScore);
    game.team1Score = team1Score;

    let team2Score = 0;
    game.rounds.map(x => team2Score += x.team2NetScore);
    game.team2Score = team2Score;

    game.complete = game.team1Score >= GameConstants.WINNING_SCORE || game.team2Score >= GameConstants.WINNING_SCORE;
  }

  onCompleteGame(game: Game): void {
    this.gameService.completeGame(game);
    this.createNewGame();
  }
}
