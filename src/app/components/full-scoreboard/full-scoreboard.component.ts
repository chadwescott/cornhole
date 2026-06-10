import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { Game } from '../../models/game';
import { ThrowResult } from '../../models/throw-result';

@Component({
  selector: 'ch-full-scoreboard',
  templateUrl: './full-scoreboard.component.html',
  styleUrls: ['./full-scoreboard.component.scss'],
  standalone: false
})
export class FullScoreboardComponent implements OnInit {
  game = input.required<Game>();

  @Output()
  resetStreak = new EventEmitter<Game>();

  @Output()
  resetStats = new EventEmitter<Game>();

  @Output()
  resetGame = new EventEmitter<Game>();

  @Output()
  close = new EventEmitter();

  throwResult = ThrowResult;

  ngOnInit(): void {
  }
}
