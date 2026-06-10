import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { Game } from '../../models/game';
import { ThrowResult } from '../../models/throw-result';

@Component({
  selector: 'ch-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss'],
  standalone: false
})
export class GameStatsComponent implements OnInit {
  game = input.required<Game>();

  @Output()
  close = new EventEmitter();

  throwResult = ThrowResult;

  constructor() { }

  ngOnInit(): void {
  }
}
