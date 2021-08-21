import { Component, Input, OnInit } from '@angular/core';
import { PlayerStats } from 'src/app/models/player-stats';

@Component({
  selector: 'ch-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss']
})
export class PlayerStatsComponent implements OnInit {
  @Input() playerStats: PlayerStats;

  constructor() { }

  ngOnInit(): void {
  }

}
