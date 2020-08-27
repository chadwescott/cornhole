import { Component, OnInit } from '@angular/core';

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
    this.game = this.gameService.createGame('Chad', 'Nancy');
  }
}
