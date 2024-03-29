import { Injectable } from '@angular/core';

import { GameConstants } from '../constants/game.constants';
import { Game } from '../models/game';
import { Player } from '../models/player';
import { PlayerStats } from '../models/player-stats';
import { Round } from '../models/round';
import { Team } from '../models/team';
import { TeamColor } from '../models/team-color';
import { Throw } from '../models/throw';
import { ThrowResult } from '../models/throw-result';

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
    if (this.players) {
      this.players.map(x => {
        if (!x.stats) {
          x.stats = new PlayerStats();
        }
      });
    }
  }

  clearData(): void {
    this.players = [];
    this.teams = [];
    this.games = [];

    localStorage.removeItem(this.gamesKey);
    localStorage.removeItem(this.teamsKey);
    localStorage.removeItem(this.playersKey);
  }

  private savePlayers(): void {
    localStorage.setItem(this.playersKey, JSON.stringify(this.players));
  }

  private saveTeams(): void {
    localStorage.setItem(this.teamsKey, JSON.stringify(this.teams));
  }

  saveGames(): void {
    localStorage.setItem(this.gamesKey, JSON.stringify(this.games));
  }

  getGames(): Game[] {
    return this.games;
  }

  loadGame(game: Game): void {
    this.setTeamColor(game.team1);
    this.setTeamColor(game.team2);
    game.team1.players.map(x => { if (!x.stats) { x.stats = new PlayerStats() }; });
    game.team2.players.map(x => { if (!x.stats) { x.stats = new PlayerStats() }; });
  }

  setTeamColor(team: Team): void {
    this.saveTeams();
    this.saveGames();
  }

  createPlayer(name: string): Player {
    const player = new Player(name);
    this.players.push(player);
    this.savePlayers();
    return player;
  }

  createTeam(players: Player[], teamNumber: number, teamColor: TeamColor): Team {
    const team = new Team(players, teamNumber, teamColor);
    this.teams.push(team);
    this.saveTeams();
    return team;
  }

  createGame(team1: Team, team2: Team): Game {
    const game = new Game(team1, team2);
    this.games.push(game);
    this.addRound(game);
    this.saveGames();
    this.loadGame(game);
    return game;
  }

  updateTeamColor(team: Team): void {
    this.setTeamColor(team);
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

    this.saveGames();
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

  completeRound(game: Game): void {
    this.calculateStatsForLastRound(game);
    if (!game.complete) {
      this.addRound(game);
    }
  }

  private calculateStatsForLastRound(game: Game) {
    const lastRound = game.rounds[game.rounds.length - 1];

    const playerIndex = game.team1.players.length === 1 ? 0 : (game.rounds.length + 1) % 2;

    lastRound.team1Throws.map(x => this.updateThrowResult(game.team1.players[playerIndex].stats, x.result));
    lastRound.team2Throws.map(x => this.updateThrowResult(game.team2.players[playerIndex].stats, x.result));
    game.team1.players[playerIndex].stats.pointsGained += lastRound.team1NetScore;
    game.team2.players[playerIndex].stats.pointsGained += lastRound.team2NetScore;
    game.team1.players[playerIndex].stats.pointsLost += lastRound.team2NetScore;
    game.team2.players[playerIndex].stats.pointsLost += lastRound.team1NetScore;

    game.team1.players.forEach((player: Player) => this.calculateScoringRate(player.stats));
    game.team2.players.forEach((player: Player) => this.calculateScoringRate(player.stats));
    this.calculateTeamStats(game.team1);
    this.calculateTeamStats(game.team2);

    this.updateScoreStreak(game);
  }

  private updateThrowResult(stats: PlayerStats, throwResult: ThrowResult): void {
    stats.totalThrows++;
    stats.throwResults[throwResult]++;
    stats.cornholeRate = stats.throwResults[ThrowResult.Cornhole] / stats.totalThrows;
  }

  private calculateScoringRate(stats: PlayerStats): void {
    stats.totalPoints = stats.throwResults[ThrowResult.Cornhole] * GameConstants.POINTS[ThrowResult.Cornhole]
      + stats.throwResults[ThrowResult.OnBoard] * GameConstants.POINTS[ThrowResult.OnBoard];
    stats.scoringRate = stats.totalPoints / stats.totalThrows * 4;
  }

  private calculateTeamStats(team: Team): void {
    if (team.stats == null) { team.stats = new PlayerStats(); }
    team.stats.throwResults[ThrowResult.Cornhole] = team.players.map(p => p.stats.throwResults[ThrowResult.Cornhole]).reduce((previous, current) => previous + current);
    team.stats.throwResults[ThrowResult.OnBoard] = team.players.map(p => p.stats.throwResults[ThrowResult.OnBoard]).reduce((previous, current) => previous + current);
    team.stats.throwResults[ThrowResult.OffBoard] = team.players.map(p => p.stats.throwResults[ThrowResult.OffBoard]).reduce((previous, current) => previous + current);
    team.stats.totalThrows = team.players.map(p => p.stats.totalThrows).reduce((previous, current) => previous + current);
    team.stats.totalPoints = team.players.map(p => p.stats.totalPoints).reduce((previous, current) => previous + current);
    team.stats.cornholeRate = team.stats.throwResults[ThrowResult.Cornhole] / team.stats.totalThrows;
    team.stats.scoringRate = team.stats.totalPoints / team.stats.totalThrows * 4;
    team.stats.pointsGained = team.players.map(p => p.stats.pointsGained).reduce((p, c) => p + c);
    team.stats.pointsLost = team.players.map(p => p.stats.pointsLost).reduce((p, c) => p + c);
  }

  private updateScoreStreak(game: Game): void {
    const lastRound = game.rounds[game.rounds.length - 1];
    if (lastRound.team1NetScore > 0) {
      game.team1.scoreStreak += lastRound.team1NetScore;
      game.team2.scoreStreak = 0;
    } else if (lastRound.team2NetScore > 0) {
      game.team2.scoreStreak += lastRound.team2NetScore;
      game.team1.scoreStreak = 0;
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
    this.calculateStatsForLastRound(game);
    this.updateScoreStreak(game);
    this.resetStats(game);
  }

  resetStats(game: Game): void {
    game.team1.players.map(x => x.stats = new PlayerStats());
    game.team2.players.map(x => x.stats = new PlayerStats());
    game.team1.stats = new PlayerStats();
    game.team2.stats = new PlayerStats();
  }

  resetStreak(game: Game): void {
    game.team1.scoreStreak = 0;
    game.team2.scoreStreak = 0;
    this.saveGames();
  }

  resetGame(game: Game): Game {
    this.games.splice(this.games.indexOf(game), 1);
    const newGame = this.createGame(game.team1, game.team2);
    this.resetStats(newGame);
    this.saveGames();
    return newGame;
  }
}
