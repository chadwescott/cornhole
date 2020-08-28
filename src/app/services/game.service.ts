import { Injectable } from '@angular/core';

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

  constructor() { }

  private savePlayers(): void {
    localStorage.setItem(this.playersKey, JSON.stringify(this.players));
  }

  private saveTeams(): void {
    localStorage.setItem(this.teamsKey, JSON.stringify(this.teams));
  }

  private saveGames(): void {
    localStorage.setItem(this.gamesKey, JSON.stringify(this.games));
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
}
