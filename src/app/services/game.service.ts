import { Injectable } from '@angular/core';

import { GameConstants } from '../constants/game.constants';
import { Game } from '../models/game';
import { Player } from '../models/player';
import { Round } from '../models/round';
import { Team } from '../models/team';
import { Throw } from '../models/throw';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly teamsKey = 'TEAMS';
  private readonly playersKey = 'PLAYERS';
  private readonly gamesKey = 'GAMES';

  players: Player[] = [];
  teams: Team[] = [];
  games: Game[] = [];

  constructor() {
    this.games = JSON.parse(localStorage.getItem(this.gamesKey));
    this.players = JSON.parse(localStorage.getItem(this.playersKey));
    this.teams = JSON.parse(localStorage.getItem(this.gamesKey));
  }

  clearData(): void {
    this.players = [];
    this.teams = [];
    this.games = [];

    this.savePlayers();
    this.saveTeams();
    this.saveGames();
  }

  private savePlayers(): void {
    localStorage.setItem(this.playersKey, JSON.stringify(this.players));
  }

  private saveTeams(): void {
    localStorage.setItem(this.teamsKey, JSON.stringify(this.teams));
  }

  private saveGames(): void {
    localStorage.setItem(this.gamesKey, JSON.stringify(this.games));
  }

  getGames(): Game[] {
    return this.games;
  }

  createPlayer(name: string): Player {
    const player = new Player(name);
    this.players.push(player);
    this.savePlayers();
    return player;
  }

  createTeam(players: Player[]): Team {
    const team = new Team(players);
    this.teams.push(team);
    this.saveTeams();
    return team;
  }

  createGame(team1: Team, team2: Team): Game {
    const game = new Game(team1, team2);
    this.games.push(game);
    this.addRound(game);
    return game;
  }

  throwChanged(game: Game): void {

  }

  roundScoreChanged(round: Round): void {
    let team1Score = 0;
    round.team1Throws.map(x => team1Score += x.points);
    round.team1TotalScore = team1Score;

    let team2Score = 0;
    round.team2Throws.map(x => team2Score += x.points);
    round.team2TotalScore = team2Score;

    round.team1NetScore = Math.max(round.team1TotalScore - round.team2TotalScore, 0);
    round.team2NetScore = Math.max(round.team2TotalScore - round.team1TotalScore, 0);
    round.complete = !round.team1Throws.find(x => !x.result) && !round.team2Throws.find(x => !x.result);

    const game = this.games.find(x => x.rounds.includes(round));
    if (game) {
      this.calculateGameScore(game);
    }
  }

  private calculateGameScore(game: Game): void {
    let team1Score = 0;
    game.rounds.map(x => team1Score += x.team1NetScore);
    game.team1Score = team1Score;

    let team2Score = 0;
    game.rounds.map(x => team2Score += x.team2NetScore);
    game.team2Score = team2Score;

    if (!game.rounds.find(x => !x.complete)) {
      game.complete = game.team1Score >= GameConstants.WINNING_SCORE || game.team2Score >= GameConstants.WINNING_SCORE;
      if (game.complete) {
        game.winner = game.team1Score >= GameConstants.WINNING_SCORE ? game.team1 : game.team2;
      } else {
        game.complete = false;
        game.winner = null;
      }
    }
  }

  addRound(game: Game): void {
    const team1Throws: Throw[] = [];
    const team2Throws: Throw[] = [];
    for (let i = 0; i < 4; i++) {
      team1Throws.push(new Throw(null));
      team2Throws.push(new Throw(null));
    }
    game.rounds.push(new Round(team1Throws, team2Throws));
    this.saveGames();
  }

  completeGame(game: Game): void {
    console.log(game.winner);
  }
}
