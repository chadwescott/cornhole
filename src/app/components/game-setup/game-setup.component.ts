import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Game } from 'src/app/models/game';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'ch-game-setup',
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.scss']
})
export class GameSetupComponent implements OnInit {
  @Output()
  createGame = new EventEmitter<Game>();

  team1: Team;
  team2: Team;

  constructor() { }

  ngOnInit(): void {
  }
}
