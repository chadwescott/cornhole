import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from 'src/app/models/game';
import { ThrowResult } from 'src/app/models/throw-result';

@Component({
  selector: 'ch-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss']
})
export class GameStatsComponent implements OnInit {
  @Input()
  game: Game;

  @Output()
  close = new EventEmitter();

  throwResult = ThrowResult;

  constructor() { }

  ngOnInit(): void {
  }
}
