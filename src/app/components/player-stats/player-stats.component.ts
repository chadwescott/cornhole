import { Component, input } from '@angular/core';
import { PlayerStats } from '../../models/player-stats';

import { CardComponent } from '../card/card.component';

@Component({
  selector: 'ch-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss'],
  standalone: true,
  imports: [CardComponent]
})
export class PlayerStatsComponent {
  playerStats = input<PlayerStats | null>(null);
}
