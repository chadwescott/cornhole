import { Component, input } from '@angular/core';
import { PlayerStats } from '../../models/player-stats';

@Component({
  selector: 'ch-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss'],
  standalone: false
})
export class PlayerStatsComponent {
  playerStats = input.required<PlayerStats>();
}
