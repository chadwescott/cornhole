import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { Player } from '../../models/player';

@Component({
  selector: 'ch-player-selector',
  templateUrl: './player-selector.component.html',
  styleUrls: ['./player-selector.component.scss'],
  standalone: false
})
export class PlayerSelectorComponent implements OnInit {
  players = input.required<Player[]>();

  @Output()
  playerSelected = new EventEmitter<Player>();

  @Output()
  playerAdded = new EventEmitter<Player>();

  constructor() { }

  ngOnInit(): void {
  }

}
