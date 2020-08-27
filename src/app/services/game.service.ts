import { Injectable } from '@angular/core';

import { Game } from '../models/game';
import { Round } from '../models/round';
import { Throw } from '../models/throw';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  createGame(team1Name: string, team2Name: string): Game {
    const game = new Game(team1Name, team2Name, []);
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
  }
}
