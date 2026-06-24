import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { Game } from '../../models/game.model';
import { ThrowResult } from '../../models/throw-result.model';

@Component({
    selector: 'ch-game-throws',
    templateUrl: './game-throws.component.html',
    styleUrls: ['./game-throws.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class GameThrowsComponent {
    game = input.required<Game>();

    throwResult = ThrowResult;
}
