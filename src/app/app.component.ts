import { Component, OnInit } from '@angular/core';

import { TEAM_COLORS } from './constants/team-color.constants';
import { Game } from './models/game';
import { Round } from './models/round';
import { Team } from './models/team';
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
    const player1 = this.gameService.createPlayer('Player 1');
    const player2 = this.gameService.createPlayer('Player 2');
    const team1 = this.gameService.createTeam([player1], 1, TEAM_COLORS[0]);
    const team2 = this.gameService.createTeam([player2], 2, TEAM_COLORS[2]);
    this.game = this.gameService.createGame(team1, team2);
    this.activateLastRound(this.game);
  }

  onRoundChanged(round: Round): void {
    this.activeRound = round;
  }

  onCompleteRound(game: Game): void {
    this.gameService.completeRound(game);
    this.activateLastRound(game);
  }

  onGameSummary(game: Game): void {
    this.gameService.completeRound(game);
  }

  activateLastRound(game: Game): void {
    this.activeRound = game.rounds ? game.rounds[game.rounds.length - 1] : null
  }

  onRoundScoreChanged(round: Round): void {
    this.gameService.roundScoreChanged(round);
  }

  onTeamColorChanged(team: Team): void {
    this.gameService.updateTeamColor(team);
  }

  onPlayersChanged(): void {
    this.gameService.saveGames();
  }

  onCompleteGame(game: Game): void {
    this.gameService.completeGame(game);
    this.game = this.gameService.createGame(game.team1, game.team2);
    this.activateLastRound(this.game);
  }

  onResetStats(game: Game): void {
    this.gameService.resetStats(game);
  }

  onResetStreak(game: Game): void {
    this.gameService.resetStreak(game);
  }

  onResetGame(game: Game): void {
    this.game = this.gameService.resetGame(game);
    this.activateLastRound(this.game);
  }
}
