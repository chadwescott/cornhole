import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from 'src/app/models/game';

@Component({
  selector: 'ch-full-scoreboard',
  templateUrl: './full-scoreboard.component.html',
  styleUrls: ['./full-scoreboard.component.scss']
})
export class FullScoreboardComponent implements OnInit {
  @Input()
  game: Game;

  @Output()
  resetStreak = new EventEmitter<Game>();

  @Output()
  resetStats = new EventEmitter<Game>();

  @Output()
  resetGame = new EventEmitter<Game>();

  @Output()
  close = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
}
