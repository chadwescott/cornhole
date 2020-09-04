import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'ch-player-selector',
  templateUrl: './player-selector.component.html',
  styleUrls: ['./player-selector.component.scss']
})
export class PlayerSelectorComponent implements OnInit {
  @Input()
  players: Player[];

  @Output()
  playerSelected = new EventEmitter<Player>();

  @Output()
  playerAdded = new EventEmitter<Player>();

  constructor() { }

  ngOnInit(): void {
  }

}
