import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/models/game';

@Component({
  selector: 'ch-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  @Input()
  game: Game;

  constructor() { }

  ngOnInit(): void {
  }
}
