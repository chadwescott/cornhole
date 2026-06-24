import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';

import { Game } from '../../models/game.model';
import { GamePointsComponent } from '../game-points/game-points.component';
import { GameThrowsComponent } from '../game-throws/game-throws.component';

@Component({
  selector: 'ch-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss'],
  standalone: true,
  imports: [CommonModule, GameThrowsComponent, GamePointsComponent]
})
export class GameStatsComponent implements OnInit {
  game = input.required<Game>();

  @Output()
  close = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
}
