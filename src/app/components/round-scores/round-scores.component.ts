import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { Game } from '../../models/game.model';
import { ThrowResultIconComponent } from '../throw-result-icon/throw-result-icon.component';

@Component({
    selector: 'ch-round-scores',
    templateUrl: './round-scores.component.html',
    styleUrls: ['./round-scores.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ThrowResultIconComponent
    ]
})
export class RoundScoresComponent {
    game = input.required<Game>();
}
