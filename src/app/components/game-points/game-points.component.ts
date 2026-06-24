import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { Game } from '../../models/game.model';

@Component({
    selector: 'ch-game-points',
    templateUrl: './game-points.component.html',
    styleUrls: ['./game-points.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class GamePointsComponent {
    game = input.required<Game>();
}
