import { Component, OnInit } from '@angular/core';

import { Game } from './models/game';
import { Round } from './models/round';
import { Team } from './models/team';
import { TeamColor } from './models/team-color';
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
    this.game = this.gameService.getGames()?.find(x => !x.complete);
    if (this.game) {
      this.gameService.loadGame(this.game);
      this.activeRound = this.game.rounds[this.game.rounds.length - 1];
    } else {
      this.createNewGame();
    }
  }

  createNewGame(): void {
    this.gameService.clearData();
    // const player1 = this.gameService.createPlayer('Chad');
    // const player2 = this.gameService.createPlayer('Nancy');
    // const player3 = this.gameService.createPlayer('Molly');
    // const player4 = this.gameService.createPlayer('Elizabeth');
    // const team1 = this.gameService.createTeam([player1, player2]);
    // const team2 = this.gameService.createTeam([player3, player4]);
    // this.game = this.gameService.createGame(team1, team2);
    const player1 = this.gameService.createPlayer('Blue Team');
    const player2 = this.gameService.createPlayer('Red Team');
    // const player3 = this.gameService.createPlayer('Molly');
    // const player4 = this.gameService.createPlayer('Elizabeth');
    const team1 = this.gameService.createTeam([player1], 1, new TeamColor('Blue', 'blue', 'white'));
    const team2 = this.gameService.createTeam([player2], 2, new TeamColor('Red', 'red', 'white'));
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
  }

  onRoundScoreChanged(round: Round): void {
    this.gameService.roundScoreChanged(round);
  }

  onTeamColorChanged(team: Team): void {
    this.gameService.updateTeamColor(team);
  }

  onCompleteGame(game: Game): void {
    this.gameService.completeGame(game);
    // this.game = null;
    this.game = this.gameService.createGame(game.team1, game.team2);
    this.activateLastRound(this.game);
    // this.createNewGame();
  }
}
