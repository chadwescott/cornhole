import { Component, OnInit } from '@angular/core';

import { Game } from './models/game';
import { Round } from './models/round';
import { GameService } from './services/game.service';

@Component({
  selector: 'ch-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  game: Game;
  activeRound: Round;

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    this.game = this.gameService.getGames().find(x => !x.complete);
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
    this.activateLastRound(this.game);
  }

  onRoundChanged(round: Round): void {
    this.activeRound = round;
  }

  onAddRound(game: Game): void {
    this.gameService.addRound(game);
    this.activateLastRound(game);
  }

  activateLastRound(game: Game): void {
    this.activeRound = game.rounds ? game.rounds[game.rounds.length - 1] : null;
    console.log(this.activeRound);
  }

  onRoundScoreChanged(round: Round): void {
    this.gameService.roundScoreChanged(round);
  }

  onCompleteGame(game: Game): void {
    this.gameService.completeGame(game);
    this.game = null;
  }
}
